import { Injectable } from '@angular/core';
import { WebApiService } from '../webApi.service';

@Injectable({
  providedIn: 'root',
})
export class IssuesService {
  constructor(private webApi: WebApiService) { }
  addLawsuit(body: any) {
    return this.webApi.post('api/app/manage-lawsuit/lawsuit-data', body);
  }
  editLawsuit(body: any) {
    return this.webApi.put('api/app/manage-lawsuit/edit-lawsuit-data', body);
  }
  getMainCourt() {
    return this.webApi.get('api/app/manage-main-court');
  }
  getCommittee() {
    return this.webApi.get('api/app/manage-committee');
  }
  getCourtByType(courtType: any) {
    return this.webApi.get(`api/app/manage-court?input=${courtType}`);
  }
  getCourt() {
    return this.webApi.get(`api/app/manage-court`);
  }
  getSubCourt(id: any) {
    return this.webApi.get(`api/app/manage-sub-court?courtId=${id}`);
  }
  getLawsuitDetails(id: any) {
    return this.webApi.get(`api/app/manage-lawsuit/${id}/lawsuit-by-id`);
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
    return this.webApi.post(`api/app/manage-lawsuit/assigned-team`, body);
  }
  getNationalty() {
    return this.webApi.get(`api/app/manage-nationality/nationalities`);
  }
  addPlaintiff(body: any) {
    return this.webApi.post(
      `api/app/manage-lawsuit/assigned-plaintiff-data`,
      body
    );
  }
  addDefendant(body: any) {
    return this.webApi.post(
      `api/app/manage-lawsuit/assigned-defendant-data`,
      body
    );
  }
  addAttachment(body: any) {
    return this.webApi.post(
      `api/app/manage-lawsuit/assigned-law-suit-files`,
      body
    );
  }
  searchLawsuit(params: any) {
    return this.webApi.get(`api/app/manage-lawsuit/search-lawsuit`, params);
  }
  changeToPublic(id: any) {
    return this.webApi.put(
      `api/app/manage-lawsuit/${id}/change-from-draft-to-public`
    );
  }
  getClientList(BranchId: any, type: any) {
    return this.webApi.get(`api/app/manage-client/client-list?BranchId=${BranchId}&type=${type}`);
  }
  getClientListonly(BranchId: any) {
    return this.webApi.get(`api/app/manage-client/client-list?BranchId=${BranchId}`);
  }
  changeStatus(data: any) {
    return this.webApi.put(`api/app/manage-lawsuit/set-lawsuit-state`, data);
  }
  getIssueHistory(params: any) {
    return this.webApi.get(`api/app/manage-lawsuit-history/lawsuit-history`, params)
  }
  getIssueHistoryById(id: any) {
    return this.webApi.get(`api/app/manage-lawsuit-history/${id}/lawsuit-history-by-id`)
  }
  addReason(data: any) {
    return this.webApi.put(
      `api/app/manage-lawsuit/add-updated-reason-to-lawsuit`,
      data
    );
  }
  confirmDeleteEmployeeBranch(branchId: any) {
    return this.webApi.post(`api/app/manage-sitting/change-sitting-branch/${branchId}`);
  }

  getLawsuitLookups() {
    return this.webApi.get(`api/app/manage-lawsuit/lawsuit-lookups`)
  }
  AddProject(body: any) {
    return this.webApi.post('api/app/manage-lawsuit/project-data', body);
  }
  AddProjectForCompleteLater(body: any) {
    return this.webApi.post('api/app/manage-lawsuit/project-for-complete-later-data', body);
  }
  editProject(body: any) {
    return this.webApi.put('api/app/manage-lawsuit/edit-project-data', body);
  }
  editProjectForCompleteLater(body: any) {
    return this.webApi.put('api/app/manage-lawsuit/edit-project-for-complete-later-data', body);
  }
  searchProject(params: any) {
    return this.webApi.get(`api/app/manage-lawsuit/search-project`, params);
  }
  getProjectDetails(id: any) {
    return this.webApi.get(`api/app/manage-lawsuit/${id}/project-by-id`);
  }

