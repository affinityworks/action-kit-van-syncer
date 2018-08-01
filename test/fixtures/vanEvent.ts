import {LocationAttributes} from "../../src/db/models/location"
import {VanEvent} from "../../src/types/VanEvent"
import {EventAttributes} from "../../src/db/models/event"
import {shiftAttrs, vanShift} from "./vanShift"
import {roleAttrs, roleOne, roleTwo} from "./vanRole"
import {locationAttrs} from "./vanLocation"

export const vanEvents: VanEvent[] = [{
  actionKitId: 1049,
  name: "Affinity Test Event #1",
  shortName: "Affinity Tes",
  description: "Affinity Test Event #1",
  createdDate: "2018-06-07T15:57:50",
  startDate: "2018-07-25T16:00:00-00:00",
  endDate: "2018-07-25T20:00:00-00:00",
  eventType: {
    eventTypeId: 227492,
  },
  codes: [],
  notes: [],
  shifts: [vanShift],
}, {
  actionKitId: 1050,
  name: "Affinity Test Event #2",
  shortName: "Affinity Tes",
  description: "Affinity Test Event #2",
  startDate: "2018-07-25T16:00:00-00:00",
  endDate: "2018-07-25T20:00:00-00:00",
  createdDate: "2018-06-07T15:57:50",
  eventType: {
    eventTypeId: 227492,
  },
  codes: [],
  notes: [],
  shifts: [vanShift],
}]

export const vanEventTree: VanEvent[] = [
  { // eventsResponse.objects[0]
    ...vanEvents[0],
    roles: roleAttrs,
    locations: [locationAttrs[0]],
    signups: [
      { // signupResponseHost
        actionKitId: 1267,
        status: { statusId: 4, name: "Invited" },
        role: roleTwo,
        person: { // userResponseHost
          actionKitId: 350567,
          salutation: "",
          firstName: "James",
          middleName: "",
          lastName: "V",
          suffix: "",
          addresses: [
            {
              addressLine1: "",
              addressLine2: "",
              city: "Brooklyn",
              stateOrProvince: "NY",
              zipOrPostalCode: "11213",
              countryCode: "US",
              type: "Home",
            },
          ],
          emails: [{ email: "james@affinity.works", type: "P"}],
          phones: [],
        },
      },
      { // signupResponseAttendee
        actionKitId: 1268,
        status: { statusId: 4, name: "Invited" },
        role: roleOne,
        person: { // userResponseAttendee
          actionKitId: 350568,
          salutation: "",
          suffix: "",
          firstName: "Cool",
          middleName: "",
          lastName: "Guy",
          addresses: [
            {
              addressLine1: "",
              addressLine2: "",
              city: "Brooklyn",
              stateOrProvince: "NY",
              zipOrPostalCode: "11213",
              countryCode: "US",
              type: "Home",
            },
          ],
          emails: [{
            email: "james+coolguy@affinity.works",
            type: "P",
          }],
          phones: [{
            actionKitId: 568,
            phoneNumber: "6151234567",
            phoneType: "H",
          }, {
            actionKitId: 569,
            phoneNumber: "3041234567",
            phoneType: "M",
          }],
          // region: "",
          // source: "website",
        },
      },
    ],
    // attendee_count: 1,
    // confirmed_at: "2018-06-07T15:58:33",
    // directions: "",
    // host_is_confirmed: true,
    // is_approved: false,
    // is_private: false,
    // latitude: 40.6664,
    // longitude: -73.9855,
    // note_to_attendees: "",
  },
  { // eventsResponse.objects[0]
    ...vanEvents[1],
    roles: roleAttrs,
    locations: [locationAttrs[1]],
    signups: [],
  },
]

export const eventAttrs: EventAttributes = { ...vanEventTree[0], vanId: 1 }
