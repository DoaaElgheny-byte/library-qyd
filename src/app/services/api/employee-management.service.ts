import { Injectable } from '@angular/core';
import { WebApiService } from '../webApi.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeManagementService {

  constructor(private webApi: WebApiService) { }
  getAllUsers(param?: any) {
    return this.webApi.get('api/app/manage-employee/employees', param);
  }
  changeStatus(body: any) {
    return this.webApi.put('api/app/manage-employee/set-employee-state', body);
  }
  addNewEmployee(body: any) {
    return this.webApi.post('api/app/manage-employee/register-employee', body);
  }
  getEmployeesLookups() {
    return this.webApi.get(`api/app/manage-employee/employee-lookups`);
  }
  AddTeam(body: any) {
    return this.webApi.post('api/app/manage-employee/team', body);
  }
  EditTeam(body: any) {
    return this.webApi.post('api/app/manage-employee/edit-team', body);
  }
  editEmployee(body: any) {
    return this.webApi.put('api/app/manage-employee/edit-employee', body);
  }
  getEmplyeeDetails(id: any) {
    return this.webApi.get(`api/app/manage-employee/${id}/employee-details`)
  }
  deleteEmployee(id: any) {
    return this.webApi.delete(`api/app/manage-employee/${id}/employee`)
  }
  getEmployeeList() {
    return this.webApi.get(`api/app/manage-employee/employees-by-role`)
  }
  getBranches() {
    return this.webApi.get(`api/app/manage-branches/branche-list`)
  }
  getMoreBranches(id: any) {
    return this.webApi.get(`api/app/manage-branches/${id}/branches-by-employee-id`)

  }
  getClassification() {
    return this.webApi.get(`api/app/manage-employee/employee-classification-attachment`)
  }
  confirmDeleteEmployeeBranch(employeeId: any, BranchId: any) {
    return this.webApi.get(`api/app/manage-employee/branch-modification?Id=${employeeId}&BranchId=${BranchId}`)
  }
  deleteEmployeeBranch(employeeId: any, BranchId: any) {
    return this.webApi.delete(`api/app/manage-employee/branch-modification?Id=${employeeId}&BranchId=${BranchId}`)
  }

  getEmployeeTeamById(id: any) {
    return this.webApi.get(`api/app/manage-employee/employees-by-team-id/${id}`)
  }

  getTeamLookups() {
    return this.webApi.get(`api/app/manage-employee/team-lookups`)
  }

  deleteEmployeeFromTeam(id: any, teamId: any) {
    return this.webApi.delete(`api/app/manage-employee/${id}/employee-from-team/${teamId}`)
  }

  getTeamAndEmployeeByTeamId(teamId: any) {
    return this.webApi.get(`api/app/manage-employee/team-and-employee-by-team-id/${teamId}`)
  }
}
