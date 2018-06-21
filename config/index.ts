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
  secrets: secrets.test,
}

const development = {
  ...defaults,
  db: db.development,
  secrets: secrets.development,
}

const production = {
  ...defaults,
  db: db.production,
  secrets: secrets.production,
}

export default {
  test,
  development,
  production,
}[process.env.NODE_ENV || "development"]
