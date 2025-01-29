export enum Client { }
export enum ClientType {
  All = 1,
  Individual = 2,
  Special = 3,
}
export enum ProjectType {
  All = 1,
  Service = 2,
  LegalAdvice = 3,
}

export enum ProjectTypeName {
  "projectManagement.service" = 2,
  "projectManagement.consultation" = 3,
}
export enum UnitMeasure {
  All = 1,
  Units = 2,
  Lawsuits = 3,
  Visits = 4,
  Other = 5,
}

export enum UnitMeasureType {
  "projectManagement.Units" = 2,
  "projectManagement.Lawsuits" = 3,
  "projectManagement.Visits" = 4,
  "projectManagement.Other" = 5,
}

export enum ProjectName {
  All = 1,
  ExecutionRequests = 2,
  PerformanceOrders = 3,
  AmicableSettlement = 4,
  Reports = 5,
  Arbitration = 6,
  Collection = 7,
  CreateContract = 8,
  DraftingContract = 9,
  Other = 10
}
export enum ProjectStatus {
  All = 1,
  New = 2,
  InProgress = 3,
  AcceptOffer = 4,
  RemainingPayments = 5,
  CompletedPayments = 6,
}

export enum ProjectStatusType {
  "projectManagement.New" = 2,
  "projectManagement.InProgress" = 3,
  "projectManagement.AcceptOffer" = 4,
  "projectManagement.RemainingPayments" = 5,
  "projectManagement.CompletedPayments" = 6,
}

export enum ProjectNameType {
  "projectManagement.ExecutionRequests" = 2,
  "projectManagement.PerformanceOrders" = 3,
  "projectManagement.AmicableSettlement" = 4,
  "projectManagement.Reports" = 5,
  "projectManagement.Arbitration" = 6,
  "projectManagement.Collection" = 7,
  "projectManagement.CreateContract" = 8,
  "projectManagement.DraftingContract" = 9,
  "projectManagement.Other" = 10,
}
export enum LegalAdvice {
  All = 1,
  LaborConsultation = 2,
  PersonalStatusConsultation = 3,
  RealEstateConsultation = 4,
  BusinessConsulting = 5,
  GeneralConsultation = 6,
  Other = 7
}
export enum LegalAdviceType {
  "projectManagement.LaborConsultation" = 2,
  "projectManagement.PersonalStatusConsultation" = 3,
  "projectManagement.RealEstateConsultation" = 4,
  "projectManagement.BusinessConsulting" = 5,
  "projectManagement.GeneralConsultation" = 6,
  "projectManagement.Other" = 7
}

export enum AccountState {
  All = 1,
  Active = 2,
  Inactive = 3,
}

export enum ClientState {
  All = 1,
  Active = 2,
  NotActive = 3,
}

export enum RepresentativeStatus {
  All = 1,
  BoardDirector = 2,
  CEO = 3,
  LegalAdvisor = 4,
  Manager = 5,
  Accountant = 6,
  Others = 7
}
export enum RepresentativeStatusType {
  "addClient.BoardDirector" = 2,
  "addClient.CEO" = 3,
  "addClient.LegalAdvisor" = 4,
  "addClient.Manager" = 5,
  "addClient.Accountant" = 6,
  "addClient.Other" = 7
}


export enum ClientNationalType {

  "addClient.NationalIdentity" = 2,
  "addClient.RegularResidence" = 3,
  "addClient.Passport" = 4,
  "addClient.GulfNationalIdentity" = 5,
  "addClient.WorkAndMobilityCard" = 6,
  "addClient.Other" = 7
}
// export enum PlaintiffNationalType {
//   // All = 1,
//   "addClient.NationalIdentity" = 2,
//   "addClient.RegularResidence" = 3,
//   "addClient.Passport" = 4,
//   "addClient.GulfNationalIdentity" = 5,
//   "addClient.WorkAndMobilityCard" = 6,
//   "addClient.Other" = 6
// }
