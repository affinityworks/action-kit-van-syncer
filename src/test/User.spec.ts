import {expect} from "chai"
import {User} from "../app/entity/User"
import {createConnection, getRepository} from "typeorm"
import "reflect-metadata"
import {omit} from "lodash"

describe("User", () => {
    let connection
    let userRepo

    before(async () => {
        connection = await createConnection()
        userRepo = getRepository(User)
    })

    beforeEach(async () => {
        await userRepo.create({
            firstName: "Timber",
            lastName: "Saw",
            age: 25
        })
    })

    it("creates a User", async () => {
        const user = await userRepo.findOne({ firstName: "Timber" })
        expect(omit(user, ["id"])).to.eql({
            age: 25,
            firstName: "Timber",
            lastName: "Saw"
        })
    })
})
