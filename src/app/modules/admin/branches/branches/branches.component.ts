import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';
import { ConfirmationDialogService } from 'src/app/modules/SharedComponent/SharedComponent/confirmation-dialog/confirmation-dialog.service';
import { AuthService } from 'src/app/modules/auth';
import { Constants } from 'src/app/services/Constants/constants';
import { BranchesService } from 'src/app/services/api/branches.service';
import { PackageManagementService } from 'src/app/services/api/package-management.service';
import { AccountState } from 'src/app/services/enums/account-state.enum';
import { BranchStatus } from 'src/app/services/enums/branches-state.enum';
import { ConditionType } from 'src/app/services/enums/payment-conditions.enum';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.scss']
})
export class BranchesComponent implements OnInit {
  constructor(
    private cdr: ChangeDetectorRef,
    private _BranchesManagementService: BranchesService,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private toastr: ToastrService,
    private breadcrumbService: BreadcrumbService,
    private confirmationDialogService: ConfirmationDialogService,
    private managePackageService: PackageManagementService,
    private router: Router
  ) {

    let user = this.authService.getCurrentUser()
    console.log("user", user);

    if (user.roles[0] === Constants.AllRoles.qydAgent) {
      // this.router.navigate(['/agent/error-package'], {
      //   queryParams: { key: 'inValid' },
      // });
      this.isAuth = true
    }
    else {
      this.isAuth = false
    }
    this.getCondition()
  }

  totalCount: number;
  Status = '';
  EmployeeManagerId = ''
  searchText: string = '';
  MobileNumber: string = '';
  page: number = 1;
  pageSize: number = 10;
  allBranches: any[] = [];
  filterObj = this.initFilterObj();
  userAccountState = BranchStatus;
  emailStatus = '';
  State = '';
  branchManagment: any
  fromSearchInput: boolean = false;
  isShowBranches: boolean = false;
  maxBranches: number;
  residual: number;

  managers: any
  isAuth: boolean
  ngOnInit(): void {

    this.spinner.show();
    this.managePackageService.getConditionsForAgent().pipe(finalize(() => { this.spinner.hide() })).subscribe(res => {
      let result = res.data;
      this.maxBranches = res.data[0].maxBranches;
      result.forEach((item: any) => {
        if (item.conditionId === 5) {
          this.isShowBranches = true;
        }
      });
      if (this.isShowBranches) {
        this.breadcrumbService.restoreBreadcrumbsFromStorage();
        this.getBranchManagers()
        this.getallBranchesData();
      }
      else {
        this.router.navigate(['/agent/error-package'], {
          queryParams: { key: 'Finish' },
        });
      }
    });
  }
  getCondition() {
    let packageCondition = window.localStorage.getItem(
      'condtions-to-current-user'
    );

    let packageData: any = JSON.parse(packageCondition!);
    this.branchManagment = packageData.getConditions.find(
      (i: any) => i.conditionType == ConditionType.BranchManagment
    );
  }
  getBranchManagers() {
    this._BranchesManagementService.getManager().subscribe({
      next: next => {
        this.managers = next.data
        this.cdr.detectChanges()
      }
    })
  }
  getallBranchesData() {
    if (!this.fromSearchInput) {
      this.spinner.show();
    }
    const startIndex = (this.page - 1) * this.pageSize;
    this.filterObj.SkipCount = startIndex;
    this.filterObj.Name = this.searchText;
    this.filterObj.BranchStatus = this.State;
    this.filterObj.MaxResultCount = this.pageSize;
    this.filterObj.EmployeeManagerId = this.EmployeeManagerId
    this._BranchesManagementService.getAllBranches(this.filterObj)
      .subscribe({
        next: next => {
          this.allBranches = next.data.items;
          let length = this.allBranches.length;
          this.residual = this.maxBranches - length;
          this.totalCount = next.data.totalCount;
          this.spinner.hide();
          this.cdr.detectChanges();
        }, error: error => {
          this.spinner.hide();
        }

      })
  }
  initFilterObj() {
    return {
      Name: this.searchText,
      Sorting: 'id',
      BranchStatus: this.State,
      SkipCount: 0,
      MaxResultCount: this.pageSize,
      EmployeeManagerId: this.EmployeeManagerId
    };
  }
  deleteEmployee(id: any) {

    this.confirmationDialogService
      .confirm(
        this.translate.instant('branchEditAdd.confirmDel'),
        '',
        '',
        true

      )
      .then((confirmed: any) => {
        this.spinner.show();
        if (confirmed) {
          this._BranchesManagementService.deleteBranches(id).subscribe({
            next: next => {
              this.spinner.hide();
              if (next.success) {
                this.toastr.success(this.translate.instant('branchEditAdd.activeMessage'))
                this.getallBranchesData();
              } else {
                this.toastr.error(next.message);
              }

            }, error: error => {
              this.spinner.hide();
              this.toastr.error(error.error.error.message);

            }
          })

        } else {
          this.getallBranchesData();
          this.cdr.detectChanges();
        }
      }, () => {
        this.getallBranchesData();
        this.cdr.detectChanges();
      })
  }
  // theAccountState
  changAccountState(player: any) {
    let oldVal = player.branchStatus;
    player.branchStatus =
      player.branchStatus == AccountState.Active
        ? AccountState.Inactive
        : AccountState.Active;

    this.confirmationDialogService
      .confirm(
        this.translate.instant('branches.confirmModalTitle'),
        this.translate.instant('branches.activeMessage'),
        '',
        false
      )
      .then((confirmed: any) => {
        this.spinner.show();
        let userstate = { id: player.id, branchStatus: player.branchStatus };
        if (confirmed) {
          this._BranchesManagementService.changeStatus(userstate).subscribe({
            next: next => {
              if (next.success) {
                this.spinner.hide();
                this.toastr.success(
                  this.translate.instant('branches.changeAccountStatus')
                );
                this.getallBranchesData();
              } else {
                this.spinner.hide();
                this.toastr.error(
                  this.translate.instant(next.message)
                );
                this.getallBranchesData();

              }

            }, error: error => {
              this.spinner.hide();
              this.toastr.error(error.error.error.message);

            }

          });
        } else {
          this.getallBranchesData();
          this.cdr.detectChanges();
        }
      }, () => {
        player.state = oldVal;
        this.getallBranchesData();
        this.cdr.detectChanges();
      })
  }
  view(id: any) {

    this.router.navigate(['/agent/departments/branches/view-branch', id])

  }
  edit(id: any) {

    this.router.navigate(['/agent/departments/branches/add-edit-branch', id])

  }

  private modalService = inject(NgbModal);

  addNew() {

    this.router.navigate(['/agent/departments/branches/add-edit-branch'])

  }
}

