import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { PageInfoService } from 'src/app/_metronic/layout';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';
import { ConfirmationDialogService } from 'src/app/modules/SharedComponent/SharedComponent/confirmation-dialog/confirmation-dialog.service';
import { AuthService } from 'src/app/modules/auth';
import { Constants } from 'src/app/services/Constants/constants';
import { BranchesService } from 'src/app/services/api/branches.service';
import { PackageManagementService } from 'src/app/services/api/package-management.service';
import { WorkDutyService } from 'src/app/services/api/work-duty.service';
import { WorkDutyState, WorkDutyStatus } from 'src/app/services/enums/work-duty.enum';

@Component({
  selector: 'app-work-duty',
  templateUrl: './work-duty.component.html',
  styleUrls: ['./work-duty.component.scss']
})
export class WorkDutyComponent implements OnInit {
  workDutyStatus = WorkDutyStatus
  workDutyState = WorkDutyState
  searchText: string = ''
  State: string = ''
  EndDate: string
  StartDate: string
  page: number = 1;
  pageSize: number = 10;
  allUsers: any[] = [];
  filterObj = this.initFilterObj();
  totalCount: number;
  fromSearchInput: boolean = false
  currentUser: any;
  isEmployee: boolean;
  BranchId = '';
  branches: any
  isAgent: boolean;
  IsDraft: any = '';
  isShowDuty: boolean = false;

  constructor(
    private workDutyservice: WorkDutyService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private bradecrumbservice: PageInfoService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router,
    private authService: AuthService,
    private breadcrumbService: BreadcrumbService,
    private _branchManagementService: BranchesService,
    private managePackageService: PackageManagementService
  ) { }

