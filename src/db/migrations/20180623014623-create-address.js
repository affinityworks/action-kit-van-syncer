'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('addresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      addressableId: {
        type: Sequelize.INTEGER
      },
      addressable: {
        type: Sequelize.STRING
      },
      addressId: {
        type: Sequelize.INTEGER
      },
      addressLine1: {
        type: Sequelize.STRING
      },
      addressLine2: {
        type: Sequelize.STRING
      },
      addressLine3: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      stateOrProvince: {
        type: Sequelize.STRING
      },
      zipOrPostalCode: {
        type: Sequelize.STRING
      },
      countryCode: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      isPreferred: {
        type: Sequelize.BOOLEAN
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
    return queryInterface.dropTable('addresses');
  }
};