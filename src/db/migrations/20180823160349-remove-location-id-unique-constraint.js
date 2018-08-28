'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .removeColumn('locations','locationId')
      .then(() =>
        queryInterface.addColumn(
          'locations',
          'locationId', {
            type:Sequelize.INTEGER,
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
          'locationId', {
            type:Sequelize.INTEGER,
            unique: true,
          }
        )
      )
  }
}
