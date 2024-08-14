const { Room, Message, User } = require("../models");
class Controller {
  static async createRoom(req, res) {
    const { name } = req.body;
    try {
      const room = await Room.create({
        name,
      });
      res.status(201).json(room);
    } catch (error) {
      res.send(error);
    }
  }

  static async findAllRoom(req, res) {
    try {
      const allroom = await Room.findAll({
        include: {
          model: Message,
          include: User,
        },
      });
      res.status(200).json(allroom);
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = Controller;
