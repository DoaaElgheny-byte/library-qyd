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
import { ContractService } from 'src/app/services/api/contract.service';
import { PackageManagementService } from 'src/app/services/api/package-management.service';
import {
  ContractState,
  ContractStatus,
} from 'src/app/services/enums/contractStatus.enum';

@Component({
  selector: 'app-contract-management',
  templateUrl: './contract-management.component.html',
  styleUrls: ['./contract-management.component.scss'],
})
export class ContractManagementComponent implements OnInit {
  contractStatus = ContractStatus;
  contractState = ContractState;
  searchText: string = '';
  State: string = '';
  EndDate: string;
  StartDate: string;
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
  isShowContracts: boolean = false;

  BranchId = '';
  branches: any;
  IsDraft: any = '';
  constructor(
    private contractservice: ContractService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private breadcrumbService: BreadcrumbService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router,
    private authService: AuthService,
    private _branchManagementService: BranchesService,
    private managePackageService: PackageManagementService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.managePackageService.getConditionsForAgent().pipe(finalize(() => { this.spinner.hide() })).subscribe(res => {
      let result = res.data;
      result.forEach((item: any) => {
        if (item.conditionId === 3) {
          this.isShowContracts = true;
        }
      });
      if (this.isShowContracts) {
        this.getBranches();
        debugger
        this.currentUser = this.authService.getCurrentUser();

        if (this.currentUser.roles[0] == Constants.AllRoles.employee) {

          this.isEmployee = true;
        } else if (this.currentUser.roles[0] == Constants.AllRoles.qYDManager) {
          this.isManager = true
        } else {

          this.isAgent = true
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
  getBranches() {
    this._branchManagementService.getAllBranchesList().subscribe({
      next: next => {
        this.branches = next.data
      }
    })
  }

  initFilterObj() {
    return {
      Address: this.searchText,
      Sorting: 'id',
      ContarctStatus: this.State,
      StartDate: this.EndDate,
      EndDate: this.EndDate,
      BranchId: this.BranchId,
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
        if (this.State == (this.contractState.All).toString()) {
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
    this.filterObj.ContarctStatus = this.State;
    this.filterObj.StartDate = this.to;
    this.filterObj.EndDate = this.from;
    this.filterObj.BranchId = this.BranchId;
    this.filterObj.MaxResultCount = this.pageSize;
    this.contractservice.getAllContractList(this.filterObj).subscribe({
      next: (next) => {
        if (next.success) {
          this.allUsers = next.data.items;
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

  addNew() { }
  changAccountState(user: any) {
    let oldVal = user.state;
    user.state =
      user.state == this.contractState.Active
        ? this.contractState.Inactive
        : this.contractState.Active;

    this.confirmationDialogService
      .confirm(
        this.translate.instant('contract.confirmModalTitle'),
        this.translate.instant('contract.activeMessage'),
        '',
        false
      )
      .then(
        (confirmed: any) => {
          this.spinner.show();
          let userstate = { id: user.id, state: user.state };
          if (confirmed) {
            this.contractservice.changeStatus(userstate).subscribe(
              (data) => {
                this.spinner.hide();
                this.toastr.success(
                  this.translate.instant('contract.changeAccountStatus')
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
    this.router.navigate(['/agent/departments/contracts/view-contract', id]);
  }
  assigned(id: any) {
    this.router.navigate(['/agent/departments/contracts/assigned-contract', id])
  }

  inValid() {
    this.router.navigate(['/agent/error-package'], {
      queryParams: { key: 'Finish' },
    });
  }

  addEdit(id: any) {
    this.authService.getcurrentUserApi().subscribe((res) => {
      if (res.data.isExpiredAdding) {
        this.inValid();
      } else {
        if (id === 0) {
          this.router.navigate(['/agent/departments/contracts/add-edit-contract']);

        } else {
          this.router.navigate(['/agent/departments/contracts/add-edit-contract', id]);
        }
      }
    });
  }
}
