export enum ConditionType {
  ClientManagment = 1,
  EmployeeManagment = 2,
  ContractManagment = 3,
  BranchManagment = 4,
  SittingManagment = 5,
  AgencyManagment = 6,
  LawsuitManagment = 7,
  TaskManagment = 8,
}
export enum ConditionValue {
  None = 0,
  Integer = 1,
}

export enum PackageType {
  All = 1,
  Active = 2,
  Inactive = 3,
}
export enum SubscriptionValidity {
  All = 1,
  Active = 2,
  Expired = 3,
}
export enum DurationPackage {
  Month = 0,
  ThreeMonths = 1,
  SixMonths = 2,
  Year = 3,
  //appear in free trial only
  fourteenDays = 4,
  TwentyOneDays = 5,
  ThirtyDays = 6,
  SixtyDays = 7,
  NinetyDays = 8,
  OneHundredEightyDays = 9,
  TwoHundredSeventyDays = 10,
  ThreeHundredSixtyDays = 11,
}
