import {greet} from "../app/greet";
import {expect} from "chai";

describe("our test suite", () => {
   it("works", () => {
       expect(greet("James")).to.equal("Hi James!");
   })
});