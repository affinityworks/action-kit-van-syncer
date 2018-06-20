declare interface AbstractActionKitPerson {
  actions?: string,
  address1: string,
  address2: string,
  city: string,
  country: string,
  created_at: Date | string,
  email: string,
  fields?: object | object[],
  first_name: string,
  id: number,
  lang?: string, // uri
  last_name: string,
  middle_name: string,
  plus4: string,
  postal: string,
  prefix: string,
  rand_id: number,
  region: string,
  resource_uri: string,
  source: string,
  state: string,
  subscription_status: string,
  suffix: string,
  updated_at: Date | string,
  zip: string
}

declare interface ActionKitPersonResponse extends AbstractActionKitPerson {
  events: string,
  eventsignups: string,
  location: string,
  logintoken: string,
  orderrecurrings: string,
  orders: string,
  phones: string[],
  subscriptionhistory: string,
  subscriptions: string,
  token: string,
  usergeofields: string,
  usermailings: string,
  useroriginal: string,
}

declare interface ActionKitPerson extends AbstractActionKitPerson {
  phones: ActionKitPhone[]
}
