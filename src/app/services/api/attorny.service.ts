import { Injectable } from '@angular/core';
import { WebApiService } from '../webApi.service';

@Injectable({
  providedIn: 'root',
})
export class AttornyService {
  constructor(private webApi: WebApiService) {}
  getAllagencyList(params: any) {
    return this.webApi.get('api/app/manage-agency/search-agency', params);
  }
  changeStatus(data: any) {
    return this.webApi.put(`api/app/manage-agency/set-agency-state`, data);
  }
  getagencyDetails(id: any) {
    return this.webApi.get(`api/app/manage-agency/${id}/agency-by-id`);
  }
  addagencyInfo(body: any) {
    return this.webApi.post(`api/app/manage-agency/agency-data`, body);
  }
  editagencyInfo(body: any) {
    return this.webApi.put(`api/app/manage-agency/edit-agency-data`, body);
  }
  editAssigned(body: any) {
    return this.webApi.post(
      `api/app/manage-agency/assigned-team-agency`,
      body
    );
  }
  getBranch() {
    return this.webApi.get(`api/app/manage-branches/branche-list`);
  }
  getEmployeeInBranch(id: any) {
    return this.webApi.get(
      `api/app/manage-employee/employees-by-branch-id/${id}`
    );
  }
  addAttachment(body: any) {
    return this.webApi.put(
      `api/app/manage-agency/assigned-agency-file`,
      body
    );
  }
  changeToPublic(id: any) {
    return this.webApi.put(
      `api/app/manage-agency/${id}/change-agency-from-draft`
    );
  }
  getClientList() {
    return this.webApi.get(`api/app/manage-client/client-list`);
  }
  updateagency(id: any) {
    return this.webApi.post(`api/app/manage-agency/${id}/agency-update`);
  }
}
