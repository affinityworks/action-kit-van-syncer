import {DataTypes, Instance, Models, Sequelize, SequelizeStaticAndInstance} from "sequelize"
import {AbstractAttributes} from "../../types/Attributes"
import {EventInstance} from "./event"
import Bluebird = require("bluebird")
type Model = SequelizeStaticAndInstance["Model"]

export interface LocationAttributes extends AbstractAttributes, VanLocation {}
export interface LocationInstance extends Instance<LocationAttributes>, LocationAttributes {
  getEvent(): Bluebird<EventInstance>
}

export const locationFactory = (s: Sequelize, t: DataTypes): Model => {

  const location = s.define<LocationInstance, LocationAttributes>("location", {
    locationId: t.INTEGER,
    name: t.STRING,
    displayName: t.STRING,
    eventId: t.INTEGER,
    address: t.JSON,
  })

  location.associate = (db: Models) => {
    location.belongsTo(db.event)
  }

  return location
}
