'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface
      .removeColumn('signups','actionKitId')
      .then(() =>
        queryInterface.addColumn(
          'signups',
          'actionKitId', {
            type: Sequelize.INTEGER,
          }
        )
      )

    return queryInterface
      .removeColumn('signups','eventSignupId')
      .then(() =>
        queryInterface.addColumn(
          'signups',
          'eventSignupId', {
            type: Sequelize.INTEGER,
          }
        )
      )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface
      .removeColumn('signups','actionKitId')
      .then(() =>
        queryInterface.addColumn(
          'signups',
          'actionKitId', {
            type: Sequelize.INTEGER,
            unique: true,
          }
        )
      )

    return queryInterface
      .removeColumn('signups','eventSignupId')
      .then(() =>
        queryInterface.addColumn(
          'signups',
          'eventSignupId', {
            type: Sequelize.INTEGER,
            unique: true,
          }
        )
      )
  }
}

