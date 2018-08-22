import {DataTypes, Instance, Models, Sequelize, SequelizeStaticAndInstance} from "sequelize"
import {AbstractAttributes} from "../../types/Attributes"
import * as _ from "lodash"
import * as vanApi from "../../service/vanApi"
import {LocationInstance} from "./location"
type Model = SequelizeStaticAndInstance["Model"]

export interface PersonAttributes extends AbstractAttributes, VanPerson {}
export interface PersonInstance extends Instance<PersonAttributes>, PersonAttributes {}

export const personFactory = (s: Sequelize, t: DataTypes): Model => {

  return s.define<PersonInstance, PersonAttributes>("person", {
    actionKitId: t.INTEGER,
    vanId: t.INTEGER,
    firstName: t.STRING,
    middleName: t.STRING,
    lastName: t.STRING,
    salutation: t.STRING,
    suffix: t.STRING,
    emails: t.JSON,
    phones: t.JSON,
    addresses: t.JSON,
  }, {
    hooks: {
      afterUpdate: putPersonToVan,
    },
  })
}

// UPDATE

const VALID_UPDATE_FIELDS =
  ["firstName", "middleName", "lastName", "salutation", "suffix", "emails", "phones", "addresses"]

export const putPersonToVan = async (person: PersonInstance) => {
  if (isUpdated(person)) {
    await vanApi.updatePerson(person.get())
  }
}

const isUpdated = (person: PersonInstance) =>
  validUpdateTimestampDiff(person)
    && hasValidChangedField(person)

const validUpdateTimestampDiff = (person: PersonInstance): boolean =>
  person.createdAt !== person.updatedAt

const hasValidChangedField = (person): boolean =>
  VALID_UPDATE_FIELDS
    .map(field => person.changed(field) && !_.isEqual(person.previous(field), person[field]))
    .some(x => x)
