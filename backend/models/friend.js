
"use strict";
// untuk sequelize yang digunakan untuk menghubungkan antara tabel database dengan model yang akan digunakan
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Friend extends Model {
    static associate(models) {
      // define association here
    }
  }
  Friend.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Friend",
    }
  );
  return Friend;
};