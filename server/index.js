const express = require('express');
const {createServer} = require('http')
const app = express()
const {Server} = require('socket.io')
const server = createServer(app);
const port = process.env.Port || 3000;
const io = new Server(server ,{
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
  }
})

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.static('public'))
app.get('/', (req , res)=> {
    res.send("this is working properly ", port)
})

io.on("connection", (socket) => {
  console.log("New client:", socket.id);

  socket.on("join", ({username , roomId}) => {
    socket.join(roomId);
    socket.username = username;
    socket.roomId = roomId;
    console.log(username, "joined with id", socket.id);
    console.log(`${username} connect room : ${roomId}`);
    socket.to(roomId).emit("new-user", { id: socket.id, username });
  });
socket.on("signal", ({ to, data }) => {
  io.to(to).emit("signal", { from: socket.id, username: socket.username, data });
});

  socket.on("disconnect", () => {
  if (socket.roomId) {
    io.to(socket.roomId).emit("user-left", socket.id);
  }

  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

