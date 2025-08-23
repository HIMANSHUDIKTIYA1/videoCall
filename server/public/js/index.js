const socket = io();
let localStream;
let peers = {}; 
let pendingCandidates = {}; // store ICE candidates if remote description not ready

const joinBtn = document.getElementById("joinBtn");
const joinScreen = document.getElementById("join-screen");
const videoCall = document.getElementById("video-call");

joinBtn.onclick = async () => {
  const localName = document.getElementById("username").value.trim();
  if (!localName) return alert("Enter name!");

  joinScreen.classList.add("hidden");
  videoCall.classList.remove("hidden");
  document.getElementById("local-name").textContent = "You: " + localName;



  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    document.getElementById("localVideo").srcObject = localStream;
 socket.emit("join", localName);
  } catch (err) {
    console.error("Could not get local stream:", err);
  }
};

// new user joined
socket.on("new-user", ({ id, username }) => {
  console.log("New user:", username);

  const peer = createPeer(id, username, true);
  peers[id] = peer;
});

socket.on("user-joined", ({ id, username }) => {
  peers[id] = createPeer(id, username, false);
});

// incoming signal
socket.on("signal", async ({ from, data }) => {
  let peer = peers[from];

  // Agar peer abhi tak bana nahi → create karlo
  if (!peer) {
    console.warn("Peer not found for", from, "→ creating now");
    peer = createPeer(from);
    peers[from] = peer;
  }

  try {
    if (data.sdp) {
      // ✅ SDP description
      console.log("Incoming SDP:", data.sdp);
      await peer.setRemoteDescription(data.sdp);
      



if (pendingCandidates[from]) {
  for (let cand of pendingCandidates[from]) {
    await peer.addIceCandidate(new RTCIceCandidate(cand));
  }
  delete pendingCandidates[from];
}
      if (data.sdp.type === "offer") {
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socket.emit("signal", { to: from, data: { sdp: peer.localDescription } });
     
      }

    } else if (data.candidate) {
      // ✅ Candidate sirf tab add karo jab remoteDescription set hai
      if (peer.remoteDescription) {
        await peer.addIceCandidate(new RTCIceCandidate(data.candidate));
      } else {
        console.warn("Remote description not set yet → candidate ignored");
         if (!pendingCandidates[from]) pendingCandidates[from] = [];
    pendingCandidates[from].push(data.candidate);
      }
    }
  } catch (err) {
    console.error("Error handling signal:", err);
  }
});

// user left
socket.on("user-left", (id) => {
  if (peers[id]) {
    peers[id].close();
    delete peers[id];
    document.getElementById("remoteVideo").srcObject = null;
    document.getElementById("remote-name").textContent = "";
  }
});

function createPeer(remoteId, username, initiator) {
  if (!localStream) {
    console.error("Local stream not initialized yet!");
    return;
  }

  const peer = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun1.l.google.com:19302" }]
  });

  localStream.getTracks().forEach(track => peer.addTrack(track, localStream));

  peer.ontrack = e => {
    document.getElementById("remoteVideo").srcObject = e.streams[0];
    document.getElementById("remote-name").textContent = "Remote: " + username;
  };

  peer.onicecandidate = e => {
    if (e.candidate) {
      socket.emit("signal", { to: remoteId, data: { candidate: e.candidate } });
      

    }
  };

  if (initiator) {
    (async () => {
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      socket.emit("signal", { to: remoteId, data:{
    sdp: {
      type: peer.localDescription.type,   // "offer" ya "answer"
      sdp: peer.localDescription.sdp      // pura SDP string
    }
  }

       });
    })();
  }

  return peer;
}
