"use strict"

import * as Sequelize from "sequelize"
import {values, forEach} from "lodash"

const env       = process.env.NODE_ENV || "development"
const config    = require(__dirname + "/../config/")[env]

export const initDb = () => {

  const sequelize = config.use_env_variable
    ? new Sequelize(process.env[config.use_env_variable], config)
    : new Sequelize(config.database, config.username, config.password, config)

  const db = {
    // import model factories here, like:
    // `Person: personFactory(sequelize, Sequelize)`
  }

  forEach(values(db), (mdl: any) => mdl.associate && mdl.associate(db))

  return {...db, sequelize, Sequelize }
}

export default initDb()
