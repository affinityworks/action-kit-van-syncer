'use strict';

const {omit, map, merge} = require("lodash");

// TODO: would be better to import this from compile output forvan.ts --v
const {vanEventTree} = require("../../../test/fixtures/vanEventES5");

const events = map(vanEventTree, event =>
  merge(
    omit(event, [
      "shifts",
      "roles",
      "locations",
      "signups",
    ]),
    {
      eventType: JSON.stringify(event.eventType),
      codes: JSON.stringify(event.codes),
      notes: JSON.stringify(event.notes),
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    }
  )
);

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('events', events, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('events', null, {})
  }
};
