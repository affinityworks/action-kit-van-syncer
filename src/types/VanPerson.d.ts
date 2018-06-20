declare interface VanPerson {
  /////////////////////// TODO: extract --v
  actionKitId: number,
  vanId?: number,
  id?: number,
  ////////////////////
  firstName: string,
  middleName: string,
  lastName: string,
  dateOfBirth?: Date | string,
  party?: string,
  sex?: "M" | "F",
  salutation?: string,
  envelopeName?: string,
  title?: string,
  suffix?: string,
  nickname?: string,
  website?: string,
  contactMethodPreferenceCode?: "P" | "E" | "M" | "S",
  employer?: string,
  occupation?: string,
  selfReportedRaces?: [object]
  selfReportedEthnicities?: [object],
  selfReportedLanguagePreference?: object,
  selfReportedSexualOrientations?: [object],
  selfReportedGenders?: [object],
  suppressions?: [object],
  disclosureFieldValues?: [object],
  identifiers?: object[], // hmmm...
  customFieldValues?: object[] // hmmm...
  emails?: VanEmail[],
  phones?: VanPhone[],
  addresses?: VanAddress[],
  recordedAddresses?: VanAddress[],
}
