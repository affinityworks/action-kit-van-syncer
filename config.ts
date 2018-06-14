import {ConnectionOptions} from "typeorm"

const db: ConnectionOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  database: "ak2van",
  synchronize: false,
  logging: false,
}

const config = {
  port: 8081,
  hostname: "localhost",
  db,
}

export const dev = {
  ...config,
  db:  {
    ...config.db,
    name: "dev",
    database: "ak2van",
    entities: [ "build/app/entity/**/*.js" ],
    migrations: [ "build/app/migration/**/*.js" ],
    subscribers: [ "build/app/subscriber/**/*.js" ],
    cli: {
      entitiesDir: "build/app/entity",
      migrationsDir: "build/app/migration",
      subscribersDir: "build/app/subscriber",
    },

  },
}

export const test = {
  ...config,
  db: {
    ...config.db,
    database: "ak2van",
    entities: ["src/app/entity/**/*.ts"],
    migrations: ["src/app/migration/**/*.ts"],
    subscribers: ["src/app/subscriber/**/*.ts"],
    cli: {
      entitiesDir: "src/app/entity",
      migrationsDir: "src/app/migration",
      subscribersDir: "src/app/subscriber",
    },
  },
}