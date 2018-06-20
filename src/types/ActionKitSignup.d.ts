declare interface AbstractActionKitSignup {
  attended: boolean,
  created_at: Date | string,
  id: number,
  role: string,
  status: string, // enum
  updated_at: Date | string,

}

declare interface ActionKitSignupResponse extends AbstractActionKitSignup {
  event: string,
  fields: object | object[],
  page: string,
  resource_uri: string,
  signupaction: string[],
  signupfields: object[],
  user: string,
}

declare interface ActionKitSignup extends AbstractActionKitSignup {
  user: ActionKitPerson,
}
