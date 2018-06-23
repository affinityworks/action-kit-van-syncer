"use strict"

import * as SequelizeClass from "sequelize"
import {Sequelize, SequelizeStaticAndInstance, SequelizeStatic, Models} from "sequelize"
import {values, forEach} from "lodash"
import {db as config} from "../../config/index"
import {addressFactory} from "./models/address"
import {eventFactory} from "./models/event"
import {locationFactory} from "./models/location"
import {roleFactory} from "./models/role"
import {shiftFactory} from "./models/shift"

type Model = SequelizeStaticAndInstance["Model"]

export interface Database {
  sequelize: Sequelize,
  SequelizeClass: SequelizeStatic,
  address: Model,
  event: Model,
  location: Model,
  role: Model,
  shift: Model,
}

export const initDb = (): Database => {

  const sequelize = config.use_env_variable
    ? new SequelizeClass(process.env[config.use_env_variable], config)
    : new SequelizeClass(config.database, config.username, config.password, config)

  const db = {
    address: addressFactory(sequelize, SequelizeClass),
    event: eventFactory(sequelize, SequelizeClass),
    location: locationFactory(sequelize, SequelizeClass),
    role: roleFactory(sequelize, SequelizeClass),
    shift: shiftFactory(sequelize, SequelizeClass),
  }

  forEach(values(db), (mdl: Model) => mdl.associate && mdl.associate(db))

  return {...db, sequelize, SequelizeClass}
}

export default initDb()
