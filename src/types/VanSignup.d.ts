declare interface VanSignup {
    eventSignupId: number,
    person: VanPerson,
    event: VanEvent,
    shift: VanShift,
    role: VanRole,
    status: string, // this should be an enum
    location?: VanLocation,
    startTimeOverride?: Date,
    endTimeOverride?: Date,
    printedLists?: [object],
    minivanExports?: [object],
}
