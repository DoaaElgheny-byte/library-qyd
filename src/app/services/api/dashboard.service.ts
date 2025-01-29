import { Injectable } from '@angular/core';
import { WebApiService } from '../webApi.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private webApi: WebApiService) {}
  getClient(params?:any) {
    return this.webApi.get('api/app/manage-statistics/client-statistics',params);
  }
  getContract(params?:any) {
    return this.webApi.get('api/app/manage-statistics/contract-statistics',params);
  }
  getBranch(params?:any) {
    return this.webApi.get('api/app/manage-statistics/branch-statistics',params);
  }
  getLawsuit(params?:any) {
    return this.webApi.get('api/app/manage-statistics/lawsuit-statistics',params);
  }
  getSitting(params?:any) {
    return this.webApi.get('api/app/manage-statistics/sitting-statistics',params);
  } 
////statits
  getDuty(params?:any) {
    return this.webApi.get('api/app/manage-statistics/duty-statistics',params);
  } 
  getEmployee(params?:any) {
    return this.webApi.get('api/app/manage-statistics/employee-statistics',params);
  } 
  getAgency(params?:any) {
    return this.webApi.get('api/app/manage-statistics/agency-statistics',params);
  } 
  getExportEmployee(params?:any) {
    return this.webApi.get('api/app/manage-statistics/export-sheet-employees',params);
  } 
  getExportBranch(params?:any) {
    return this.webApi.get('api/app/manage-statistics/export-shee-branchs',params);
  } 
  getExportLawisut(params?:any) {
    return this.webApi.get('api/app/manage-statistics/export-sheet-lawsuit',params);
  } 
  getExportAgency(params?:any) {
    return this.webApi.get('api/app/manage-statistics/export-sheet-agency',params);
  } 
  getExportSitting(params?:any) {
    return this.webApi.get('api/app/manage-statistics/export-sheet-sitting',params);
  } 
  getExportContract(params?:any) {
    return this.webApi.get('api/app/manage-statistics/export-sheet-contract',params);
  } 
  getExportDuty(params?:any) {
    return this.webApi.get('api/app/manage-statistics/export-sheet-duty',params);
  } 
}
