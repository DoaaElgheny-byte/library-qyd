import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AccountState } from 'src/app/services/enums/account-state.enum';
import { EmailState } from 'src/app/services/enums/email-state.enum';
import { ConfirmationDialogService } from '../../../SharedComponent/SharedComponent/confirmation-dialog/confirmation-dialog.service';
import { EmployeeManagementService } from 'src/app/services/api/employee-management.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize, Subscription } from 'rxjs';
import { BreadcrumbService } from '../../../SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';
import { ViewMoreBranchesComponent } from '../view-more-branches/view-more-branches.component';
import { ConditionType, Payment } from 'src/app/services/enums/payment-conditions.enum';
import { PackageManagementService } from 'src/app/services/api/package-management.service';
import { ViewCreateTeamComponent } from '../view-create-team/view-create-team.component';
import { LookupGuidDto } from 'src/app/modules/auth/models/agent-user.model';
import { CustomerType } from 'src/app/services/enums/contractStatus.enum';

@Component({
  selector: 'app-employee-managment',
  templateUrl: './employee-managment.component.html',
  styleUrls: ['./employee-managment.component.scss'],
})
export class EmployeeManagmentComponent implements OnInit, OnDestroy {
  constructor(
    private cdr: ChangeDetectorRef,
    private _EmployeeManagementService: EmployeeManagementService,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private confirmationDialogService: ConfirmationDialogService,
    private breadcrumbService: BreadcrumbService,
    private managePackageService: PackageManagementService
  ) {
    this.getCondition();
  }

  totalCount: number;
  totalCountForTeam: number;

  Status = '';
  searchText: string = '';
  MobileNumber: string = '';
  page: number = 1;
  pageForTeam: number = 1;
  customerType = CustomerType;

  pageSize: number = 10;
  pageSizeForTeam: number = 10;

  allUsers: any[] = [];
  allTeamEmployees: any[] = [];

  filterObj = this.initFilterObj();
  userAccountState = AccountState;
  theEmailState = EmailState;
  emailStatus = '';
  State = '';
  fromSearchInput: boolean = false;
  BranchId = '';
  branches: any;
  allowAddEdit: boolean;
  EmployeeManagment: any;
  maxEmployees: number;
  residual: number;
  isExpired: boolean;
  isShowEmployees: boolean = false;
  isTeam: boolean = false;
  public lang: string = String(localStorage.getItem('language'));
  servicesForSearch = [] as LookupGuidDto[];
  selectedServiceId: number | null = null;
  isShowEditButtonTeam: boolean;

  ngOnInit(): void {
    this.spinner.show();
    this.managePackageService.getConditionsForAgent().pipe(finalize(() => { this.spinner.hide() })).subscribe(res => {
      let result = res.data;
      this.maxEmployees = res.data[0].maxEmployee;
      result.forEach((item: any) => {
        if (item.conditionId === 2) {
          this.isShowEmployees = true;
        }
      });
      if (this.isShowEmployees) {
        this.breadcrumbService.restoreBreadcrumbsFromStorage();
        this.getAllUsersData();
        this.getBranches();
        this.getTeams();
      }
      else {
        this.router.navigate(['/agent/error-package'], {
          queryParams: { key: 'Finish' },
        });
      }
    });
  }

  getBranches() {
    this._EmployeeManagementService.getBranches().subscribe({
      next: (next) => {
        this.branches = next.data;
      },
    });
  }

  getCondition() {
    let packageCondition = window.localStorage.getItem(
      'condtions-to-current-user'
    );

    let packageData: any = JSON.parse(packageCondition!);
    if (packageData.paymentType == Payment.Expired) {
      this.isExpired = true;
    }

    this.EmployeeManagment = packageData.getConditions.find(
      (i: any) => i.conditionType == ConditionType.EmployeeManagment
    );
  }

