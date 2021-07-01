"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable(
      "Groups",
      {
        id: {
          type: Sequelize.INTEGER,
          unique: true,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: Sequelize.STRING,
          validate: { notEmpty: { msg: "Group must not be empty." } },
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

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable("Groups");
  },
};
