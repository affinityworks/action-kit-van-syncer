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

export const vanApiStubRandomVanIdResponse = (sinonSandbox, method: VanApiMethod): sinon.SinonStub =>
  sinonSandbox
    .stub(vanApi, method)
    .onFirstCall().returns({ vanId: Math.round(Math.random() * 1000000000) })
    .onSecondCall().returns({ vanId: Math.round(Math.random() * 1000000000) })
