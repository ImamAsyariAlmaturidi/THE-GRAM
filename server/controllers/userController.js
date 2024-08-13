const { User } = require("../models");
class Controller {
  static async createUser(req, res) {
    const { username } = req.body;
    try {
      const user = await User.createOrLogin;
    } catch (error) {
      res.send(error);
    }
  }
}
