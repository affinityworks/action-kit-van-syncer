declare interface VanEvent {
    eventId?: number,
    name?: string,
    shortName?: string,
    description?: string,
    startDate: Date,
    endDate: Date,
    eventType: object,
    isOnlyEditableByCreatingUser?: boolean,
    isPubliclyViewable?: boolean,
    locations: [VanLocation],
    codes: [object], // need VanCode
    notes: [object], // need VanNote ?
    shifts: [VanShift],
    roles: [VanRole],
    districtFieldValue?: string,
    voterRegistrationBatches: [object],
    createdDate: Date
}
