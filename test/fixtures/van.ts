export const vanEventTree: VanEvent[] = [
  { // eventsResponse.objects[0]
    actionKitId: 1049,
    name: "Affinity Test Event #1",
    description: "Affinity Test Event #1",
    createdDate: "2018-06-07T15:57:50",
    startDate: "2018-07-25T16:00:00-00:00",
    endDate: "2018-07-25T20:00:00-00:00",
    eventType: {}, // hmmm...
    codes: [{}],
    notes: [{}],
    voterRegistrationBatches: [{}], // hmmm..
    shifts: [
      {
        name: "FULL SHIFT",
        startTime: "2018-07-25T16:00:00-00:00",
        endTime: "2018-07-25T20:00:00-00:00",
      },
    ],
    roles: [
      {
        name: "Host",
        isEventLead: true,
      },
      {
        name: "Attendee",
        isEventLead: false,
        max: 50,
      },
    ],
    locations: [
      {
        name: "Space Jam",
        address: {
          addressLine1: "123 Albany Avenue",
          addressLine2: "",
          city: "New York",
          stateOrProvince: "NY",
          zipOrPostalCode: "11215-1104",
          countryCode: "US", // hmm.. must be "USA"?
          type: "Custom",
        },
      },
    ],
    signups: [
      { // signupResponseAttendee
        actionKitId: 1268,
        status: { statusId: 4, name: "Invited"  },
        role: { name: "Attendee" },
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
          phones: [],
          // region: "",
          // source: "website",
        },
      },
      { // signupResponseHost
        actionKitId: 1267,
        status: { statusId: 4, name: "Invited"  },
        role: { name: "Host" },
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
    actionKitId: 1049,
    name: "Affinity Test Event #2",
    description: "Affinity Test Event #2",
    startDate: "2018-07-25T16:00:00-00:00",
    endDate: "2018-07-25T20:00:00-00:00",
    createdDate: "2018-06-07T15:57:50",
    eventType: {}, // hmmm...
    codes: [{}],
    notes: [{}],
    voterRegistrationBatches: [{}], // hmmm..
    roles: [
      {
        name: "Host",
        isEventLead: true,
      },
      {
        name: "Attendee",
        isEventLead: false,
        max: 50,
      },
    ],
    shifts: [
      {
        name: "FULL SHIFT",
        startTime: "2018-07-25T16:00:00-00:00",
        endTime: "2018-07-25T20:00:00-00:00",
      },
    ],
    locations: [
      {
        name: "Barn",
        address: {
          addressLine1: "789 Dean Road",
          addressLine2: "",
          city: "Nashville",
          zipOrPostalCode: "37201-1104",
          stateOrProvince: "TN",
          countryCode: "US",
          type: "Custom",
        },
      },
    ],
    signups: [],
    // attendee_count: 1,
    // confirmed_at: "2018-06-07T15:58:33",
    // country: "United States",
    // host_is_confirmed: true,
    // is_approved: false,
    // is_private: false,
    // latitude: 50.6664,
    // longitude: -83.9855,
    // max_attendees: 50,
    // note_to_attendees: "",
    // status: "active",
    // updated_at: "2018-06-07T16:09:34",
  },
]
