import {DataTypes, Instance, Models, Sequelize, SequelizeStaticAndInstance} from "sequelize"
import {AbstractAttributes} from "../../types/Attributes"
import {LocationInstance} from "./location"
import Bluebird = require("bluebird")
type Model = SequelizeStaticAndInstance["Model"]

export interface EventAttributes extends AbstractAttributes, VanEvent {}
export interface EventInstance extends Instance<EventAttributes>, EventAttributes {
  getLocation(): Bluebird<LocationInstance>
}

export const eventFactory = (s: Sequelize, t: DataTypes): Model => {

  const Event = s.define<EventInstance, EventAttributes>("Event", {
    actionKitId: t.INTEGER,
    vanId: t.INTEGER,
    eventId: t.INTEGER,
    name: t.STRING,
    shortName: t.STRING,
    description: t.STRING,
    startDate: t.DATE,
    endDate: t.DATE,
    eventType: t.JSON,
    codes: t.JSON,
    notes: t.JSON,
    createdDate: t.DATE
  }, {
    tableName: "events",
  })

  Event.associate = (db: Models) => {

    Event.hasOne(db.Location, {
      as: "location",
      hooks: true,
      onDelete: "cascade",
      foreignKey: "eventId",
    })

    Event.hasMany(db.Shift, {
      as: "shifts",
      hooks: true,
      onDelete: "cascade",
      foreignKey: "eventId",
    })
  }

  return Event
}
