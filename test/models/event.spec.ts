import {describe, it, test, before, after} from "mocha"
import {expect} from "chai"
import {initDb} from "../../src/db"
import {keys, pick} from "lodash"
import {locationAttrs, vanEvents} from "../fixtures/vanEvent"

describe("Event model", () => {

  let db, event
  before(async () => {
    db = initDb()
    event = await db.Event.create({
      ...vanEvents[0],
      location: locationAttrs,
    }, {
      include: [{ model: db.Location, as: "location" }],
    })
  })

  after(async () => {
    await db.Event.destroy({where: {}})
    await db.Location.destroy({where: {}})
    await db.sequelize.close()
  })

  test("fields", () => {
    expect(keys(event.dataValues)).to.eql([
      "id",
      "actionKitId",
      "name",
      "description",
      "createdDate",
      "startDate",
      "endDate",
      "eventType",
      "codes",
      "notes",
      "location",
      "updatedAt",
      "createdAt",
      "vanId",
      "eventId",
      "shortName"
    ])
  })

  test("associations", async () => {
    const ascLocation = await event.getLocation()
    expect(pick(ascLocation.dataValues, keys(locationAttrs))).to.eql(locationAttrs)
  })
})
