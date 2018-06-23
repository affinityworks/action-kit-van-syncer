import {DataTypes, Instance, Models, Sequelize, SequelizeStaticAndInstance} from "sequelize"
import {AbstractAttributes} from "../../types/Attributes"
import {AddressInstance} from "./address"
import {EventInstance} from "./event"
import Bluebird = require("bluebird")
type Model = SequelizeStaticAndInstance["Model"]

export interface LocationAttributes extends AbstractAttributes, VanLocation {}
export interface LocationInstance extends Instance<LocationAttributes>, LocationAttributes {
  getAddress(): Bluebird<AddressInstance>
  getEvent(): Bluebird<EventInstance>
}

export const locationFactory = (s: Sequelize, t: DataTypes): Model => {

  const location = s.define<LocationInstance, LocationAttributes>("location", {
    locationId: t.INTEGER,
    name: t.STRING,
    displayName: t.STRING,
    eventId: t.INTEGER,
  })

  location.associate = (db: Models) => {
    location.belongsTo(db.event)
    location.hasOne(db.address, {
      foreignKey: "addressableId",
      hooks: true,
      onDelete: "cascade",
    })
  }

  return location
}
