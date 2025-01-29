export class AgentUser {
  name: string;
  email: string;
  passowrd: string;
  description: string;
  mobileNumber: string;
  countryCode: number;
  commercialRegistrationNo: number;
  commercialRegistertionNoImageName: string;
  commercialRegistertionNoImageStorageFileName: string;
  logoImageName: string;
  logoImageStorageFileName: string;
  expirationDate: string;
  agentRepresentativeName: string;
  agentRepresentativeEmail: string;
  agentRepresentativePosition: string;
  agentMobileNumber: string;
  agentCountryCode: number;
  appUserId?: string;
  countryCodeIso?: string;
  agentCountryCodeIso?: string;
  linkedInAccountLink?: string;
  isAllowNotification?: boolean;
}

export interface LookupGuidDto {
  id?: string;
  name?: string;
}
export interface EmployeeLookupDto {
  id?: string;
  name?: string;
}