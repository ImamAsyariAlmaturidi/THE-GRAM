const { Message, User } = require("../models");
class Controller {
  static async findAllMessageRoom(req, res) {
    const { roomId } = req.params;
    try {
      const message = await Message.findAll({
        where: {
          RoomId: roomId,
        },
      });
      res.status(200).json(message);
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async createMessage(req, res) {
    const { message } = req.body;
    const { roomId } = req.params;
    const { username } = req.query;
    try {
      const user = await User.findOne({
        where: {
          username,
        },
      });
      const newMessage = await Message.create({
        message,
        RoomId: roomId,
        UserId: user.id,
      });
      res.status(201).json(newMessage);
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = Controller;
