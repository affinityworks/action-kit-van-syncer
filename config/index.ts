import {get} from "lodash"
const DB = require("./db.json")
import SECRETS from "./secrets"
import NETWORK from "./network"

const getEnv = (cfg) =>
  get(cfg, [process.env.NODE_ENV || "development"])

const config = {
  db: getEnv(DB),
  secrets: getEnv(SECRETS),
  network: getEnv(NETWORK),
}
const {db, secrets, network} = config
export {db, secrets, network}

export default config
