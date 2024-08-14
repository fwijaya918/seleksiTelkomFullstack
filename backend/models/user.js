
"use strict";
const { Model } = require("sequelize");
// untuk sequelize yang digunakan untuk menghubungkan antara tabel database dengan model yang akan digunakan
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      password: DataTypes.STRING,
      profile_picture: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
