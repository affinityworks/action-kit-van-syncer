import {expect} from "chai"
import {User} from "../../app/entity/User"
import {test} from "../../../config"
import {createConnection} from "typeorm"
import {clone, omit} from "lodash"

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
    const sampleUser = { firstName: "Timber", lastName: "Saw", age: 25 }
    before(async () => await userRepo.save(clone(sampleUser)))
    after(async () => await userRepo.delete(sampleUser))

    it("creates a User", async () => {
      expect(await userRepo.count()).to.equal(1)
    })

    it("creates user with correct fields", async () => {
      expect(omit(await userRepo.findOne(), ["id"])).to.eql(sampleUser)
    })

    it("finds a user by name", async () => {
      expect(omit(await userRepo.findOne({ firstName: "Timber" }), ["id"])).to.eql(sampleUser)
    })
  })

  describe("relationships", () => {
    const sampleUser = { firstName: "Timber", lastName: "Saw", age: 25, akId: 100 }
    let user
    before(async () => {
      await userRepo.save( {...clone(sampleUser), phones: [{number: "6151234567", type: "mobile"}]})
      user = userRepo.findOne({relation: ["phones"]})
    })

    after(async () => {
      await userRepo.delete(sampleUser)
    })

    it("saves a user with a phone", async () => {
      expect(user.  reload.phones).to.eql([{number: "6151234567", type: "mobile"}])
    })
  })
})
