const express = require('express');
const {createServer} = require('http')
const app = express()
const {Server} = require('socket.io')
const server = createServer(app);
const port = process.env.Port || 3000;
const io = new Server(server)

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.static('public'))
app.get('/', (req , res)=> {
    res.render('index')
})

io.on("connection", (socket) => {
  console.log("New client:", socket.id);

  socket.on("join", (username) => {
    console.log(username, "joined with id", socket.id);
    socket.broadcast.emit("new-user", { id: socket.id, username });
  });
socket.on("signal", ({ to, data }) => {
  io.to(to).emit("signal", { from: socket.id, data });
});

  socket.on("disconnect", () => {
    socket.broadcast.emit("user-left", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

