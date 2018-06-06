declare interface VanSignupPOST {
    person: {
        vanId: number,
    },
    event: {
        eventId: number,
    },
    shift: {
        eventShiftId: number,
    },
    role?: {
        roleId: number,
    },
    status: {
        statusId: number,
    },
    location?: {
        locationId: number,
    },
    printedLists?: [{ number: string }],
    minivanExports: [{ minivanExportId: number, databaseMode: number}]
}
