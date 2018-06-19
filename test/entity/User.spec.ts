import {expect} from "chai"
import {User} from "../../src/entity/User"
import {test} from "../../config"
import {createConnection} from "typeorm"
import {clone, omit} from "lodash"
import {describe} from "mocha"

describe("User", () => {
  let userRepo

  before(async () => {
    const connection = await createConnection(test.db)
    userRepo = connection.getRepository(User)
    await userRepo.delete({})
  })
  after( async () => await userRepo.delete({}))

  it("starts with an empty repo", async () => {
      expect(await userRepo.count()).to.equal(0)
  })

  describe("creating a user", () => {
    const sampleUser = { firstName: "Timber", lastName: "Saw", age: 25, akId: 100 }
    before(async () => await userRepo.save(clone(sampleUser)))
    after(async () => await userRepo.delete(sampleUser))

    it("creates a User", async () => {
      expect(await userRepo.count()).to.equal(1)
    })

    it("creates user with correct fields", async () => {
      expect(omit(await userRepo.findOne(), ["id", "email", "vanId"])).to.eql(sampleUser)
    })
  })
})
