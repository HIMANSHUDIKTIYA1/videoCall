import React , { useState } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Monitor, MessageCircle } from "lucide-react";

const MainPage = ({
  localName,
  remoteName,
  localVideoRef,
  remoteVideoRef,
  roomId,
}) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

const toggleCamera = () => {
   if (localVideoRef.current?.srcObject) {
      const videoTracks = localVideoRef.current.srcObject.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !isCameraOn;
      });
    }
    setIsCameraOn(!isCameraOn);
};
const openChat = () => {
   setIsChatOpen(true);
};
const handleLeave = () => {
window.location.href = "/";
};
const handleScreenShare = () => {
  // Handle screen share logic

};

const toggleMic = () => {
   if (localVideoRef.current?.srcObject) {
      const audioTracks = localVideoRef.current.srcObject.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !isMicOn; // agar abhi mic on hai, to off kar do
      });
    }
    setIsMicOn(!isMicOn);
};
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 text-white">
      {/* HEADER */}
      <header className="w-full flex justify-between items-center p-4 bg-black/70 backdrop-blur-md shadow-md">
        <h1 className="text-lg md:text-xl font-bold">Room: {roomId || "N/A"}</h1>
        <div className="flex flex-col text-right">
          <span className="font-semibold">You: {localName}</span>
          <span className="italic text-sm">{remoteName ? `Remote: ${remoteName}` : "Waiting..."}</span>
        </div>
      </header>

      {/* VIDEO GRID */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 w-full max-w-6xl">
        {/* LOCAL VIDEO */}
        <div className="flex flex-col items-center space-y-2">
          <span className="text-sm font-medium">Local</span>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-72 md:h-full bg-black rounded-xl object-cover  scale-x-[-1] "
          />
        </div>

        {/* REMOTE VIDEO */}
        <div className="flex flex-col items-center space-y-2">
          <span className="text-sm font-medium">Remote</span>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-72 md:h-full bg-black rounded-xl object-cover scale-x-[-1]"
          />
        </div>
      </div>

      {/* CONTROL BAR */}
      <div className="w-full max-w-4xl bg-black/80 backdrop-blur-lg p-3 flex justify-center gap-6 rounded-t-xl shadow-lg">
        {/* MIC */}
        <button
          onClick={toggleMic}
          className={`p-3 rounded-full ${isMicOn ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
        >
          {isMicOn ? <Mic size={22} /> : <MicOff size={22} />}
        </button>

        {/* CAMERA */}
        <button
          onClick={toggleCamera}
          className={`p-3 rounded-full ${isCameraOn ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
        >
          {isCameraOn ? <Video size={22} /> : <VideoOff size={22} />}
        </button>

        {/* SCREEN SHARE */}
        <button
          onClick={handleScreenShare}
          className="p-3 rounded-full bg-blue-600 hover:bg-blue-700"
        >
          <Monitor size={22} />
        </button>

        {/* CHAT */}
        <button
          onClick={openChat}
          className="p-3 rounded-full bg-yellow-600 hover:bg-yellow-700"
        >
          <MessageCircle size={22} />
        </button>

        {/* LEAVE */}
        <button
          onClick={handleLeave}
          className="p-3 rounded-full bg-red-700 hover:bg-red-800"
        >
          <PhoneOff size={22} />
        </button>
      </div>
    </div>
  );
};

export default MainPage;
