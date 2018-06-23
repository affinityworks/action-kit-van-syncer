"use strict"

import * as SequelizeClass from "sequelize"
import {Sequelize, SequelizeStaticAndInstance, SequelizeStatic, Models} from "sequelize"
import {values, forEach} from "lodash"
import {db as config} from "../../config/index"
import {addressFactory} from "./models/address"
import {eventFactory} from "./models/event"
import {locationFactory} from "./models/location"

type Model = SequelizeStaticAndInstance["Model"]

export interface Database {
  sequelize: Sequelize,
  SequelizeClass: SequelizeStatic,
  Address: Model,
  Event: Model,
  Location: Model,
}

export const initDb = (): Database => {

  const sequelize = config.use_env_variable
    ? new SequelizeClass(process.env[config.use_env_variable], config)
    : new SequelizeClass(config.database, config.username, config.password, config)

  const db = {
    Address: addressFactory(sequelize, SequelizeClass),
    Event: eventFactory(sequelize, SequelizeClass),
    Location: locationFactory(sequelize, SequelizeClass),
  }

  forEach(values(db), (mdl: Model) => mdl.associate && mdl.associate(db))

  return {...db, sequelize, SequelizeClass}
}

export default initDb()
