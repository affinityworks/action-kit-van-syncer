'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('roles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      roleId: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isEventLead: {
        type: Sequelize.BOOLEAN
      },
      min: {
        type: Sequelize.INTEGER
      },
      max: {
        type: Sequelize.INTEGER
      },
      goal: {
        type: Sequelize.INTEGER
      },
      rolable: {
        type: Sequelize.STRING
      },
      rolableId: {
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
    return queryInterface.dropTable('roles');
  }
};