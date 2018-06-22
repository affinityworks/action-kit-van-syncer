declare interface AbstractActionKitEvent {
  address1: string,
  address2: string,
  attendee_count: number,
  campaign: string,
  city: string,
  confirmed_at: string,
  country: string,
  created_at: Date | string,
  creator: string,
  directions: string,
  ends_at: Date | string,
  ends_at_utc: Date | string,
  fields: object[],
  host_is_confirmed: boolean,
  id: number,
  is_approved: boolean,
  is_private: boolean,
  latitude: number,
  longitude: number,
  max_attendees: number,
  note_to_attendees: string,
  notes: string,
  phone: string,
  plus4: string,
  postal: string,
  public_description: string,
  region: string,
  resource_uri: string,
  starts_at: Date | string,
  starts_at_utc: Date | string,
  state: string,
  status: string,
  title: string,
  updated_at: Date | string,
  venue: string,
  zip: string,
}

declare interface ActionKitEventResponse extends AbstractActionKitEvent {
  signups: string[]
}

declare interface ActionKitEvent extends AbstractActionKitEvent {
  signups: ActionKitSignup[]
}

declare interface ActionKitEventResponseInEnvelope {
  meta: {
    limit: number,
    next?: string,
    offset: number,
    previous?: string,
    total_count: number,
  },
  objects: ActionKitEventResponse[]
}
