import { Injectable } from '@angular/core';
import { WebApiService } from '../webApi.service';

@Injectable({
  providedIn: 'root',
})
export class BranchesService {
  constructor(private webApi: WebApiService) { }
  getAllBranchesList() {
    return this.webApi.get('api/app/manage-branches/branche-list');
  }

  getAllBranches(params?: any) {
    return this.webApi.get('api/app/manage-branches/branches', params);
  }
  getBranchDetail(id: any) {
    return this.webApi.get(`api/app/manage-branches/${id}/branch-details`);
  }
  changeStatus(body: any) {
    return this.webApi.post('api/app/manage-Branches/change-branch-status', body);
  }
  addNewBranches(body: any) {
    return this.webApi.post('api/app/manage-Branches', body);
  }
  editBranches(body: any) {
    return this.webApi.post('api/app/manage-Branches/edit', body);
  }
  activeBranches() {
    return this.webApi.get('api/app/manage-branches/active-branche');
  }
  setActiveBranch(id: any) {
    return this.webApi.put(`api/app/manage-branches/${id}/set-active-branch`);
  }
  deleteBranches(id: any) {
    return this.webApi.delete(`api/app/manage-Branches/${id}`)
  }
  getRegion() {
    return this.webApi.get(`api/app/manage-region`);
  }
  getClassification() {
    return this.webApi.get(`api/app/manage-branches/branche-names`);
  }
  getManager() {
    return this.webApi.get(`api/app/manage-employee/manager-employees`);
  }
  getManagerByBranch(branchId: any) {
    return this.webApi.get(`api/app/manage-employee/employees-appoint-manager/${branchId}`);
  }
  getEmployeeBranch() {
    return this.webApi.get(`api/app/manage-branches/branche-to-assign-employee`);
  }

}
