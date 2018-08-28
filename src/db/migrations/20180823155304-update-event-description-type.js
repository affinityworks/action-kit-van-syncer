'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .removeColumn('events', 'description')
      .then(() => queryInterface
        .addColumn('events', 'description', { type: Sequelize.TEXT }))

  },
  down: (queryInterface, Sequelize) => {
    return queryInterface
      .removeColumn('events', 'description')
      .then(() => queryInterface
        .addColumn('events', 'description', { type: Sequelize.STRING }))
  }
};
