import {VanApiResponse} from "../../src/api/vanApi"
import * as sinon from "sinon"
import * as vanApi from "../../src/api/vanApi"

// TODO: provide an actual Sinon return type eventually?
export const vanApiStubOf = (method: string, response: VanApiResponse): any =>
  sinon
    .stub(vanApi, method)
    .callsFake(() => Promise.resolve(response))
