const defaults = {
  van: {
    statuses: {
      scheduled: { statusId: 1, name: "Scheduled" },
      confirmed: { statusId: 11, name: "Confirmed" },
      noshow: { statusId: 6, name: "No Show" },
    },
  },
  actionKit: {
    whitelistMapping: {
      "/rest/v1/campaign/289/": { name: "Canvass", eventTypeId: 227492 },
    },
    blacklist: ["/rest/v1/campaign/666/"],
  },
}

const development = defaults

const test = defaults

const staging = {
  van: defaults.van,
  actionKit: {
    whitelistMapping: {
      "/rest/v1/campaign/11/": {
        eventType: { name: "Canvass", eventTypeId: 227492 },
        roles: {
          host: {
            roleId: 198856,
            name: "Host",
          },
          attendee: {
            roleId: 198854,
            name: "Canvasser",
          },
        },
      },
      "/rest/v1/campaign/12/": {
        eventType: {name: "Phone Banks", eventTypeId: 227493},
        roles: {
          host: {
            roleId: 198856,
            name: "Host",
          },
          attendee: {
            roleId: 198858,
            name: "Phonebanker",
          },
        },
      },
      "/rest/v1/campaign/13/": {
        eventType: { name: "Training", eventTypeId: 227494 },
        roles: {
          host: {
            roleId: 198857,
            name: "Organizer",
          },
          attendee: {
            roleId: 198859,
            name: "Attendee",
          },
        },
      },
      "/rest/v1/campaign/1/": {
        eventType: { name: "Community Event", eventTypeId: 227496 },
        roles: {
          host: {
            roleId: 198857,
            name: "Organizer",
          },
          attendee: {
            roleId: 198859,
            name: "Attendee",
          },
        },
      },
    },
  },
}

const production = {
  van: defaults.van,
  actionKit: {
    whitelistMapping: {
      "/rest/v1/campaign/11/": { name: "Canvassing", eventTypeId: 23808 },
      "/rest/v1/campaign/12/": { name: "Phone Bank", eventTypeId: 102321 },
      // "/rest/v1/campaign/13/": "Training", TODO: Get Event Type for Training
      // "/rest/v1/campaign/1/": "Field Events", TODO: Get Event Type for Field Events
    },
  },
}

/*
"eventTypeId": 23808,
    "name": "Canvassing",
    "roles": [
      {
        "roleId": 87160,
        "name": "Attendee",
        "isEventLead": true
      },
      {
        "roleId": 87161,
        "name": "Canvassing",
        "isEventLead": true
      },
      {
        "roleId": 87162,
        "name": "Data Entry",
        "isEventLead": true
      },
      {
        "roleId": 87163,
        "name": "Phone Calling",
        "isEventLead": true
      }
    ],

 {
    "eventTypeId": 102321,
    "name": "Phone Bank",
    "roles": [
      {
        "roleId": 87160,
        "name": "Attendee",
        "isEventLead": true
      },
      {
        "roleId": 87161,
        "name": "Canvassing",
        "isEventLead": true
      },
      {
        "roleId": 87162,
        "name": "Data Entry",
        "isEventLead": true
      },
      {
        "roleId": 87163,
        "name": "Phone Calling",
        "isEventLead": true
      }
    ],
 */

export default {
  development,
  test,
  staging,
  production,
}
