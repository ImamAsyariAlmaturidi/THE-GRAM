const { User } = require("../models");
class Controller {
  static async createOrLogin(req, res) {
    const { username } = req.body;
    try {
      const [user, created] = await User.findOrCreate({
        where: { username },
        defaults: {
          username,
        },
        hooks: false,
      });

      res.status(201).json({
        user,
      });
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = Controller;
