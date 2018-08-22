import {after, before, describe, it} from "mocha"
import {initDb} from "../../src/db"
import {sync} from "../../src"
import * as nock from "nock"
import {wait} from "../support/time"
import * as actionKitAPI from "../../src/service/actionKitAPI"
import sinon from "ts-sinon"
import {updatedActionKitEventTree} from "../fixtures/functionalActionKitEventUpdate"
import {expect} from "chai"

describe("AK to VAN Create And Update Resources Slice", () => {
  const db = initDb()
  const sandbox = sinon.createSandbox()

  before(async () => {
    await db.event.destroy({where: {}})
    await db.location.destroy({where: {}})
    await db.shift.destroy({where: {}})
    await db.signup.destroy({where: {}})
    await db.person.destroy({where: {}})
    nock.restore()
  })

  after(async () => {
    await db.event.destroy({where: {}})
    await db.location.destroy({where: {}})
    await db.shift.destroy({where: {}})
    await db.signup.destroy({where: {}})
    await db.person.destroy({where: {}})
    await db.sequelize.close()
  })

  it("sends create and update requests to VAN", async function() {
    this.timeout(0)

    await sync(db)
    await wait(10000)

    sandbox.stub(actionKitAPI, "getEventTrees").returns(Promise.resolve(updatedActionKitEventTree))

    await sync(db)
    await wait(5000)
  })
})
