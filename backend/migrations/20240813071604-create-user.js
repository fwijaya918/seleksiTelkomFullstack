'use strict';
// untuk proses db:migrate untuk memudahkan pembuatan database sesuai dengan tabel yang diinginkan
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      username:{
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      profile_picture: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
