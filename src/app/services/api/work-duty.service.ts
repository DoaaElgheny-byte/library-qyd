import { Injectable } from '@angular/core';
import { WebApiService } from '../webApi.service';

@Injectable({
  providedIn: 'root',
})
export class WorkDutyService {
  constructor(private webApi: WebApiService) { }
  getAllDutyList(params: any) {
    return this.webApi.get('api/app/manage-duty/search-duty', params);
  }
  changeStatus(data: any) {
    return this.webApi.put(`api/app/manage-duty/set-duty-state`, data);
  }
  getDutyDetails(id: any) {
    return this.webApi.get(`api/app/manage-duty/${id}/duty-by-id`);
  }
  addWorkDutyInfo(body: any) {
    return this.webApi.post(`api/app/manage-duty/duty-data`, body);
  }
  editDutyInfo(body: any) {
    return this.webApi.put(`api/app/manage-duty/edit-duty-data`, body);
  }
  editAssigned(body: any) {
    return this.webApi.post(`api/app/manage-duty/assigned-team-duty`, body);
  }
  getCaseslist() {
    return this.webApi.get(`api/app/manage-lawsuit/lawsuit-list`);
  }
  addAttachment(body: any) {
    return this.webApi.put(`api/app/manage-duty/assigned-duty-file`, body);
  }
  changeToPublic(id: any) {
    return this.webApi.put(`api/app/manage-duty/${id}/change-duty-from-draft`);
  }
  updateWorkDuty(id: any) {
    return this.webApi.post(`api/app/manage-duty/${id}/work-duty-update`);
  }
  getWorkName() {
    return this.webApi.get(`api/app/manage-duty/duty-names`);
  }
  getLawsuitInBranch(id: any) {
    return this.webApi.get(
      `api/app/manage-lawsuit/lawsuit-by-branch-id/${id}`
    );
  }
  getDutiesLookups() {
    return this.webApi.get(`api/app/manage-duty/duties-lookups`);
  }
}
