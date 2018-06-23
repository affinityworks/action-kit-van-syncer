import {DataTypes, Instance, Models, Sequelize, SequelizeStaticAndInstance} from "sequelize"
import {Attributes} from "../../types/Attributes"
import {AddressInstance} from "./address"
import {EventInstance} from "./event"
import Bluebird = require("bluebird")
type Model = SequelizeStaticAndInstance["Model"]

export interface LocationAttributes extends Attributes, VanLocation {}
export interface LocationInstance extends Instance<LocationAttributes>, LocationAttributes {
  getAddress(): Bluebird<AddressInstance>
  getEvent(): Bluebird<EventInstance>
}

export const locationFactory = (s: Sequelize, t: DataTypes): Model => {

  const Location = s.define<LocationInstance, LocationAttributes>("Location", {
    locationId: t.INTEGER,
    name: t.STRING,
    displayName: t.STRING,
    eventId: t.INTEGER,
  }, {
    tableName: "locations",
  })

  Location.associate = (db: Models) => {

    Location.belongsTo(db.Event, { as: "event" })

    Location.hasOne(db.Address, {
      foreignKey: "addressableId",
      as: "address",
      hooks: true,
      onDelete: "cascade",
    })
  }

  return Location
}
