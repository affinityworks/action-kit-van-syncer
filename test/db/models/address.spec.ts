import {describe, it, test, before, after} from "mocha"
import {expect} from "chai"
import {Database, initDb} from "../../../src/db"
import {keys, pick, cloneDeep} from "lodash"
import {AddressInstance} from "../../../src/db/models/address"
import {LocationInstance} from "../../../src/db/models/location"
import {locationAttrs, vanEventTree} from "../../fixtures/vanEvent"

describe("Address model", () => {
  const addressAttrs = cloneDeep(vanEventTree)[0].locations[0].address
  let db: Database, address: AddressInstance, location: LocationInstance

  before(async () => {
    db = initDb()
    location = await db.location.create(locationAttrs)
    address = await db.address.create({
      ...addressAttrs,
      addressable: "location",
      addressableId: location.id,
    })
  })

  after(async () => {
    await db.address.destroy({where: {}})
    await db.sequelize.close()
  })

  test("fields", () => {
    expect(pick(address, keys(addressAttrs))).to.eql(addressAttrs)
  })

  test("associations", async () => {
    const l = await address.getLocation()
    expect(l.get()).to.eql(location.get())
  })
})
