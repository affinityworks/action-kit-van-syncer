declare interface VanSignupCreateRequest {
  event: {
    eventId: number,
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
  location: {
    locationId: number,
  },
  printedLists?: [{ number: string }],
  minivanExports?: [{ minivanExportId: number, databaseMode: number}]
}
