import {expect} from "chai"
import {greet} from "../app/greet"

describe("our test suite", () => {
   it("works", () => {
       expect(greet("James")).to.equal("Hi James!")
   })
})
