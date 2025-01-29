import { Injectable } from '@angular/core';
import { WebApiService } from '../webApi.service';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(private webApi: WebApiService) { }
  addClient(body: any) {
    return this.webApi.post('api/app/manage-client', body);
  }
  editClient(body: any) {
    return this.webApi.put('api/app/manage-client/edit', body);
  }
  getClientDetails(id: any) {
    return this.webApi.get(`api/app/manage-client/${id}/client-by-id`);
  }
  getAllClientList(params: any) {
    return this.webApi.get('api/app/manage-client/search-client', params);
  }
  changeStatus(data: any) {
    return this.webApi.put(`api/app/manage-client/set-client-state`, data);
  }
  getBranchesList() {
    return this.webApi.get('api/app/manage-branches/branche-list');
  }
  getClassification(type: number) {
    return this.webApi.get(`api/app/manage-client/client-classification-attachment?ClientType=${type}`);

  }
  getLawsuitClassification() {
    return this.webApi.get(`api/app/manage-lawsuit/lawsuit-classification-attachment`);

  }
  getClientListByBranch(BranchId: any) {
    return this.webApi.get(`api/app/manage-client/client-list?BranchId=${BranchId}`);
  }
  getClientLookups() {
    return this.webApi.get(`api/app/manage-client/clients-lookups`)
  }
}
