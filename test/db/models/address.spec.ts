import {describe, it, test, before, after} from "mocha"
import {expect} from "chai"
import {Database, initDb} from "../../../src/db"
import {keys, pick} from "lodash"
import {AddressInstance} from "../../../src/db/models/address"
import {LocationInstance} from "../../../src/db/models/location"
import {locationAttrs, vanEventTree} from "../../fixtures/vanEvent"

describe("Address model", () => {
  const addressAttrs = vanEventTree[0].locations[0].address
  let db: Database, address: AddressInstance, location: LocationInstance

  before(async () => {
    db = initDb()
    location = await db.Location.create(locationAttrs)
    address = await db.Address.create({
      ...addressAttrs,
      addressable: "location",
      addressableId: location.id,
    })
  })

  after(async () => {
    await db.Address.destroy({where: {}})
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
