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
      "/rest/v1/campaign/11/": { name: "Canvass", eventTypeId: 227492 },
      "/rest/v1/campaign/12/": { name: "Phone Banks", eventTypeId: 227493 },
      "/rest/v1/campaign/13/": { name: "Training", eventTypeId: 227494 },
      "/rest/v1/campaign/1/":  { name: "Community Event", eventTypeId: 227496 }, // TODO: Swap out for Field Event
    },
    blacklist: ["/rest/v1/campaign/4/"],
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
    blacklist: [
      "/rest/v1/campaign/4/",
    ],
  },
}

export default {
  development,
  test,
  staging,
  production,
}
