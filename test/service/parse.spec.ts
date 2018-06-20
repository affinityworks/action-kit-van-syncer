import {expect} from "chai"
import {describe, it} from "mocha"
import {parseVanEvent, parseVanEvents} from "../../src/service/parse"
import {actionKitEventTree} from "../fixtures/actionKit"
import {vanEventTree} from "../fixtures/van"

describe("parse module", () => {
  it("parses a van event tree from an action kit event tree", () => {
    expect(parseVanEvents(actionKitEventTree)).to.eql(vanEventTree)
  })
})