  ngOnInit(): void {

    this.spinner.show();
    this.managePackageService.getConditionsForAgent().pipe(finalize(() => { this.spinner.hide() })).subscribe(res => {
      let result = res.data;
      result.forEach((item: any) => {
        if (item.conditionId === 9) {
          this.isShowDuty = true;
        }
      });
      this.isShowDuty = true;
      if (this.isShowDuty) {
        this.breadcrumbService.restoreBreadcrumbsFromStorage();
        this.getBranches();
        this.currentUser = this.authService.getCurrentUser();
        if (this.currentUser.roles[0] == Constants.AllRoles.employee) {
          this.isEmployee = true;
        } else {
          this.isEmployee = false;
        }
        if (this.currentUser.roles[0] == Constants.AllRoles.qydAgent) {
          this.isAgent = true;
        } else {
          this.isAgent = false;
        }
        this.getAllUsersData()
      }
      else {
        this.router.navigate(['/agent/error-package'], {
          queryParams: { key: 'Finish' },
        });
      }

    });
  }
  setBreadcrumb() {
    let bc = [{
      title: 'home',
      path: '/agent',
      isActive: true,
      isSeparator: true
    }, {
      title: 'contract',
      path: '/agent/contract',
      isActive: false,
      isSeparator: false
    }]
    this.bradecrumbservice.setBreadcrumbs(
      bc
    )
  }
  initFilterObj() {
    return {
      Name: this.searchText,
      Sorting: 'id',
      DutyStatus: this.State,
      StartDate: this.EndDate,
      EndDate: this.EndDate,
      BranchId: this.BranchId,
      SkipCount: 0,
      MaxResultCount: this.pageSize,
      IsDraft: this.IsDraft
    };
  }
  to: any
  from: any
  getBranches() {
    this._branchManagementService.getAllBranchesList().subscribe({
      next: next => {
        this.branches = next.data
      }
    })
  }
  getAllUsersData() {

    if (!this.fromSearchInput) {
      this.spinner.show();
    }
    if (this.StartDate != null && this.StartDate != '') {
      this.to = this.StartDate;

      let myDate2 = this.to;
      const date2: NgbDate = new NgbDate(
        myDate2.year,
        myDate2.month,
        myDate2.day
      );
      const jsDate2 = new Date(date2.year, date2.month - 1, date2.day);
      this.to = this.datepipe.transform(jsDate2, 'yyyy-MM-dd');
    } else {
      this.to = '';
    }
    if (this.EndDate != null && this.EndDate != '') {
      this.from = this.EndDate;

      let myDate = this.from;
      const date: NgbDate = new NgbDate(
        myDate.year,
        myDate.month,
        myDate.day
      );
      const jsDate = new Date(date.year, date.month - 1, date.day);
      this.from = this.datepipe.transform(jsDate, 'yyyy-MM-dd');
    } else {
      this.from = '';
    }
    if (this.State == '0') {
      this.State = '';
      (this.filterObj.IsDraft = true)
    } else {
      if (this.State) {
        if (this.State == (this.workDutyState.All).toString()) {
          this.filterObj.IsDraft = ''
        } else {
          this.filterObj.IsDraft = false;
        }
      }
      else {
        this.filterObj.IsDraft = '';
      }
    }
    const startIndex = (this.page - 1) * this.pageSize;
    this.filterObj.SkipCount = startIndex;
    this.filterObj.Name = this.searchText;
    this.filterObj.DutyStatus = this.State;
    this.filterObj.StartDate = this.to;
    this.filterObj.EndDate = this.from;
    this.filterObj.MaxResultCount = this.pageSize;
    this.filterObj.BranchId = this.BranchId;
    this.workDutyservice.getAllDutyList(this.filterObj).subscribe({
      next: next => {
        this.allUsers = next.data.items;
        console.log(next.data.items)
        this.totalCount = next.data.totalCount;
        this.spinner.hide();
        this.cdr.detectChanges();
      }
    })
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
        this.router.navigate(['/agent/departments/work-duty/add-edit-workduty', false, 0])
      }
    });
  }
  changAccountState(user: any) {
    let oldVal = user.dutyState;
    user.dutyState =
      user.dutyState == this.workDutyState.Active
        ? this.workDutyState.Inactive
        : this.workDutyState.Active;

    this.confirmationDialogService
      .confirm(
        this.translate.instant('workDuty.confirmModalTitle'),
        this.translate.instant('workDuty.activeMessage'),
        '',
        false
      )
      .then(
        (confirmed: any) => {
          this.spinner.show();
          let userstate = { id: user.id, state: user.dutyState };
          if (confirmed) {
            this.workDutyservice.changeStatus(userstate).subscribe(
              (data) => {
                this.spinner.hide();
                this.toastr.success(
                  this.translate.instant('workDuty.changeAccountStatus')
                );
                this.getAllUsersData();
              },
              (err) => {
                this.spinner.hide();
                this.toastr.error(err.error.error.message);

              }
            );
          } else {
            user.state = oldVal;
            this.getAllUsersData();
            this.cdr.detectChanges();
          }
        },
        () => {
          user.state = oldVal;
          this.getAllUsersData();
          this.cdr.detectChanges();
        }
      );
  }
  edit(id: any) {
    this.router.navigate(['/agent/departments/work-duty/add-edit-workduty', id])

  }
  view(id: any) {
    this.router.navigate(['/agent/departments/work-duty/view-workDuty', id, 'view'])
  }
  errorDate: boolean = false
  public checkDate(event: any) {

    const startDate = new Date(this.to);
    let endDate = new Date(event.target.value);

    if (endDate.getFullYear() < startDate.getFullYear()) {
      this.errorDate = true

      return;
    } else if (endDate.getFullYear() >= startDate.getFullYear()) {
      if (endDate.getMonth() < startDate.getMonth()) {
        this.errorDate = true

        return;
      } else if (endDate.getMonth() >= startDate.getMonth()) {
        if (endDate.getDate() < startDate.getDate()) {
          this.errorDate = true

          return;
        } else {
          this.errorDate = false
          this.getAllUsersData()
          return;
        }
      }
    } else {
      this.errorDate = false

      this.getAllUsersData()
      return;
    }
  }
}
