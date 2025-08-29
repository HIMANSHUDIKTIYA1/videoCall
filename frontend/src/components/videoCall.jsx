import React, { useEffect, useRef, useState, useCallback } from "react";
import Main from "./MainPage";
import Join from "./Join";


const DEFAULT_ICE_SERVERS = [{ urls: "stun:stun1.l.google.com:19302" }];

const VideoCall = ({ socket }) => {
  const [joined, setJoined] = useState(false);
  const [localName, setLocalName] = useState("");
  const [remoteName, setRemoteName] = useState("");
  const [roomId, setRoomId] = useState("");

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);

  const peersRef = useRef({});
  const pendingCandidatesRef = useRef({});

  // Helper: create / get peer
  const createPeer = useCallback(
    (remoteId, username, initiator = false) => {
      if (!localStreamRef.current) {
        console.error("Local stream not ready when creating peer");
        return null;
      }

      const peer = new RTCPeerConnection({ iceServers: DEFAULT_ICE_SERVERS });

      // add local tracks
      localStreamRef.current.getTracks().forEach((track) => {
        peer.addTrack(track, localStreamRef.current);
      });

      // remote stream
      peer.ontrack = (e) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = e.streams[0];
          setRemoteName(username);
        }
      };

      peer.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("signal", {
            to: remoteId,
            data: { candidate: e.candidate },
            roomId,
          });
        }
      };

      if (initiator) {
        (async () => {
          try {
            const offer = await peer.createOffer();
            await peer.setLocalDescription(offer);
            socket.emit("signal", {
              to: remoteId,
              data: { sdp: peer.localDescription },
              roomId,
            });
          } catch (err) {
            console.error("Error creating offer:", err);
          }
        })();
      }

      return peer;
    },
    [socket, roomId]
  );

  // Join action
  const handleJoin = async (e) => {
    e.preventDefault();
    const name = localName.trim();
    const room = roomId.trim();

    if (!name || !room) return alert("Enter name and room ID!");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;

      setJoined(true);

      // ✅ join ke sath room bhi send karo
      socket.emit("join", { username: name, roomId: room });
    } catch (err) {
      console.error("Could not get local stream:", err);
      alert("Could not access camera/microphone. Check permissions.");
    }
  };

  useEffect(() => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
  }, [joined]);

  // Socket listeners setup
  useEffect(() => {
    if (!socket) return;

    socket.on("new-user", ({ id, username }) => {
      const peer = createPeer(id, username, true);
      if (peer) peersRef.current[id] = peer;
    });

    socket.on("user-joined", ({ id, username }) => {
      const peer = createPeer(id, username, false);
      if (peer) peersRef.current[id] = peer;
    });

    socket.on("signal", async ({ from, username, data }) => {
      try {
        let peer = peersRef.current[from];
        if (!peer) {
          peer = createPeer(from, username, false);
          if (peer) peersRef.current[from] = peer;
        }

        if (data.sdp) {
          await peer.setRemoteDescription(new RTCSessionDescription(data.sdp));
          if (pendingCandidatesRef.current[from]) {
            for (const cand of pendingCandidatesRef.current[from]) {
              await peer.addIceCandidate(new RTCIceCandidate(cand));
            }
            delete pendingCandidatesRef.current[from];
          }
          if (data.sdp.type === "offer") {
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);
            socket.emit("signal", {
              to: from,
              data: { sdp: peer.localDescription },
              roomId,
            });
          }
        } else if (data.candidate) {
          if (peer.remoteDescription && peer.remoteDescription.type) {
            await peer.addIceCandidate(new RTCIceCandidate(data.candidate));
          } else {
            if (!pendingCandidatesRef.current[from])
              pendingCandidatesRef.current[from] = [];
            pendingCandidatesRef.current[from].push(data.candidate);
          }
        }
      } catch (err) {
        console.error("Error handling 'signal':", err);
      }
    });

    socket.on("user-left", (id) => {
      const peer = peersRef.current[id];
      if (peer) {
        try {
          peer.close();
        } catch (e) {}
        delete peersRef.current[id];
      }
      if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
        remoteVideoRef.current.srcObject = null;
      }
    });

    return () => {
      socket.off("new-user");
      socket.off("user-joined");
      socket.off("signal");
      socket.off("user-left");
    };
  }, [socket, createPeer]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      const peers = peersRef.current;
      Object.keys(peers).forEach((k) => {
        try {
          peers[k].close();
        } catch (e) {}
        delete peers[k];
      });
    };
  }, []);

  return (
    <>
      {!joined ? (
        <Join
          localName={localName}
          setLocalName={setLocalName}
          roomId={roomId}
          setRoomId={setRoomId}
          handleJoin={handleJoin}
        />
      ) : (
        <Main
          localName={localName}
          remoteName={remoteName}
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          roomId={roomId}
        />
      )}
    </>
  );
};

export default VideoCall;
