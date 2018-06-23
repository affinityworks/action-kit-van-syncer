import {describe, it, test, before, after} from "mocha"
import {expect} from "chai"
import {initDb} from "../../src/db/index"
import {keys, pick} from "lodash"
import {locationAttrs, vanEvents} from "../fixtures/vanEvent"

describe("Location model", () => {


  let db, location, event

  before(async () => {
    db = initDb()
    event = await db.Event.create(vanEvents[0])
    location = await db.Location.create({
      ...locationAttrs,
      eventId: event.id,
    }, {
      include: [{ model: db.Event, as: "event" }],
    })
  })

  after(async () => {
    await db.Event.destroy({where: {}})
    await db.Location.destroy({where: {}})
    await db.sequelize.close()
  })

  test("fields", () => {
    expect(pick(location.dataValues, keys(locationAttrs))).to.eql(locationAttrs)
  })

  test("associations", async () => {
    const associatedEvent = await location.getEvent()
    expect(associatedEvent.dataValues).to.eql(event.dataValues)
  })
})
