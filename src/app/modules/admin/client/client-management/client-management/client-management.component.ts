import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subscription } from 'rxjs';
import { PageInfoService } from 'src/app/_metronic/layout';
import { ConfirmationDialogService } from 'src/app/modules/SharedComponent/SharedComponent/confirmation-dialog/confirmation-dialog.service';
import { ClientState, ClientType } from 'src/app/services/enums/client';
import { ClientService } from 'src/app/services/api/client.service';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';
import { AuthService } from 'src/app/modules/auth';
import { Constants } from 'src/app/services/Constants/constants';
import { PackageManagementService } from 'src/app/services/api/package-management.service';

@Component({
  selector: 'app-client-management',
  templateUrl: './client-management.component.html',
  styleUrls: ['./client-management.component.scss'],
})
export class ClientManagementComponent implements OnInit, OnDestroy {
  clientStatusEnum = ClientState;
  clientTypeEnum = ClientType;
  copied: boolean = false;
  page: number = 1;
  pageSize: number = 10;
  allUsers: any[] = [];
  filterObj = this.initFilterObj();
  totalCount: number;
  lang: string | null = localStorage.getItem('language');
  clientName: string = '';
  clientEmail: string = '';
  clientStatus: string = '';
  clientType: string = '';
  fromSearchInput: boolean = false;
  isShowClients: boolean = false;

  constructor(
    private clientservice: ClientService,
    private cdr: ChangeDetectorRef,
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
  currentUser: any;
  isEmployee: boolean;
  ngOnInit(): void {
    this.spinner.show();
    this.managePackageService.getConditionsForAgent().pipe(finalize(() => { this.spinner.hide() })).subscribe(res => {
      let result = res.data;
      result.forEach((item: any) => {
        if (item.conditionId === 1) {
          this.isShowClients = true;
        }
      });
      if (this.isShowClients) {
        this.breadcrumbService.restoreBreadcrumbsFromStorage();
        this.currentUser = this.authService.getCurrentUser();

        if (this.currentUser.roles[0] == Constants.AllRoles.employee) {
          this.isEmployee = true;
        } else {
          this.isEmployee = false;
        }
        this.getAllUsersData();
      }
      else {
        this.router.navigate(['/agent/error-package'], {
          queryParams: { key: 'Finish' },
        });
      }

    });
  }

  initFilterObj() {
    return {
      Sorting: 'id',
      SkipCount: 0,
      MaxResultCount: this.pageSize,
      Text: this.clientName,
      State: this.clientStatus,
      Type: this.clientType,
    };
  }
  to: any;
  from: any;
  getAllUsersData() {
    if (!this.fromSearchInput) {
      this.spinner.show();
    }
    const startIndex = (this.page - 1) * this.pageSize;
    this.filterObj.SkipCount = startIndex;
    (this.filterObj.Text = this.clientName),
      (this.filterObj.State = this.clientStatus),
      (this.filterObj.Type = this.clientType),
      (this.filterObj.MaxResultCount = this.pageSize);
    this.clientservice.getAllClientList(this.filterObj).subscribe({
      next: (next) => {
        this.allUsers = next.data.items;
        this.totalCount = next.data.totalCount;
        this.spinner.hide();
        this.cdr.detectChanges();
      },
    });
  }

  addNew() {
    this.authService.getcurrentUserApi().subscribe((res) => {
      if (res.data.isExpiredAdding) {
        this.inValid();
      } else
        this.router.navigate(['/agent/departments/clients/add-edit-client']);
    });
  }

  inValid() {
    this.router.navigate(['/agent/error-package'], {
      queryParams: { key: 'Finish' },
    });
  }

  edit(id: any) {
    this.router.navigate(['/agent/departments/clients/add-edit-client', id]);
  }
  view(id: any) {
    this.router.navigate(['/agent/departments/clients/view-client', id]);
  }
  copy(item: any) {
    let type =
      item.type == this.clientTypeEnum.Individual
        ? this.translate.instant('addClient.Individual')
        : this.translate.instant('addClient.business');
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '30';
    selBox.value = `
  ${item.name}
  ${item.mobileNumber}
  ${item.email}
  ${type}
  ${item.commercialName ?? ''}
  ${item.commercialRegistrationNo ?? ''}
  
  `;

    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    this.copied = true;
    setTimeout(() => {
      this.copied = false;
    }, 4000);
    this.toastr.success(this.translate.instant('addClient.copydone'));
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
  changAccountState(user: any) {
    let oldVal = user.state;
    user.state =
      user.state == this.clientStatusEnum.Active
        ? this.clientStatusEnum.NotActive
        : this.clientStatusEnum.Active;

    this.confirmationDialogService
      .confirm(
        this.translate.instant('client.confirmModalTitle'),
        this.translate.instant('client.activeMessage'),
        '',
        false
      )
      .then(
        (confirmed: any) => {
          this.spinner.show();
          let userstate = { id: user.id, state: user.state };
          if (confirmed) {
            this.clientservice.changeStatus(userstate).subscribe(
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
  private unsubscribe: Subscription[] = [];

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
