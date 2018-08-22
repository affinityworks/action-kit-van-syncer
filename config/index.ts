import {get} from "lodash"
const DB = require("./db.json")
import SECRETS from "./secrets"
import NETWORK from "./network"
import VANRSVP from "./vanRsvp"

const getEnv = (cfg) =>
  get(cfg, [process.env.NODE_ENV || "development"])

const config = {
  db: getEnv(DB),
  secrets: getEnv(SECRETS),
  network: getEnv(NETWORK),
  vanRsvp: getEnv(VANRSVP),
}
const {db, secrets, network, vanRsvp} = config
export {db, secrets, network, vanRsvp}

export default config
