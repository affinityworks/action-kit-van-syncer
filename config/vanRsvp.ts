const defaults = {
  statuses: {
    scheduled: { statusId: 1, name: "Scheduled" },
    confirmed: { statusId: 11, name: "Confirmed" },
    noshow: { statusId: 6, name: "No Show" },
  },
}

const development = defaults

const test = defaults

const staging = defaults

const production = defaults

export default {
  development,
  test,
  staging,
  production,
}
