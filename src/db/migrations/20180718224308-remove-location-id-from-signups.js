'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('signups', 'locationId')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('signups', 'locationId', { type: Sequelize.INTEGER })
  }
};
