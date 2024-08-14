const { Message, Room, User, UserRoom } = require("../models");

class Controller {
  static async findAllMessageRoom(req, res) {
    const { roomId } = req.params;
    try {
      const messages = await Message.findAll({
        include: {
          model: User,
        },
        where: {
          RoomId: roomId,
        },
        order: [["createdAt", "ASC"]],
      });
      res.status(200).json(messages);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async createMessage(req, res) {
    const { message } = req.body;
    const { roomId } = req.params;
    const { username } = req.query;

    try {
      const user = await User.findOne({
        where: { username },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const newMessage = await Message.create({
        message,
        RoomId: roomId,
        UserId: user.id,
      });

      res.status(201).json(newMessage);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

module.exports = Controller;
