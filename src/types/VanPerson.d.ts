declare interface VanPerson {
  /////////////////////// TODO: extract --v
  actionKitId: number,
  vanId?: number,
  id?: number,
  ////////////////////
  firstName: string,
  middleName: string,
  lastName: string,
  suffix?: string,
  salutation?: string,
  emails?: VanEmail[],
  phones?: VanPhone[],
  addresses?: VanAddress[],
}

// OMITTED FIELDS (present in VAN API, but not our data model):

// dateOfBirth?: Date | string,
// party?: string,
// sex?: "M" | "F",
// envelopeName?: string,
// title?: string,
// nickname?: string,
// website?: string,
// contactMethodPreferenceCode?: "P" | "E" | "M" | "S",
// employer?: string,
// occupation?: string,
// selfReportedRaces?: [object]
// selfReportedEthnicities?: [object],
// selfReportedLanguagePreference?: object,
// selfReportedSexualOrientations?: [object],
// selfReportedGenders?: [object],
// suppressions?: [object],
// disclosureFieldValues?: [object],
// identifiers?: object[], // hmmm...
// customFieldValues?: object[] // hmmm...
// recordedAddresses?: VanAddress[],
