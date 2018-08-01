import {after, before, describe, it} from "mocha"
import {initDb} from "../../src/db"
import {sync} from "../../src"
import {expect} from "chai"
import * as nock from "nock"

describe("AK to VAN Create Resource Slice", () => {
  const db = initDb()

  before(async () => {
    await db.event.destroy({where: {}})
    await db.location.destroy({where: {}})
    await db.shift.destroy({where: {}})
    await db.signup.destroy({where: {}})
    await db.person.destroy({where: {}})
  })

  after(async () => {
    await db.event.destroy({where: {}})
    await db.location.destroy({where: {}})
    await db.shift.destroy({where: {}})
    await db.signup.destroy({where: {}})
    await db.person.destroy({where: {}})
    await db.sequelize.close()
  })

  it("pulls from AK successfully", function(done) {
    this.timeout(0)
    nock.restore()
    sync(db)

    setTimeout( async () => {
      const event = await db.event.findOne()
      const person = await db.person.findOne()
      const signup = await db.signup.findOne()
      expect(event.eventId).to.exist
      expect(person.vanId).to.exist
      expect(signup.eventSignupId).to.exist
      done()
    }, 5000 )
  })
})
