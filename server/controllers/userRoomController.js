const { UserRoom, Message, User, Room } = require("../models");
class Controller {
  static async findRoom(req, res) {
    try {
      const group = await UserRoom.findAll({
        include: [User, Room],
      });
      res.status(200).json(group);
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async joinroom(req, res) {
    const { roomId } = req.params;
    const { username } = req.query;
    try {
      const user = await User.findOne({ where: { username } });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const room = await Room.findByPk(roomId);

      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      await UserRoom.findOrCreate({
        where: { UserId: user.id, RoomId: roomId, joinedAt: new Date() },
      });

      //   const socketId = req.body.socketId;
      //   const socket = io.sockets.sockets.get(socketId);

      //   if (socket) {
      //     socket.join(roomId);
      //     console.log(`Socket ${socketId} joined room ${roomId}`);
      //   }

      res
        .status(200)
        .json({ message: `User ${username} joined room ${roomId}` });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Controller;
