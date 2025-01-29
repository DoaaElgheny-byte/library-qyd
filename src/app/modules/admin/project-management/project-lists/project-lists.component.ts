import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';
import { EmployeeManagementService } from 'src/app/services/api/employee-management.service';
import { IssuesService } from 'src/app/services/api/issues.service';
import { ProjectName, ProjectStatusType, ProjectType, ProjectTypeName } from 'src/app/services/enums/client';
import { TaskListModalComponent } from '../modals/task-list-modal/task-list-modal.component';
import { ContractListModalComponent } from '../modals/contract-list-modal/contract-list-modal.component';
import { CaseManagementModalComponent } from '../modals/case-management-modal/case-management-modal.component';
import { PackageManagementService } from 'src/app/services/api/package-management.service';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';

@Component({
  selector: 'app-project-lists',
  templateUrl: './project-lists.component.html',
  styleUrls: ['./project-lists.component.scss']
})
export class ProjectListsComponent implements OnInit {
  isAuth: boolean = true
  issueStatusEnum = ProjectType;
  isProjectNameEnum = ProjectName;
  private modalService = inject(NgbModal);
  private employee = inject(EmployeeManagementService);

  projectStatus: any;
  projectTypes: any;
  fromSearchInput: boolean = false;
  page: number = 1;
  pageSize: number = 10;
  employeeeId: number = 0;
  ProjectType: string = '';
  projectStatusType: string = '';
  IsDraft: any = '';
  allProjects: any[] = [];
  employees: any[] = [];
  totalCount: number;

  isShowProjects: boolean = false;

  filterObj = this.initFilterObj();
  initFilterObj() {
    return {
      Sorting: 'id',
      SkipCount: 0,
      MaxResultCount: this.pageSize,
      employeeeId: this.employeeeId,
      ProjectType: this.ProjectType,
      projectStatusType: this.projectStatusType
    };
  }

  constructor(private projectService: IssuesService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private authService: AuthService,
    private managePackageService: PackageManagementService
  ) { }

  ngOnInit(): void {
    this.managePackageService.getConditionsForAgent().subscribe(res => {
      let result = res.data;
      result.forEach((item: any) => {
        if (item.conditionId === 10) {
          this.isShowProjects = true;
        }
      });
      if (this.isShowProjects) {

        this.getAllProjectsData();
        this.getProjectTypes();
        this.getProjectStatus();
        this.getEmployees();
        this.breadcrumbService.restoreBreadcrumbsFromStorage();
      }
      else {
        this.router.navigate(['/agent/error-package'], {
          queryParams: { key: 'Finish' },
        });
      }
    });
  }

  getAllProjectsData() {
    if (!this.fromSearchInput) {
      this.spinner.show();
    }
    const startIndex = (this.page - 1) * this.pageSize;
    this.filterObj.SkipCount = startIndex;
    this.filterObj.ProjectType = this.ProjectType;
    this.filterObj.employeeeId = this.employeeeId;
    this.filterObj.projectStatusType = this.projectStatusType;
    this.spinner.show();

    let data = { ...this.filterObj };
    this.projectService.searchProject(data).subscribe({
      next: (next) => {
        this.allProjects = next.data.items;
        console.log(this.allProjects)
        this.totalCount = next.data.totalCount;
        this.spinner.hide();
        this.cdr.detectChanges();
      },
    });
  }

  getProjectStatus(): void {

    this.projectStatus = Object.keys(ProjectStatusType)
      .filter((key) => !isNaN(Number(ProjectStatusType[key as keyof typeof ProjectStatusType])))
      .map((key) => ({ id: Number(ProjectStatusType[key as keyof typeof ProjectStatusType]), name: key }));
  }

  getProjectTypes(): void {
    this.projectTypes = Object.keys(ProjectTypeName)
      .filter((key) => !isNaN(Number(ProjectTypeName[key as keyof typeof ProjectTypeName])))
      .map((key) => ({ id: Number(ProjectTypeName[key as keyof typeof ProjectTypeName]), name: key }));
  }

  getEmployees(): void {
    this.employee.getEmployeesLookups().subscribe({
      next: (res) => {
        this.employees = res.data;
      },
    });
  }

  edit(id: any) {
    localStorage.setItem('currentStep', localStorage.getItem('currentStep') || '1');
    this.router.navigate(['/admin/departments/project-management/add-edit-project', id]);
  }

  view(id: any) {
    this.router.navigate(['details', id], { relativeTo: this.route });
  }

  inValid() {
    this.router.navigate(['/agent/error-package'], {
      queryParams: { key: 'Finish' },
    });
  }

  resetSteps() {
    this.authService.getcurrentUserApi().subscribe((res) => {
      if (res.data.isExpiredAdding) {
        this.inValid();
      } else {
        localStorage.setItem('currentStep', '1')
      }
    });
  }

  viewTaskList(projectId: any) {
    const modalRef = this.modalService.open(TaskListModalComponent, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
    });
    modalRef.componentInstance.projectId = projectId;
  }

  viewContractList(contractId: any) {
    const modalRef = this.modalService.open(ContractListModalComponent, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
    });
    modalRef.componentInstance.contractId = contractId;
  }
  viewCaseManagement(lawsuitId: any) {

    const modalRef = this.modalService.open(CaseManagementModalComponent, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
    });
    modalRef.componentInstance.lawsuitId = lawsuitId;
  }
}


