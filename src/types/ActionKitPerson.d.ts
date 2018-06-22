declare interface AbstractActionKitPerson {
  actions?: string,
  address1: string,
  address2: string,
  city: string,
  country: string,
  created_at: Date | string,
  email: string,
  events: string,
  eventsignups: string,
  fields?: object | object[],
  first_name: string,
  id: number,
  lang?: string, // uri
  last_name: string,
  location: string,
  logintoken: string,
  middle_name: string,
  orderrecurrings: string,
  orders: string,
  plus4: string,
  postal: string,
  prefix: string,
  rand_id: number,
  region: string,
  resource_uri: string,
  source: string,
  state: string,
  subscription_status: string,
  subscriptionhistory: string,
  subscriptions: string,
  suffix: string,
  token: string,
  updated_at: Date | string,
  usergeofields: string,
  usermailings: string,
  useroriginal: string,
  zip: string
}

declare interface ActionKitPersonResponse extends AbstractActionKitPerson {
  phones: string[],
}

declare interface ActionKitPerson extends AbstractActionKitPerson {
  phones: ActionKitPhone[]
}
