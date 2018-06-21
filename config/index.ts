const db = require("db.json")
import {secrets} from "./secrets"

const defaults = {
  port: 8081,
  hostname: "localhost",
  secrets,
}

const test = {
  ...defaults,
  db: db.test,
}

const development = {
  ...defaults,
  db: db.development,
}

const production = {
  ...defaults,
  db: db.production,
}

export default {
  test,
  development,
  production,
}[process.env.NODE_ENV || "development"]
