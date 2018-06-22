import {DataTypes, Instance, Models, Sequelize, SequelizeStaticAndInstance} from "sequelize"
import {Attributes} from "../types/Attributes"
type Model = SequelizeStaticAndInstance["Model"]

export interface EventAttributes extends Attributes, VanEvent {}
export type EventInstance = Instance<EventAttributes> & EventAttributes

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
  }

  return Event
}
