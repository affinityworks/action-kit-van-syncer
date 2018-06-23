'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .removeColumn('locations','vanId')
      .then(() =>
        queryInterface.addColumn(
          'locations',
          'locationId', {
            type:Sequelize.INTEGER,
            unique: true,
          }
        )
      )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface
      .removeColumn('locations', 'locationId')
      .then(() =>
        queryInterface.addColumn(
          'locations',
          'vanId', {
            type: Sequelize.INTEGER
          }
        )
      )
  }
}
