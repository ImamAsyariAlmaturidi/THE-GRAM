"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const users = require("../data/user.json");
    const rooms = require("../data/room.json");
    const userRooms = require("../data/userRoom.json");
    const messages = require("../data/message.json");

    await queryInterface.bulkInsert("Users", users, {});
    await queryInterface.bulkInsert("Rooms", rooms, {});
    await queryInterface.bulkInsert("UserRooms", userRooms, {});
    await queryInterface.bulkInsert("Messages", messages, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Users", null, {});
    await queryInterface.bulkDelete("Rooms", null, {});
    await queryInterface.bulkDelete("UserRooms", null, {});
    await queryInterface.bulkDelete("Messages", null, {});
  },
};
