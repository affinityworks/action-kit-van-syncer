import {VanApiResponse} from "../../src/service/vanApi"
import * as vanApi from "../../src/service/vanApi"
import sinon from "ts-sinon"

type VanApiMethod =
"createEvent" |
  "createPerson" |
  "createShift" |
  "createSignup" |
  "createLocation"

export const vanApiStubOf = (sinonSandbox, method: VanApiMethod, response: VanApiResponse): sinon.SinonStub =>
  sinonSandbox
    .stub(vanApi, method)
    .callsFake(() => Promise.resolve(response))

export const vanApiStubRandomResponse = (sinonSandbox, method: VanApiMethod, id): sinon.SinonStub =>
  sinonSandbox
    .stub(vanApi, method)
    .callsFake(() => ({ [id]: Math.round(Math.random() * 1000000000) }))
