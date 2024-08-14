"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    //add new column for isRequest in chats table as boolean
    await queryInterface.addColumn("Chats", "isRequest", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    //remove the isRequest column from chats table
    await queryInterface.removeColumn("Chats", "isRequest");
    /**
     * 
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
