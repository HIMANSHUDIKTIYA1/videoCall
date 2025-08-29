import React from "react";

const Join = ({ localName, setLocalName, roomId, setRoomId, handleJoin }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <form
        onSubmit={handleJoin}
        className="bg-white/10 backdrop-blur-md border border-red-600 p-8 rounded-2xl shadow-2xl flex flex-col gap-6 w-80 sm:w-96 text-white"
      >
        {/* Title */}
        <h2 className="text-2xl font-extrabold text-center text-red-500 tracking-wide">
          Join Video Call
        </h2>

        {/* Username */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-200">
            Username
          </label>
          <input
            type="text"
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            placeholder="Enter your name"
            className="bg-black text-white border border-gray-700 focus:border-red-500 rounded-lg px-4 py-2 outline-none placeholder-gray-400"
          />
        </div>

        {/* Room ID */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-200">
            Room ID
          </label>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter room ID"
            className="bg-black text-white border border-gray-700 focus:border-red-500 rounded-lg px-4 py-2 outline-none placeholder-gray-400"
          />
        </div>

        {/* Join Button */}
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 active:bg-red-800 transition-colors duration-200 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-red-500/30"
        >
          🚀 Join Now
        </button>

        {/* Footer note */}
        <p className="text-xs text-center text-gray-400">
          Enter a username & room ID to start/join a call.
        </p>
      </form>
    </div>
  );
};

export default Join;
