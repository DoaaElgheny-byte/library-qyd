import { DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PageInfoService } from 'src/app/_metronic/layout';
import { ContractService } from 'src/app/services/api/contract.service';
import { IssuesService } from 'src/app/services/api/issues.service';
import { ContractStatus } from 'src/app/services/enums/contractStatus.enum';
import {
  ClientStaus,
  EntityType,
  LawsuitState,
  LawsuitStatus,
  LawsuitType,
  LawsuitTypeEnum,
  MainCourtType,
} from 'src/app/services/enums/lawsuit';
import { TeamViewComponent } from '../team-view/team-view.component';
import { Router } from '@angular/router';
import { EmployeeManagementService } from 'src/app/services/api/employee-management.service';
import { finalize, Subscription } from 'rxjs';
import { ConfirmationDialogService } from 'src/app/modules/SharedComponent/SharedComponent/confirmation-dialog/confirmation-dialog.service';
import { AuthService } from 'src/app/modules/auth';
import { Constants } from 'src/app/services/Constants/constants';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';
import { PackageManagementService } from 'src/app/services/api/package-management.service';

@Component({
  selector: 'app-issue-management',
  templateUrl: './issue-management.component.html',
  styleUrls: ['./issue-management.component.scss'],
})
export class IssueManagementComponent implements OnInit, OnDestroy {
  issueStatusEnum = LawsuitStatus;
  issueTypes = LawsuitTypeEnum;
  issueState = LawsuitState;
  searchText: string = '';
  clientStaus = ClientStaus;
  State: string = '';
  page: number = 1;
  pageSize: number = 10;
  allUsers: any[] = [];
  filterObj = this.initFilterObj();
  totalCount: number;
  lang: string | null = localStorage.getItem('language');
  fromSearchInput: boolean = false;
  currentUser: any;
  isEmployee: boolean;
  isShowCases: boolean = false;

  IsDraft: any = '';
  constructor(
    private issueservice: IssuesService,
    private cdr: ChangeDetectorRef,
    private employeeService: EmployeeManagementService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private bradecrumbservice: PageInfoService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router,
    private translate: TranslateService,
    private authService: AuthService,
    private managePackageService: PackageManagementService,
    private breadcrumbService: BreadcrumbService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.managePackageService.getConditionsForAgent().pipe(finalize(() => { this.spinner.hide() })).subscribe(res => {
      let result = res.data;
      result.forEach((item: any) => {
        if (item.conditionId === 8) {
          this.isShowCases = true;
        }
      });
      if (this.isShowCases) {
        this.breadcrumbService.restoreBreadcrumbsFromStorage();
        this.currentUser = this.authService.getCurrentUser();
        if (this.currentUser.roles[0] == Constants.AllRoles.employee) {
          this.isEmployee = true;
        } else {
          this.isEmployee = false;
        }
        this.getEntityList()
        this.getEmployeeList();
        this.getAllUsersData();
        this.getCommittee()
      }
      else {
        this.router.navigate(['/agent/error-package'], {
          queryParams: { key: 'Finish' },
        });
      }
    });
  }

