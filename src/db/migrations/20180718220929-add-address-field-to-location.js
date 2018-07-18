'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('locations', 'address', { type: Sequelize.JSON })
  },
  
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('locations', 'address')
  }
};