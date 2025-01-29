export enum Lawsuit { }
export enum LawsuitStatus {

  All = 1,
  Inprogress = 2,
  Finished = 3,
  Pending = 4,
  Approval = 5,
  Canceled = 6,
  UnderReview = 7

}
export enum CourtType {
  Court = 0,
  Committee = 1

}
export enum LawsuitType {
  All = 1,
  Individual = 2,
  Special = 3,
  Governmental = 4,

}

interface ZatcaData {
  sellerName: string;
  vatNumber: string;
  timestamp: string;
  total: string;
  vatTotal: string;
}

export enum LawsuitTypeEnum {
  All = 1,
  Workers = 2,
  Criminal = 3,
  PersonalConditions = 4,
  Civilian = 5,
  Administrative = 6,
  Commercial = 7,
  Other = 8


}
export enum NationalType {
  All = 1,
  PersonalId = 2,
  Passport = 3,
}
export enum FilesType {
  AttachmentFile = 0,
  AttachmentDate = 1,
}
export enum LawsuitState {
  All = 1,
  Active = 2,
  Inactive = 3,
}
export enum ClientStaus {
  All = 1,
  Defendant = 2,
  Plaintiff = 3,
  Other = 4,
}
export enum AttachmentType {
  Non = 0,
  Other = 1
}
export enum EntityType {
  "addIssue.GeneralCourt" = 2,
  "addIssue.AdministrativeCourt" = 3,
  "addIssue.Committee" = 4,
  "addIssue.Representative" = 5,
  "addIssue.PoliceStation" = 6,
  "addIssue.Prisons" = 7,
  "addIssue.MinistryOfHumanResources" = 8,
  "addIssue.Other" = 9,
}

export enum CategoryType {
  Non = 0,
  Other = 1
}
export enum MainCourtType {
  All = 1,
  GeneralCourt = 2,
  AdministrativeCourt = 3,
  MinistryOfHumanResources = 4

}