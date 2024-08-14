//make me a model for chat using chats from the migrations
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    static associate(models) {
      // define association here
    }
  }
  Chat.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      sender: DataTypes.STRING,
      receiver: DataTypes.STRING,
      message: DataTypes.STRING,
      isRequest: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Chat",
    }
  );
  return Chat;
};
