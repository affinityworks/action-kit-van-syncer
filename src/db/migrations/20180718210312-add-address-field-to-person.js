'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('people', 'addresses', { type: Sequelize.JSON })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('people', 'addresses')
  }
};
