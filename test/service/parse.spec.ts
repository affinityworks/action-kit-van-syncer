import {expect} from "chai"
import {describe, it} from "mocha"
import {parseVanEvents} from "../../src/service/parse"
import {actionKitEventTree} from "../fixtures/actionKitEvent"
import {vanEventTree} from "../fixtures/vanEvent"
import {clone} from "lodash"

describe("parse module", () => {
  it("parses a van event tree from an action kit event tree", () => {
    expect(parseVanEvents(actionKitEventTree)).to.eql(vanEventTree)
  })
})
