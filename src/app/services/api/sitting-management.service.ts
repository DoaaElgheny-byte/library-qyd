import { Injectable } from '@angular/core';
import { WebApiService } from '../webApi.service';

@Injectable({
  providedIn: 'root',
})
export class SittingManagementService {
  constructor(private webApi: WebApiService) {}
  addSitting(body: any) {
    return this.webApi.post('api/app/manage-sitting/sitting-data', body);
  }
  editSitting(body: any) {
    return this.webApi.put('api/app/manage-sitting/edit-sitting-data', body);
  }
  getMainCourt() {
    return this.webApi.get('api/app/manage-main-court');
  }

  getSittingDetails(id: any) {
    return this.webApi.get(`api/app/manage-sitting/${id}/sitting-by-id`);
  }
  getBranch() {
    return this.webApi.get(`api/app/manage-branches/branche-list`);
  }
  getEmployeeInBranch(id: any) {
    return this.webApi.get(
      `api/app/manage-employee/employees-by-branch-id/${id}`
    );
  }
  addAssigned(body: any) {
    return this.webApi.post(
      `api/app/manage-sitting/assigned-team-sitting`,
      body
    );
  }

  addReportOfSitting(body: any) {
    return this.webApi.put(
      `api/app/manage-sitting/assigned-sitting-report`,
      body
    );
  }

  addAttachment(body: any) {
    return this.webApi.put(
      `api/app/manage-sitting/assigned-sitting-file`,
      body
    );
  }
  searchSitting(params: any) {
    return this.webApi.get(`api/app/manage-sitting/search-sitting`, params);
  }

  getClientList(BranchId:any) {
    return this.webApi.get(`api/app/manage-client/client-list?BranchId=${BranchId}`);
  }
  changeStatus(data: any) {
    return this.webApi.put(`api/app/manage-sitting/set-sitting-state`, data);
  }

  getCases() {
    return this.webApi.get(`api/app/manage-lawsuit/lawsuit-list`);
  }
  changeToPublic(id: any) {
    return this.webApi.put(
      `api/app/manage-sitting/${id}/change-sitting-from-draft-to-public`
    );
  }
  addReason(body: any) {
    return this.webApi.put(
      `api/app/manage-sitting/add-updated-reason-to-sitting`,
      body
    );
  }
  sittingHistory(params: any) {
    return this.webApi.get(
      `api/app/manage-sitting-history/sitting-history`,
      params
    );
  }
  sittingHistoryById(id: any) {
    return this.webApi.get(
      `api/app/manage-sitting-history/${id}/sitting-history-by-id`
    );
  }
  sendReportToClient(id:any){
    return this.webApi.post(
      `api/app/manage-sitting/${id}/send-report-to-client`
    )
  }

  getAgentLogo(){
    return this.webApi.get(
      `api/app/manage-agent/agent-logo`
    );
  }
  getCourt() {
    return this.webApi.get('api/app/manage-court');
  }
  getLawsuitInBranch(id: any) {
    return this.webApi.get(
      `api/app/manage-lawsuit/lawsuit-by-branch-id/${id}`
    );
  }
  getCommittee() {
    return this.webApi.get('api/app/manage-committee');
  }
 
}
