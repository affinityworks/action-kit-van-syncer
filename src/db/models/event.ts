import {DataTypes, Instance, Models, Sequelize, SequelizeStaticAndInstance} from "sequelize"
import {AbstractAttributes} from "../../types/Attributes"
import {VanEvent} from "../../types/VanEvent"
import {LocationAttributes, LocationInstance} from "./location"
import {ShiftAttributes, ShiftInstance} from "./shift"
import {SignupAttributes, SignupInstance} from "./signup"
import Bluebird = require("bluebird")
import * as vanApi from "../../service/vanApi"
import {VanLocationCreateResponse} from "../../service/vanApi"
type Model = SequelizeStaticAndInstance["Model"]

export interface EventAttributes extends AbstractAttributes, VanEvent {
  locations?: LocationAttributes[],
  shifts: ShiftAttributes[],
}

export interface EventInstance extends Instance<EventAttributes>, EventAttributes {
  getLocations(): Bluebird<LocationInstance[]>,
  getShifts(): Bluebird<ShiftInstance[]>,
  getSignups(): Bluebird<SignupInstance[]>
}

export const eventFactory = (s: Sequelize, t: DataTypes): Model => {

  const event = s.define<EventInstance, EventAttributes>("event", {
    actionKitId: t.INTEGER,
    codes: t.JSON,
    createdDate: t.DATE,
    description: t.STRING,
    endDate: t.DATE,
    eventId: t.INTEGER,
    eventType: t.JSON,
    name: t.STRING,
    notes: t.JSON,
    roles: t.JSON,
    shortName: t.STRING,
    startDate: t.DATE,
    vanId: t.INTEGER,
  }, {
    hooks: {
      afterCreate: postEventToVan,
    },
  })

  event.associate = (db: Models) => {
    event.hasMany(db.location, {
      hooks: true,
      onDelete: "cascade",
      foreignKey: "eventId",
    })
    event.hasMany(db.shift, {
      hooks: true,
      onDelete: "cascade",
      foreignKey: "eventId",
    })
    event.hasMany(db.signup, {
      hooks: true,
      onDelete: "cascade",
      foreignKey: "eventId",
    })
  }

  return event
}

const postEventToVan = async (event: EventInstance) => {
  const locations = await postLocationsToVan(event)
  const shifts = await event.getShifts()
  const eventAttrs = {
    ...event.get(),
    shifts,
    locations,
  }

  const eventId =
    event.eventId ||
    await vanApi.createEvent(eventAttrs).then(r => r.eventId)
  await event.update({eventId})
}

const postLocationsToVan = async (event: EventInstance): Promise<VanLocationCreateResponse[]> => {
  const locations = event.getLocations()
  return await locations.map(async (location: LocationInstance) => {
    const locationId = await vanApi.createLocation(location)
    await location.update(locationId)
    return locationId
  })
}
