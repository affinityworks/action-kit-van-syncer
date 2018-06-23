import {DataTypes, Instance, Models, Sequelize, SequelizeStaticAndInstance} from "sequelize"
import {Attributes} from "../../types/Attributes"
import {EventInstance} from "./event"
type Model = SequelizeStaticAndInstance["Model"]

export interface ShiftAttributes extends Attributes, VanShift {
  eventId?: number
}

export interface ShiftInstance extends Instance<ShiftAttributes>, ShiftAttributes {
  getEvent(): EventInstance
}

export const shiftFactory = (s: Sequelize, t: DataTypes): Model => {

  const Shift = s.define<ShiftInstance, ShiftAttributes>("shift", {
    eventId: t.INTEGER,
    eventShiftId: t.INTEGER,
    name: t.STRING,
    startTime: t.DATE,
    endTime: t.DATE,
  }, {
    tableName: "shifts",
  })

  Shift.associate = (db: Models) => {
    Shift.belongsTo(db.Event, { as: "event" })
  }

  return Shift
}
