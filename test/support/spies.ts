import {VanApiResponse} from "../../src/api/vanApi"
import * as vanApi from "../../src/api/vanApi"
import sinon from "ts-sinon"

type VanApiMethod =
"createEvent" |
  "createPerson" |
  "createShift" |
  "createSignup"

// TODO: provide an actual Sinon return type eventually?
export const vanApiStubOf = (method: VanApiMethod, response: VanApiResponse): sinon.SinonStub =>
  sinon
    .stub(vanApi, method)
    .callsFake(() => Promise.resolve(response))
