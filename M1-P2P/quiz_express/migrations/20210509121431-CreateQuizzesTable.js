"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /** Propiedades de la tabla Quizzes */
    await queryInterface.createTable(
      "Quizzes",
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          unique: true,
        },
        question: {
          type: Sequelize.STRING,
          unique: true,
        },
        answer: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      },
      {
        sync: { force: true },
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    /** Borrando de la tabla Quizzes */
    await queryInterface.dropTable("Quizzes");
  },
};
