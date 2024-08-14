const { UserRoom, Message, User, Room } = require("../models");

class Controller {
  // Method untuk menemukan semua rooms yang diikuti oleh user
  static async findRoom(req, res) {
    try {
      const group = await UserRoom.findAll({
        include: [User, Room],
      });
      res.status(200).json(group);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching rooms." });
    }
  }

  // Method untuk join room
  static async joinroom(req, res) {
    const { roomId } = req.params;
    const { username } = req.query;

    try {
      const [user] = await User.findOrCreate({
        where: { username },
        defaults: { username },
      });

      const room = await Room.findByPk(roomId);

      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      await UserRoom.create({
        RoomId: roomId,
        UserId: user.id,
        joinedAt: new Date(),
      });

      res
        .status(200)
        .json({ message: `User ${username} joined room ${roomId}` });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while joining the room." });
    }
  }
}

module.exports = Controller;
