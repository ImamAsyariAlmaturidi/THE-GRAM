const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

// Import controllers
const UserController = require("./controllers/userController");
const RoomController = require("./controllers/roomController");
const UserRoomController = require("./controllers/userRoomController");
const MessageController = require("./controllers/messageController");

const app = express();
const port = 3000;

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.set("io", io);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/login", UserController.createOrLogin);
app.post("/rooms", RoomController.createRoom);
app.get("/allrooms", RoomController.findAllRoom);
app.post("/joinroom/:roomId", UserRoomController.joinroom);
app.get("/message/:roomId", MessageController.findAllMessageRoom);
app.post("/message/:roomId", MessageController.createMessage);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", ({ roomId, username }) => {
    socket.join(roomId);
    console.log(`${username} joined room ${roomId}`);
    socket.to(roomId).emit("message", `${username} has joined the room.`);
  });

  socket.on("sendMessage", ({ roomId, username, message }) => {
    io.to(roomId).emit("message", { username, message });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
