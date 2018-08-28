'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface
      .removeColumn('people','actionKitId')
      .then(() =>
        queryInterface.addColumn(
          'people',
          'actionKitId', {
            type: Sequelize.INTEGER,
          }
        )
      )

    return queryInterface
      .removeColumn('people','vanId')
      .then(() =>
        queryInterface.addColumn(
          'people',
          'vanId', {
            type: Sequelize.INTEGER,
          }
        )
      )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface
      .removeColumn('people','actionKitId')
      .then(() =>
        queryInterface.addColumn(
          'people',
          'actionKitId', {
            type: Sequelize.INTEGER,
            unique: true,
          }
        )
      )

    return queryInterface
      .removeColumn('people','vanId')
      .then(() =>
        queryInterface.addColumn(
          'people',
          'vanId', {
            type: Sequelize.INTEGER,
            unique: true,
          }
        )
      )
  }
}