  ChangeProjectToChanceCompleteForLater(body: any) {
    return this.webApi.post('api/app/manage-lawsuit/convert-project-opportunity-complete-later-data', body);
  }
  ChangeProjectToChance(body: any) {
    return this.webApi.post('api/app/manage-lawsuit/convert-project-opportunity-data', body);
  }
  EditChangeProjectToChance(body: any) {
    return this.webApi.put('api/app/manage-lawsuit/edit-convert-project-opportunity-data', body);
  }
  EditChangeProjectToChanceCompleteForLater(body: any) {
    return this.webApi.put('api/app/manage-lawsuit/edit-convert-project-opportunity-complete-later-data', body);
  }
  AssignedFilesToChangeProjectToChance(body: any) {
    return this.webApi.put('api/app/manage-lawsuit/assigned-convert-project-opportunity-file', body);
  }
  getChangeProjectToChanceById(id: any) {
    return this.webApi.get(`api/app/manage-lawsuit/${id}/change-project-to-chance-by-id`)
  }
  AddPriceToProject(body: any) {
    return this.webApi.post('api/app/manage-lawsuit/price-to-project-data', body);
  }
  addPriceToProjectCompleteLaterData(body: any) {
    return this.webApi.post('api/app/manage-lawsuit/price-to-project-complete-later-data', body);
  }
  getDataPriceToProjectDataQuery(id: any) {
    return this.webApi.get(`api/app/manage-lawsuit/${id}/data-price-to-project-data-query`)
  }
  GetDataPrePriceToProjectData(id: any) {
    return this.webApi.get(`api/app/manage-lawsuit/${id}/data-pre-price-to-project-data`)
  }
  GetProjectDetails(id: any) {
    return this.webApi.get(`api/app/manage-lawsuit/project-details/${id}`)
  }
  EditIsApprovedPriceOfProject(body: any) {
    return this.webApi.put('api/app/manage-lawsuit/price-to-project', body);
  }


  AddPaymentNotice(body: any) {
    return this.webApi.post('api/app/manage-lawsuit/payment-notice-data', body);
  }
  EditPaymentNotice(body: any) {
    return this.webApi.put('api/app/manage-lawsuit/edit-payment-notice-data', body);
  }
  GetPaymentNoticeAllData(projectId: any) {
    return this.webApi.get(`api/app/manage-lawsuit/payment-notice-all-data/${projectId}`)
  }
  GetPaymentNoticeById(projectId: any) {
    return this.webApi.get(`api/app/manage-lawsuit/${projectId}/payment-notice-by-id`)
  }
  GetPrefPaymentNoticeData(projectId: any) {
    return this.webApi.get(`api/app/manage-lawsuit/${projectId}/pref-payment-notice-data`)
  }
  getAllInvoicesInPayments(projectId: any) {
    return this.webApi.get(`api/app/manage-lawsuit/invoices-for-payments/${projectId}`)
  }


  paymentNoticeForSdad(paymentNoticeId: any) {
    return this.webApi.put(`api/app/manage-lawsuit/payment-notice-for-sdad-notice/${paymentNoticeId}`);
  }

  paymentNoticeInvoice(projectId: any) {
    return this.webApi.put(`api/app/manage-lawsuit/payment-notice-invoice/${projectId}`);
  }

  getAllAccountingSummary(params: any) {
    return this.webApi.get(`api/app/manage-lawsuit/accounting-summary`, params)
  }

  getPaymentScheduleQuery(params: any) {
    return this.webApi.get(`api/app/manage-lawsuit/payment-schedule-query`, params)
  }

  getAllTrialBalanceQuery(params: any) {
    return this.webApi.get(`api/app/manage-lawsuit/trial-balance-query`, params)
  }

  AddVatNumberForClient(projectId: any) {
    return this.webApi.put(`api/app/manage-lawsuit/add-vat-number-for-client/${projectId}`);
  }
}
