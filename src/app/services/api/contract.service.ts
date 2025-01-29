import { Injectable } from '@angular/core';
import { WebApiService } from '../webApi.service';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  constructor(private webApi: WebApiService) { }
  getAllContractList(params: any) {
    return this.webApi.get('api/app/manage-contract/search-contract', params);
  }
  changeStatus(data: any) {
    return this.webApi.put(`api/app/manage-contract/set-contract-state`, data);
  }
  getContractDetails(id: any) {
    return this.webApi.get(`api/app/manage-contract/${id}/contract-by-id`);
  }
  addContractInfo(body: any) {
    return this.webApi.post(`api/app/manage-contract/contract-data`, body);
  }
  editContractInfo(body: any) {
    return this.webApi.put(`api/app/manage-contract/edit-contract-data`, body);
  }
  editAssigned(body: any) {
    return this.webApi.post(
      `api/app/manage-contract/assigned-team-contract`,
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
      `api/app/manage-contract/assigned-contract-file`,
      body
    );
  }
  changeToPublic(id: any) {
    return this.webApi.put(
      `api/app/manage-contract/${id}/change-contract-from-draft`
    );
  }
  getClientList(BranchId: any) {
    return this.webApi.get(`api/app/manage-client/client-list?BranchId=${BranchId}`);
  }
  updateContract(id: any) {
    return this.webApi.post(`api/app/manage-contract/${id}/contract-update`);
  }
  getContractLookups() {
    return this.webApi.get(`api/app/manage-contract/contract-lookups`)
  }
}
