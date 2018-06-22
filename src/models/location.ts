import {DataTypes, Instance, Models, Sequelize, SequelizeStaticAndInstance} from "sequelize"
import {Attributes} from "../types/Attributes"
import {EventAttributes} from "./event"
type Model = SequelizeStaticAndInstance["Model"]

export type LocationInstance = Instance<LocationAttributes> & LocationAttributes
export interface LocationAttributes extends Attributes, VanLocation {
  event?: EventAttributes,
}

export const locationFactory = (s: Sequelize, t: DataTypes): Model => {

  const Location = s.define<LocationInstance, LocationAttributes>("Location", {
    vanId: t.INTEGER,
    name: t.STRING,
    displayName: t.STRING,
    eventId: t.INTEGER,
  }, {
    tableName: "locations",
  })

  Location.associate = (db: Models) => {
    Location.belongsTo(db.Event, { as: "event" })
  }

  return Location
}