  mainCourt: any;
  keyPressNumbers(event: any) {
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode < 48 || charCode > 57 || event.target.value.length > 18) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
  entityList: any
  entityType = EntityType
  getEntityList() {
    this.entityList = Object.keys(this.entityType)
      .filter(
        (key) =>
          !isNaN(Number(this.entityType[key as keyof typeof this.entityType]))
      )
      .map((key) => ({
        id: Number(this.entityType[key as keyof typeof this.entityType]),
        name: key,
      }));
  }
  isCourt: boolean = false
  isCommittee: boolean = false
  selectEntity(e: any) {
    if (e == this.entityType['addIssue.Committee']) {
      this.isCommittee = true;
      this.isCourt = false
    } else if (
      e == this.entityType['addIssue.AdministrativeCourt'] ||
      e == this.entityType['addIssue.GeneralCourt'] ||
      e == this.entityType['addIssue.MinistryOfHumanResources']
    ) {
      this.isCommittee = false;
      this.isCourt = true
      this.getCourt(e);
    } else {
      this.isCommittee = false;
      this.isCourt = false
    }
  }
  courts: any
  mainCourtEnum = MainCourtType
  //get main court
  getCourt(courtType: any) {
    if (courtType == this.entityType['addIssue.MinistryOfHumanResources']) {
      courtType = this.mainCourtEnum.MinistryOfHumanResources
    }
    this.issueservice.getCourtByType(courtType).subscribe({
      next: (next) => {
        if (next.success) {
          this.spinner.hide();
          this.courts = next.data;
          this.cdr.detectChanges();
        }
      },
    });
  }
  committeeList: any
  //get get Committee
  getCommittee() {
    this.issueservice.getCommittee().subscribe({
      next: (next) => {
        this.spinner.hide();
        this.committeeList = next.data;
      },
    });
  }
  employees: any;
  getEmployeeList() {
    this.employeeService.getEmployeeList().subscribe({
      next: (next) => {
        this.employees = next.data;
      },
    });
  }
  getShortName(fullName: string) {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .join('');
  }
  setBreadcrumb() {
    let bc = [
      { title: 'home', path: '/agent', isActive: true, isSeparator: true },
      {
        title: 'contract',
        path: '/agent/contract',
        isActive: false,
        isSeparator: false,
      },
    ];
    this.bradecrumbservice.setBreadcrumbs(bc);
  }
  issueNo: string = '';
  issueStatus: string = '';
  issueType: string = '';
  court: string = '';
  employee: Array<any>;
  CourtType: string = ''
  CommitteeId: string = ''
  initFilterObj() {
    return {
      Sorting: 'id',
      SkipCount: 0,
      MaxResultCount: this.pageSize,
      Number: this.issueNo,
      LawsuitStatus: this.issueStatus,
      LawsuitType: this.issueType,
      CourtId: this.court,
      CourtType: this.CourtType,
      CommitteeId: this.CommitteeId,
      IsDraft: this.IsDraft
    };
  }
  to: any;
  from: any;
  copy(item: any) {
    let type =
      item.clientStaus == this.clientStaus.Defendant
        ? this.translate.instant('addIssue.Defendant')
        : this.translate.instant('addIssue.Plaintiff');
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '30';
    selBox.value = `
  ${item.clientResponseDto.name}
  ${item.clientResponseDto.mobileNumber}
  ${item.clientResponseDto.email}
 ${type}
 
  
  `;

    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();


    this.toastr.success(this.translate.instant('addClient.copydone'));
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
  getAllUsersData() {
    if (!this.fromSearchInput) {
      this.spinner.show();
    }
    const startIndex = (this.page - 1) * this.pageSize;
    this.filterObj.SkipCount = startIndex;
    if (this.issueStatus == '0') {
      this.issueStatus = '';
      (this.filterObj.IsDraft = true)
    } else {
      if (this.issueStatus) {
        if (this.issueStatus == (this.issueStatusEnum.All).toString()) {
          this.filterObj.IsDraft = ''
        } else {
          this.filterObj.IsDraft = false;
        }
      }
      else {
        this.filterObj.IsDraft = '';
      }
    }
    (this.filterObj.Number = this.issueNo),

      (this.filterObj.LawsuitStatus = this.issueStatus),
      (this.filterObj.LawsuitType = this.issueType),
      (this.filterObj.CourtId = this.court),
      (this.filterObj.CourtType = this.CourtType),
      (this.filterObj.CommitteeId = this.CommitteeId),
      (this.filterObj.MaxResultCount = this.pageSize);
    if (this.employee) {
      let data = { ...this.filterObj, Employees: this.employee };
      this.issueservice.searchLawsuit(data).subscribe({
        next: (next) => {
          this.allUsers = next.data.items;
          console.log(this.allUsers);
          this.totalCount = next.data.totalCount;
          this.spinner.hide();
          this.cdr.detectChanges();
        },
      });
    } else {
      this.issueservice.searchLawsuit(this.filterObj).subscribe({
        next: (next) => {
          this.allUsers = next.data.items;
          console.log(this.allUsers);

          this.totalCount = next.data.totalCount;
          this.spinner.hide();
          this.cdr.detectChanges();
        },
      });
    }
  }
  private modalService = inject(NgbModal);

  viewTeam(employees: any) {
    if (employees) {
      const modalRef = this.modalService.open(TeamViewComponent);
      modalRef.componentInstance.employees = employees;
      modalRef.result.then(
        () => { },
        () => {
        }
      );
    }
  }


  inValid() {
    this.router.navigate(['/agent/error-package'], {
      queryParams: { key: 'Finish' },
    });
  }


  addNew() {
    this.authService.getcurrentUserApi().subscribe((res) => {
      if (res.data.isExpiredAdding) {
        this.inValid();
      } else {
        localStorage.setItem('step', '');
        this.router.navigate(['/agent/departments/cases/add-issue']);
      }
    });
  }
  addNajez() {
    this.confirmationDialogService
      .confirm(
        this.translate.instant('issue.najez'),
        '',
        '',
        false,
        true,
        '<i class="fa-solid fa-plus px-2"></i>' + this.translate.instant('issue.addNew'),
      )
      .then(
        (confirmed: any) => {
          if (confirmed) {
            localStorage.setItem('step', '');
            this.router.navigate(['/agent/departments/cases/add-issue']);
          } else {
            this.router.navigate(['/agent/departments/cases']);

          }
        },
        () => {
          this.router.navigate(['/agent/departments/cases']);

        }
      );
  }
  edit(id: any) {
    localStorage.setItem('step', '');
    this.router.navigate(['/agent/departments/cases/add-issue', id]);
  }
  view(id: any, tab: any) {
    this.router.navigate(['/agent/departments/cases/view-issue', id, tab]);
  }
  session(id: any, tab: any) {
    this.router.navigate(['/agent/departments/cases/view-issue', id, tab]);
  }
  workDuy(id: any, tab: any) {
    this.router.navigate(['/agent/departments/cases/view-issue', id, tab]);
  }
  log(id: any, tab: any) {
    this.router.navigate(['/agent/departments/cases/view-issue', id, tab]);
  }
  changAccountState(user: any) {
    let oldVal = user.lawsuitState;
    user.lawsuitState =
      user.lawsuitState == this.issueState.Active
        ? this.issueState.Inactive
        : this.issueState.Active;

    this.confirmationDialogService
      .confirm(
        this.translate.instant('issue.confirmModalTitle'),
        this.translate.instant('issue.activeMessage'),
        '',
        false
      )
      .then(
        (confirmed: any) => {
          this.spinner.show();
          let userstate = { id: user.id, state: user.lawsuitState };
          if (confirmed) {
            this.issueservice.changeStatus(userstate).subscribe(
              (data) => {
                this.spinner.hide();
                this.toastr.success(
                  this.translate.instant('issue.changeAccountStatus')
                );
                this.getAllUsersData();
                console.log(this.allUsers);

              },
              (err) => {
                this.spinner.hide();
                this.toastr.error(err.error.error.message);

              }
            );
          } else {
            user.lawsuitState = oldVal;
            this.getAllUsersData();
            console.log(this.allUsers);

            this.cdr.detectChanges();
          }
        },
        () => {
          user.lawsuitState = oldVal;
          this.getAllUsersData();
          console.log(this.allUsers);

          this.cdr.detectChanges();
        }
      );
  }
  assigned(id: any) {
    this.router.navigate(['/agent/departments/cases/assigned-case', id])
  }
  private unsubscribe: Subscription[] = [];

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
