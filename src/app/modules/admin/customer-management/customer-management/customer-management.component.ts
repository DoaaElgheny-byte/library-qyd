import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccountState } from 'src/app/services/enums/account-state.enum';
import { EmailState } from 'src/app/services/enums/email-state.enum';
import { EmployeeManagementService } from 'src/app/services/api/employee-management.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize, Subscription } from 'rxjs';
import { ConditionType, Payment } from 'src/app/services/enums/payment-conditions.enum';
import { LookupGuidDto } from 'src/app/modules/auth/models/agent-user.model';
import { CustomerType } from 'src/app/services/enums/contractStatus.enum';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationDialogService } from 'src/app/modules/SharedComponent/SharedComponent/confirmation-dialog/confirmation-dialog.service';
import { AuthService } from 'src/app/modules/auth';
@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.scss'],
})
export class CustomerManagementComponent implements OnInit, OnDestroy {

  totalCount: number;
  totalCountForTeam: number;
  Status = '';
  searchText: string = '';
  MobileNumber: string = '';
  page: number = 1;
  pageForTeam: number = 1;
  pageSize: number = 10;
  pageSizeForTeam: number = 10;
  allUsers: any[] = [];
  allTeamEmployees: any[] = [];
  filterObj = this.initFilterObj();
  userAccountState = AccountState;
  customerType = CustomerType;
  theEmailState = EmailState;
  emailStatus = '';
  State = '';
  fromSearchInput: boolean = false;
  BranchId = '';
  branches: any;
  allowAddEdit: boolean;
  EmployeeManagment: any;
  maxCustomers: number;
  residual: number;
  isExpired: boolean;
  isShowEmployees: boolean = false;
  isTeam: boolean = false;
  public lang: string = String(localStorage.getItem('language'));
  servicesForSearch = [] as LookupGuidDto[];
  selectedServiceId: number | null = null;
  isShowEditButtonTeam: boolean;
  maxEmployees: number;
  currentUser: any;

  constructor(
    private _EmployeeManagementService: EmployeeManagementService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private toastr: ToastrService,
    private confirmationDialogService: ConfirmationDialogService,
    private authService: AuthService,

  ) {
    this.getCondition();
  }

  ngOnInit(): void {
    this.spinner.show();
    this.getAllCustomersData();
    this.authService.listen();
    this.currentUser = this.authService.getCurrentUser();
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

  getAllCustomersData() {
    this.spinner.show();
    const startIndex = (this.page - 1) * this.pageSize;
    this.filterObj.SkipCount = startIndex;
    this.filterObj.Text = this.searchText;
    this.filterObj.State = this.State;
    this.filterObj.MobileNumber = this.MobileNumber;
    this.filterObj.EmailState = this.emailStatus;
    this.filterObj.MaxResultCount = this.pageSize;
    this._EmployeeManagementService
      .getAllUsers(this.filterObj).pipe(finalize(() => {
        this.spinner.hide();
      }))
      .subscribe((res) => {
        this.allUsers = res.data?.items;
        console.log(this.allUsers);
        let length = this.allUsers.length;
        this.maxEmployees = this.allUsers[0]?.countOfCustomers ?? 0;
        this.residual = this.maxEmployees - length;
        this.totalCount = res.data?.totalCount ?? 0;
        this.cdr.detectChanges();
      });
  }

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
                this.getAllCustomersData();
              },
              (err) => {
                this.spinner.hide();
                this.toastr.error(err.error.error.message);

              }
            );
          } else {
            player.state = oldVal;
            this.getAllCustomersData();
            this.cdr.detectChanges();
          }
        },
        () => {
          player.state = oldVal;
          this.getAllCustomersData();
          this.cdr.detectChanges();
        }
      );
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
      SkipCount: 0,
      MaxResultCount: this.pageSize,
    };
  }

  getDetails(id: any) {
    this.router.navigate([
      '/agent/departments/customer-management/view-customer',
      id,
    ]);
  }

  edit(id: any) {
    debugger
    this.router.navigate([
      '/agent/departments/customer-management/add-edit-customer',
      id,
    ]);
  }

  inValid() {
    this.router.navigate(['/agent/error-package'], {
      queryParams: { key: 'Finish' },
    });
  }

  addNew() {
    debugger
    this.authService.getcurrentUserApi().subscribe((res) => {
      if (res.data.isExpiredAdding) {
        this.inValid();
      } else {
        this.router.navigate([
          '/agent/departments/customer-management/add-edit-customer',
        ]);
      }
    });
  }

  private unsubscribe: Subscription[] = [];

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
