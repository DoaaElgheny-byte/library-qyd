import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';
import { ConfirmationDialogService } from 'src/app/modules/SharedComponent/SharedComponent/confirmation-dialog/confirmation-dialog.service';
import { AuthService } from 'src/app/modules/auth';
import { Constants } from 'src/app/services/Constants/constants';
import { AttornyService } from 'src/app/services/api/attorny.service';
import { BranchesService } from 'src/app/services/api/branches.service';
import { ClientService } from 'src/app/services/api/client.service';
import { PackageManagementService } from 'src/app/services/api/package-management.service';
import {
  AttornyState,
  AttornyStatus,
} from 'src/app/services/enums/attorny.enum';

@Component({
  selector: 'app-attornt-managment',
  templateUrl: './attornt-managment.component.html',
  styleUrls: ['./attornt-managment.component.scss'],
})
export class AttorntManagmentComponent implements OnInit {
  attornyStatus = AttornyStatus;
  attornyState = AttornyState;
  searchText: string = '';
  State: string = '';
  EndDate: string;
  StartDate: string;
  agencyNo = '';
  BranchId = '';
  ClientId = '';
  page: number = 1;
  pageSize: number = 10;
  allUsers: any[] = [];
  filterObj = this.initFilterObj();
  totalCount: number;
  fromSearchInput: boolean = false;
  currentUser: any;
  isEmployee: boolean = false;
  isManager: boolean = false;
  isAgent: boolean = false;
  clientList: any;
  branches: any;
  Employeebranches: any;
  activeBranches: any;
  IsDraft: any = '';
  isShowAttorny: boolean = false;

  constructor(
    private attornyservice: AttornyService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private breadcrumbService: BreadcrumbService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router,
    private authService: AuthService,
    private _clientService: ClientService,
    private _branchManagementService: BranchesService,
    private managePackageService: PackageManagementService

  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.managePackageService.getConditionsForAgent().pipe(finalize(() => { this.spinner.hide() })).subscribe(res => {
      let result = res.data;
      result.forEach((item: any) => {
        if (item.conditionId === 7) {
          this.isShowAttorny = true;
        }
      });
      if (this.isShowAttorny) {
        this.currentUser = this.authService.getCurrentUser();
        this.getBranchList();
        if (this.currentUser.roles[0] == Constants.AllRoles.employee) {
          this.isEmployee = true;
          this.getEmployeeBranches();
        } else if (this.currentUser.roles[0] == Constants.AllRoles.qYDManager) {
          this.isManager = true;
          this.getEmployeeBranches();
        } else {
          this.isAgent = true;
        }
        this.getAllUsersData();
        this.breadcrumbService.restoreBreadcrumbsFromStorage();
      } else {
        this.router.navigate(['/agent/error-package'], {
          queryParams: { key: 'Finish' },
        });
      }
    });
  }

  getEmployeeBranches() {
    this._branchManagementService.activeBranches().subscribe({
      next: (next) => {
        this.Employeebranches = next.data;
        this.cdr.detectChanges();

        this.activeBranches = this.Employeebranches.find(
          (x: any) => x.isActive === true
        ).id;

        this.getClientList(this.activeBranches);
        this.cdr.detectChanges();
      },
    });
  }
  getBranchList() {
    this._branchManagementService.getAllBranchesList().subscribe({
      next: (next) => {
        this.branches = next.data;
        this.cdr.detectChanges();
      },
    });
  }
  //get client list
  getClientList(e?: any) {
    this._clientService.getClientListByBranch(e).subscribe({
      next: (next) => {
        this.spinner.hide();
        this.clientList = next.data;
        this.cdr.detectChanges();
      },
    });
  }
  keyPressNumbers(event: any) {
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
  initFilterObj() {
    return {
      Address: this.searchText,
      Number: this.agencyNo,
      BranchId: this.BranchId,
      ClientId: this.ClientId,
      Sorting: 'id',
      AgencyStatus: this.State,
      StartDate: this.EndDate,
      EndDate: this.EndDate,
      SkipCount: 0,
      MaxResultCount: this.pageSize,
      IsDraft: this.IsDraft
    };
  }
  to: any;
  from: any;
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
      const date: NgbDate = new NgbDate(myDate.year, myDate.month, myDate.day);
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
        if (this.State == (this.attornyState.All).toString()) {
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
    this.filterObj.Address = this.searchText;
    this.filterObj.Number = this.agencyNo;
    this.filterObj.BranchId = this.BranchId;
    this.filterObj.ClientId = this.ClientId;
    this.filterObj.AgencyStatus = this.State;
    this.filterObj.StartDate = this.to;
    this.filterObj.EndDate = this.from;
    this.filterObj.MaxResultCount = this.pageSize;
    this.attornyservice.getAllagencyList(this.filterObj).subscribe({
      next: (next) => {
        if (next.success) {
          this.allUsers = next.data.items;
          console.log(next.data.items)
          this.totalCount = next.data.totalCount;
          this.spinner.hide();
          this.cdr.detectChanges();
        } else {
          this.spinner.hide();
          this.toastr.error(next.message);
        }
      },
      error: (error) => {
        this.spinner.hide();
        this.toastr.error(error);
      },
    });
  }
  changAccountState(user: any) {
    let oldVal = user.state;
    user.state =
      user.state == this.attornyState.Active
        ? this.attornyState.Inactive
        : this.attornyState.Active;

    this.confirmationDialogService
      .confirm(
        this.translate.instant('attorny.confirmModalTitle'),
        this.translate.instant('attorny.activeMessage'),
        '',
        false
      )
      .then(
        (confirmed: any) => {
          this.spinner.show();
          let userstate = { id: user.id, state: user.state };
          if (confirmed) {
            this.attornyservice.changeStatus(userstate).subscribe(
              (data) => {
                this.spinner.hide();
                this.toastr.success(
                  this.translate.instant('attorny.changeAccountStatus')
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
  view(id: any) {
    this.router.navigate(['/agent/departments/attorny/review-attorny', id]);
  }
  assigned(id: any) {
    this.router.navigate(['/agent/departments/attorny/assigned-attorny', id]);
  }

  inValid() {
    this.router.navigate(['/agent/error-package'], {
      queryParams: { key: 'Finish' },
    });
  }

  addEdit(id?: any) {
    this.authService.getcurrentUserApi().subscribe((res) => {
      if (res.data.isExpiredAdding) {
        this.inValid();
      } else {
        if (!id) {
          localStorage.setItem('step', '');

          this.router.navigate(['/agent/departments/attorny/add-edit-attorny/']);
        } else {
          localStorage.setItem('step', '');

          this.router.navigate(['/agent/departments/attorny/add-edit-attorny', id]);
        }
      }
    });
  }
}
