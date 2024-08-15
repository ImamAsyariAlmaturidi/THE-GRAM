const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const path = require("path");

// Import controllers (adapt paths as needed)
const UserController = require("./controllers/userController");
const RoomController = require("./controllers/roomController");
const UserRoomController = require("./controllers/userRoomController");
const MessageController = require("./controllers/messageController");

const app = express();
const port = 3000;

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API route handlers
app.post("/login", UserController.createOrLogin);
app.post("/rooms", RoomController.createRoom);
app.get("/allrooms", RoomController.findAllRoom);
app.post("/joinroom/:roomId", UserRoomController.joinroom);
app.get("/message/:roomId", MessageController.findAllMessageRoom);
app.post("/message/:roomId", MessageController.createMessage);

const usernameToSocketMapping = new Map();
const socketToUsernameMapping = new Map();

io.on("connection", (socket) => {
  console.log(`User connected with socket ID: ${socket.id}`);

  socket.on("join-room", (data) => {
    const { roomId, username } = data;
    console.log("User", username, "joined room", roomId);
    usernameToSocketMapping.set(username, socket.id);
    socketToUsernameMapping.set(socket.id, username);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-joined", { username });
  });

  socket.on("offer", (data) => {
    socket.broadcast.emit("offer", data);
  });

  socket.on("answer", (data) => {
    socket.broadcast.emit("answer", data);
  });

  socket.on("ice-candidate", (data) => {
    socket.broadcast.emit("ice-candidate", data);
  });

  socket.on("sendMessage", ({ message, roomId, username }) => {
    console.log(`Message from ${username} in room ${roomId}: ${message}`);
    const newMessage = { message, roomId, username };
    io.to(roomId).emit("message", newMessage);
  });

  socket.on("disconnect", (reason) => {
    console.log(`User ${socket.id} disconnected - reason: ${reason}`);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
