declare interface VanSignupCreateRequest {
  event: {
    eventId: number,
  },
  location: {
    locationId: number,
  },
  person: {
    vanId: number,
  },
  role: {
    roleId: number,
  },
  shift: {
    eventShiftId: number,
  },
  status: {
    statusId: number,
  },
  printedLists?: [{ number: string }],
  minivanExports?: [{ minivanExportId: number, databaseMode: number}]
}
