import {DataTypes, Instance, Models, Sequelize, SequelizeStaticAndInstance} from "sequelize"
import {AbstractAttributes} from "../../types/Attributes"
import {VanEvent} from "../../types/VanEvent"
import {LocationAttributes, LocationInstance} from "./location"
import {ShiftAttributes, ShiftInstance} from "./shift"
import {SignupAttributes, SignupInstance} from "./signup"
import Bluebird = require("bluebird")
import * as vanApi from "../../service/vanApi"
import {VanLocationCreateResponse} from "../../service/vanApi"
import * as _ from "lodash"
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
      afterUpdate: putEventToVan,
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

// CREATE

const postEventToVan = async (event: EventInstance) => {
  const locations = await postLocationsToVan(event)
  const eventAttrs = await getEventAttrs(event, locations)

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

// UPDATE

const VALID_UPDATE_FIELDS = [
  "codes",
  "createdDate",
  "description",
  "endDate",
  "eventType",
  "name",
  "notes",
  "roles",
  "shortName",
  "startDate",
]

const putEventToVan = async (event: EventInstance) => {
  if (isUpdated(event)) {
    const locations = await event.getLocations()
    const locationIds = locations.map(location => { location.locationId })
    const eventAttrs = await getEventAttrs(event, locationIds)
    await vanApi.updateEvent(eventAttrs)
  }
}

const isUpdated = (event: EventInstance) =>
  validUpdateTimestampDiff(event)
    && hasValidChangedField(event)
    && hasNotChanged(event, "eventId")

const validUpdateTimestampDiff = (event: EventInstance): boolean =>
  event.createdAt.valueOf() !== event.updatedAt.valueOf()

const hasValidChangedField = (event): boolean =>
  VALID_UPDATE_FIELDS
    .map(field => event.changed(field) && !_.isEqual(event.previous(field), event[field]))
    .some(x => x)

const hasNotChanged = (event, field) => !event.changed(field)

// HELPERS

const getEventAttrs = async (event, locations) => {
  const shifts = await event.getShifts()
  return {
    ...event.get(),
    shifts,
    locations,
  }
}
