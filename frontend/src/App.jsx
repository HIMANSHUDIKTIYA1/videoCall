import React from 'react'
import   VideoCall from './components/videoCall'
import { io } from "socket.io-client";

const App = () => {
 const socket = io("http://localhost:3000");
 
  return (
    <div>
      <VideoCall socket={socket} />
    </div>
  )
}

export default App
