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
      "/rest/v1/campaign/289/": {
        eventType: {name: "Canvass", eventTypeId: 227492 },
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
    },
  },
}

const development = defaults

const test = defaults

const ci = defaults

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
      "/rest/v1/campaign/11/": {
        eventType: { name: "Canvass", eventTypeId: 301681 },
        roles: {
          host: {
            // TODO: Get this from Yes on 1631 team
          },
          attendee: {
            // TODO: Get this from Yes on 1631 team
          },
        },
      },
      "/rest/v1/campaign/12/": {
        eventType: { name: "Phonebank", eventTypeId: 301682 },
        roles: {
          host: {
            // TODO: Get this from Yes on 1631 team
          },
          attendee: {
            // TODO: Get this from Yes on 1631 team
          },
        },
      },
      "/rest/v1/campaign/13/": {
        eventType: { name: "Training", eventTypeId: 301683 },
        roles: {
          host: {
            // TODO: Get this from Yes on 1631 team
          },
          attendee: {
            // TODO: Get this from Yes on 1631 team
          },
        },
      },
      "/rest/v1/campaign/1/": {
        eventType: { name: "Field Event", eventTypeId: 301684 },
        roles: {
          host: {
            // TODO: Get this from Yes on 1631 team
          },
          attendee: {
            // TODO: Get this from Yes on 1631 team
          },
        },
      },
    },
  },
}

/*
[
  {
    "eventTypeId": 301681,
    "name": "Canvass",
    "roles": [
      {
        "roleId": 263693,
        "name": "Admin",
        "isEventLead": true
      }
    ],

  },
  {
    "eventTypeId": 301684,
    "name": "Field Event",
    "roles": [
      {
        "roleId": 263693,
        "name": "Admin",
        "isEventLead": true
      }

  {
    "eventTypeId": 301682,
    "name": "Phonebank",
    "roles": [
      {
        "roleId": 263693,
        "name": "Admin",
        "isEventLead": true
      }
    ],
  },
  {
    "eventTypeId": 301683,
    "name": "Training",
    "roles": [
      {
        "roleId": 263693,
        "name": "Admin",
        "isEventLead": true
      }
    ],
  }
]
 */

export default {
  development,
  test,
  ci,
  staging,
  production,
}
