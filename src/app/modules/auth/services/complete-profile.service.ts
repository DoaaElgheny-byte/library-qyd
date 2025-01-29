import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebApiService } from 'src/app/services/webApi.service';

@Injectable({
  providedIn: 'root'
})
export class CompleteProfileService {

  constructor(private webApi: WebApiService,
  ) {

  }
  getSectors() {
    return this.webApi.get(
      'api/app/manage-organization-sector'
    );
  }
  getEmployeeNo() {
    return this.webApi.get(
      'api/app/manage-agent-size'
    );
  }
  getRegion() {
    return this.webApi.get(
      'api/app/manage-region'
    );
  }
  getCity(param: any) {
    return this.webApi.get(
      'api/app/manage-city', param
    );
  }
  getCurrancy() {
    return this.webApi.get(
      'api/app/manage-currency'
    );
  }
  completeProfile(body: any): Observable<any> {
    return this.webApi.put(
      'api/app/manage-agent/complete-profile',
      body
    )
  }
  Step2completeProfile(body: any): Observable<any> {
    return this.webApi.put(
      'api/app/manage-agent/edit-account-details',
      body
    )
  }
  getDataOfCompleteInfo(id: any) {
    return this.webApi.get(
      `api/app/manage-agent/${id}/agent-details`
    )
  }

  getDataOfforgA4() {
    return this.webApi.get(
      'api/app/manage-agent/agent-details-for-gA4'
    )
  }

  editAgencyIsComplete(id: any) {
    return this.webApi.put(
      `api/app/manage-agent/${id}/agent-is-complete`
    )
  }
  getAgencyIsComplete(id: any) {
    return this.webApi.get(
      `api/app/manage-agent/${id}/agent-is-complete`
    )
  }
  editProfile(body: any) {
    return this.webApi.put(
      'api/app/manage-agent/edit-agent',
      body
    )
  }
  editPassword(body: any) {
    return this.webApi.post(
      'api/app/manage-account/change-password',
      body
    )
  }
  sendVerificationCode(email: any) {
    return this.webApi.post(
      `api/app/manage-account/generate-email-verify-code?email=${email}`
    )
  }

  addAgentUsers(body: any) {
    return this.webApi.post(
      'api/app/manage-agent/register-users-to-agent',
      body
    )
  }

  editAgentUsers(body: any) {
    return this.webApi.put(
      'api/app/manage-agent/edit-users-to-agent',
      body
    )
  }
  getAgentUsers(body: any) {
    return this.webApi.get(
      'api/app/manage-agent/childern-agents',
      body
    )
  }


  sendFreeTrial() {
    return this.webApi.post(
      'api/app/manage-account/send-free-trial'
    )
  }

  checkValidationCode(body: any) {
    return this.webApi.post(
      'api/app/manage-account/validate-verification-code',
      body
    )
  }
  sendWelcomeEmail(body: any) {
    return this.webApi.post(
      'api/app/manage-account/send-welcome-email',
      body
    )
  }

  editEmail(body: any) {
    return this.webApi.put(
      'api/app/manage-agent/edit-email',
      body
    )
  }
}