  getAllUsersData() {
    if (!this.fromSearchInput) {
      this.spinner.show();
    }
    const startIndex = (this.page - 1) * this.pageSize;
    this.filterObj.SkipCount = startIndex;
    this.filterObj.Text = this.searchText;
    this.filterObj.State = this.State;
    this.filterObj.MobileNumber = this.MobileNumber;
    this.filterObj.EmailState = this.emailStatus;
    this.filterObj.MaxResultCount = this.pageSize;
    this.filterObj.BranchId = this.BranchId;
    this._EmployeeManagementService
      .getAllUsers(this.filterObj)
      .subscribe((res) => {
        this.allUsers = res.data?.items;
        let length = this.allUsers.length;
        this.residual = this.maxEmployees - length;
        this.totalCount = res.data?.totalCount;
        this.spinner.hide();
        this.cdr.detectChanges();
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
      Text: this.searchText,
      Sorting: 'id',
      State: this.State,
      EmailState: this.emailStatus,
      MobileNumber: this.MobileNumber,
      BranchId: this.BranchId,
      SkipCount: 0,
      MaxResultCount: this.pageSize,
    };
  }

  deleteEmployee(id: any) {
    this.confirmationDialogService
      .confirm(this.translate.instant('emplyeeEditAdd.confirmDel'), '')
      .then(
        (confirmed: any) => {
          this.spinner.show();
          if (confirmed) {
            this._EmployeeManagementService.deleteEmployee(id).subscribe({
              next: (next) => {
                this.spinner.hide();
                if (next.success) {
                  this.toastr.success(
                    this.translate.instant('emplyeeEditAdd.activeMessage')
                  );
                  this.getAllUsersData();
                } else {
                  this.toastr.error(next.message);
                }
              },
              error: (error) => {
                this.spinner.hide();
                this.toastr.error(error.error.error.message);

              },
            });
          } else {
            this.getAllUsersData();
            this.cdr.detectChanges();
          }
        },
        () => {
          this.getAllUsersData();
          this.cdr.detectChanges();
        }
      );
  }

  // theAccountState
  changAccountState(player: any) {
    let oldVal = player.state;
    player.state =
      player.state == AccountState.Active
        ? AccountState.Inactive
        : AccountState.Active;

    this.confirmationDialogService
      .confirm(
        this.translate.instant('userManagement.confirmModalTitle'),
        this.translate.instant('userManagement.activeMessage'),
        '',
        false
      )
      .then(
        (confirmed: any) => {
          this.spinner.show();
          let userstate = { id: player.id, state: player.state };
          if (confirmed) {
            this._EmployeeManagementService.changeStatus(userstate).subscribe(
              (data) => {
                this.spinner.hide();
                this.toastr.success(
                  this.translate.instant('userManagement.changeAccountStatus')
                );
                this.getAllUsersData();
              },
              (err) => {
                this.spinner.hide();
                this.toastr.error(err.error.error.message);

              }
            );
          } else {
            player.state = oldVal;
            this.getAllUsersData();
            this.cdr.detectChanges();
          }
        },
        () => {
          player.state = oldVal;
          this.getAllUsersData();
          this.cdr.detectChanges();
        }
      );
  }

  getDetails(id: any) {

    this.router.navigate([
      '/agent/departments/employee-managment/view-employee',
      id,
    ]);
  }

  edit(id: any) {

    this.router.navigate([
      '/agent/departments/employee-managment/add-edit-employee',
      id,
    ]);
  }

  private modalService = inject(NgbModal);

  addNew() {

    this.router.navigate([
      '/agent/departments/employee-managment/add-edit-employee',
    ]);
  }

  viewMore(branches: any) {
    const modalRef = this.modalService.open(ViewMoreBranchesComponent, {
      size: 'sm',
      backdrop: 'static',
      centered: true,
    });
    modalRef.componentInstance.data = branches;
  }

  createTeam() {
    const modalRef = this.modalService.open(ViewCreateTeamComponent, {
      size: 'sm',
      backdrop: 'static',
      centered: true,
    });

    modalRef.result.then(
      (result) => {
        this.getTeams();
        this.spinner.hide();
      },
      (reason) => {
      }
    );
  }

  editTeam() {
    const modalRef = this.modalService.open(ViewCreateTeamComponent, {
      size: 'sm',
      backdrop: 'static',
      centered: true,
    });
    modalRef.componentInstance.teamId = this.selectedServiceId;
    modalRef.result.then(
      (result) => {
        this.getEmployeesTeam(this.selectedServiceId)
        this.getTeams();
        this.spinner.hide();
      },
      (reason) => {
      }
    );
  }

  teamOrIndividual(type: boolean) {
    this.isTeam = type;

    if (this.isTeam) {
      this.allTeamEmployees = [];
      this.totalCountForTeam = 0;
      this.selectedServiceId = null
      this.getTeams();
    }
    else {
      this.isShowEditButtonTeam = false
      this.selectedServiceId = null
    }
  }

  getTeams() {
    this._EmployeeManagementService.getTeamLookups().subscribe((res) => {
      this.servicesForSearch = res.data;
    })
  }

  onServiceChange() {
    this.spinner.show();

    if (this.selectedServiceId == null) {
      this.allTeamEmployees = [];
      this.totalCountForTeam = 0;
      this.spinner.hide();
    }
    else {
      this.isShowEditButtonTeam = true
      this.getEmployeesTeam(this.selectedServiceId);
    }
  }

  getEmployeesTeam(id: any) {
    if (this.selectedServiceId != null) {
      this._EmployeeManagementService.getEmployeeTeamById(id).pipe(finalize(() => {
        this.spinner.hide();
      })).subscribe((res) => {
        this.allTeamEmployees = res.data.items;
        this.totalCountForTeam = res.data?.totalCount;
        this.cdr.detectChanges();
      })
    }
  }

  deleteEmployeeFromTeam(id: any) {
    this.spinner.show();
    if (id != null) {
      this._EmployeeManagementService.deleteEmployeeFromTeam(id, this.selectedServiceId).subscribe(res => {
        this.toastr.success(
          this.translate.instant('emplyeeEditAdd.activeMessage')
        );
        this.getEmployeesTeam(this.selectedServiceId);
        this.cdr.detectChanges();
      })
    }
  }

  private unsubscribe: Subscription[] = [];

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
