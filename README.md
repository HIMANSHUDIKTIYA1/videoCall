# 📹 videoCall — WebRTC One-to-One Calling

Real-time 1:1 video chat built with **WebRTC** for media and **Socket.io** for signaling.  
Includes room system, camera/mic toggle, and real-time chat.

**Repo:** `HIMANSHUDIKTIYA1/videoCall`  
**Tech Stack:** React, Node/Express, Socket.io, WebRTC (getUserMedia, RTCPeerConnection), Tailwind (optional)

---

## ✨ Features

- Create / Join room (short room ID or URL share)  
- Peer-to-peer video call (WebRTC)  
- Camera / Mic on–off  
- In-room text chat (Socket.io)  
- Auto-reconnect signaling on refresh  
- Basic responsive UI  

---

## 📂 Project Structure (suggested)
videoCall/
├─ client/                  # React frontend
│  ├─ src/
│  │  ├─ components/        # Reusable UI components
│  │  │  ├─ LocalVideo.tsx  # Component for showing local video stream
│  │  │  ├─ RemoteVideo.tsx # Component for showing remote video streams
│  │  │  └─ ChatPanel.tsx   # Component for chat interface
│  │  ├─ context/           # React Context for global state
│  │  │  └─ CallContext.tsx # Provides call-related state and functions
│  │  ├─ hooks/             # Custom React hooks
│  │  │  └─ useWebRTC.ts    # Hook handling WebRTC logic
│  │  ├─ pages/             # Application pages / views
│  │  │  ├─ Home.tsx        # Landing page
│  │  │  └─ Room.tsx        # Video call room page
│  │  ├─ socket.ts          # Socket.io client setup
│  │  └─ main.tsx           # React app entry point
│  └─ index.html            # Main HTML file
└─ server/                  # Node.js backend
   ├─ index.js              # Server entry point
   └─ rooms.js              # Room management logic


---

## ⚙️ Prerequisites

- Node.js ≥ 18  
- npm / yarn / pnpm  
- **HTTPS** required for camera/mic in browsers (localhost works without HTTPS)  
- TURN server required for strict NAT networks  

---

## 🔐 Environment Variables

**client/.env**
```env
VITE_SOCKET_URL=http://localhost:4000
VITE_STUN_URL=stun:stun.l.google.com:19302
VITE_TURN_URL=turn:your-turn.example.com:3478
VITE_TURN_USER=yourUser
VITE_TURN_PASS=yourPass

PORT=4000
CORS_ORIGIN=http://localhost:5173
# 1. Clone repo
git clone https://github.com/HIMANSHUDIKTIYA1/videoCall.git
cd videoCall

# 2. Install dependencies
cd server && npm install
cd ../client && npm install

# 3. Run dev servers
# in /server
npm run dev
# in /client
npm run dev

# open http://localhost:5173


🧠 How It Works (WebRTC Flow)
User joins room → signaling handled with Socket.io

Caller creates RTCPeerConnection → generates offer

Callee responds with answer

Both exchange ICE candidates

Once connection established → direct P2P media stream

🗺️ Roadmap
Group calls (multi-peer)

Screen sharing

Recording support

Message history

🔗 Links
Live Demo: add link here

Client: /client

Server: /server

📄 License
MIT © Himanshu Diktiya

