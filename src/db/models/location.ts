import {DataTypes, Instance, Models, Sequelize, SequelizeStaticAndInstance} from "sequelize"
import {AbstractAttributes} from "../../types/Attributes"
import {EventInstance} from "./event"
import Bluebird = require("bluebird")
import * as vanApi from "../../service/vanApi"
import * as _ from "lodash"
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
  }, {
    hooks: {
      beforeUpdate: postUpdatedLocationToVan,
    },
  })

  location.associate = (db: Models) => {
    location.belongsTo(db.event)
  }

  return location
}

// UPDATE

const WATCHED_UPDATE_FIELDS = ["name", "address"]

const postUpdatedLocationToVan = async (location: LocationInstance) => {
  if (isUpdated(location)) {
    const updatedLocation = { ...location.get(), locationId: null }
    const locationId = await vanApi.createLocation(updatedLocation)
    location.locationId = locationId.locationId
  }
}

const isUpdated = (location: LocationInstance) =>
  validUpdateTimestampDiff(location)
    && hasChangedField(location)
    && validAddressUpdate(location)

const validUpdateTimestampDiff = (location: LocationInstance): boolean =>
  location.createdAt !== location.updatedAt

const hasChangedField = (location): boolean =>
  WATCHED_UPDATE_FIELDS.map(field => location.changed(field)).some(x => x)

const validAddressUpdate = (location: LocationInstance): boolean => {
  return _.isEqual(location.changed(), ["address"]) ?
    !_.isEqual(location.previous("address"), location.address) : true
}
