"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert("Quizzes", [
      {
        question: "Capital de Italia",
        answer: "Roma",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: "Capital de Francia",
        answer: "París",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: "Capital de España",
        answer: "Madrid",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: "Capital de Portugal",
        answer: "Lisboa",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
