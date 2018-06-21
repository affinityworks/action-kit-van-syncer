import {DataTypes, Instance, Sequelize} from "sequelize"
import {Attributes} from "../types/Attributes"

export interface EventAttributes extends Attributes, VanEvent {}
export type EventInstance = Instance<EventAttributes> & EventAttributes

export const eventFactory = (s: Sequelize, t: DataTypes) => {

  const Event = s.define<EventInstance, EventAttributes>("Event", {
    actionKitId: t.INTEGER,
    vanId: t.NUMBER,
    eventId: t.NUMBER,
    name: t.STRING,
    shortName: t.STRING,
    description: t.STRING,
    startDate: t.DATE,
    eventType: t.JSON,
    codes: t.JSON,
    notes: t.JSON,
    createdDate: t.DATE
  }, {})

  Event.associate = db => {
    // associations can be defined here
  }

  return Event
}
