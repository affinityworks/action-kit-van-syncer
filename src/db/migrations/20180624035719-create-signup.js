'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('signups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      actionKitId: {
        type: Sequelize.INTEGER,
        unique: true,
      },
      eventSignupId: {
        type: Sequelize.INTEGER,
        unique: true,
      },
      status: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      personId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      eventId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      vanEventId: {
        type: Sequelize.INTEGER,
      },
      shiftId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      vanShiftId: {
        type: Sequelize.INTEGER
      },
      role: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      locationId: {
        type: Sequelize.INTEGER
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('signups');
  }
};