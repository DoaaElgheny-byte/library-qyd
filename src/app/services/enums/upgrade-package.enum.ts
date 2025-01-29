export enum DurationPackage {
  Month = 0,
  ThreeMonths = 1,
  SixMonths = 2,
  Year = 3,
}

export enum DurationFreeTrialPackage {
  Zero = 1,
  Seven = 2,
  fourteenDays = 3,
  ThirtyDays = 4,
  Always = 5
}
export enum StorageSizeType {
  OneGB = 1,
  TwoGB = 2,
  ThreeGB = 3,
  FourGB = 4,
  FiveGB = 5,
  SexGB = 6,
  SevenGB = 7,
  EightGB = 8,
  NineGB = 9,
  TenGB = 10,
  ElevenGB = 11,
  TwelveGB = 12,
  ThirteenGB = 13,
  FourteenGB = 14,
  FiveteenGB = 15,
}

export enum packageStatus {
  BuyPackageWhichIselectedFreeTrialOfThis = 1,
  CanNotBuyThisPackageBecauseLimit = 2,
  CanDownGridpackage = 3,
  Not = 4,
}

export enum ConditionType {
  "upgradePackage.ClientManagment" = 1,
  "upgradePackage.EmployeeManagment" = 2,
  "upgradePackage.ContractManagment" = 3,
  "upgradePackage.BranchManagement" = 4,
  "upgradePackage.SittingManagement" = 5,
  "upgradePackage.AgencyManagement" = 6,
  "upgradePackage.LawsuitManagement" = 7,
  "upgradePackage.TaskManagement" = 8,
  "upgradePackage.ProjectManagement" = 9,
  "upgradePackage.AccountingManagement" = 10
}
