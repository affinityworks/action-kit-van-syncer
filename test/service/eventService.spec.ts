import {expect} from "chai"
import {describe, it, before, after, beforeEach} from "mocha"
import {initDb} from "../../src/db/index"
import * as eventService from "../../src/db/service/eventService"
import {vanEvents} from "../fixtures/vanEvent"

describe("event service", () => {
  let db

  before(() => db = initDb())
  after(async () => await db.sequelize.close())
  
  beforeEach(async () => await db.Event.destroy({where: {}}))
  
  it("creates an event", async () => {
    await eventService.create(db, vanEvents[0])
    expect(await db.Event.count()).to.eql(1)
  })
  
  it("creates many events", async () => {
    await eventService.createMany(db, vanEvents)
    expect(await db.Event.count()).to.eql(2)
  })
  
  it("creates an event with associations")
  
  it("creates many events with associations")
})
