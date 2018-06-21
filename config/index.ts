import * as db from "db.json"

const defaults = {
  port: 8081,
  hostname: "localhost",
}

const test = {
  ...defaults,
  db: db.test,
}

const development = {
  ...defaults,
  db: db.development,
}
