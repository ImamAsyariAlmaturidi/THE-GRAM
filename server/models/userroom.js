"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserRoom.belongsTo(models.User);
      UserRoom.belongsTo(models.Room);
    }
  }
  UserRoom.init(
    {
      UserId: DataTypes.INTEGER,
      RoomId: DataTypes.INTEGER,
      joinedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "UserRoom",
    }
  );
  return UserRoom;
};
