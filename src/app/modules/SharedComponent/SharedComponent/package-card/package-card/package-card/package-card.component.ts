import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';
import { AppConfirmService } from 'src/app/modules/SharedComponent/SharedComponent/app-confirm/app-confirm.service';
import { UpgradePackageService } from 'src/app/services/api/upgrade-package.sevice';
import { ConditionType, DurationFreeTrialPackage, DurationPackage, packageStatus, StorageSizeType } from 'src/app/services/enums/upgrade-package.enum';

@Component({
  selector: 'app-package-card',
  templateUrl: './package-card.component.html',
  styleUrls: ['./package-card.component.scss'],
})
export class PackageCardComponent implements OnInit {
  lang: string = String(localStorage.getItem('language'));
  @Input() data: any;
  @Input() isExpiration: boolean;
  @Input() isFromHomePage: boolean;
  @Input() isAuth: boolean = true;
  @Input() custom: boolean = false;
  @Input() isActive: boolean = false; // Receive active state from parent
  @Output() cardClicked = new EventEmitter<void>(); // Notify parent when card is clicked
  @Input() removeSubBtn: boolean = true;
  @Input() fromHomePage: boolean = false;

  @Output() countOfUsers: EventEmitter<number> = new EventEmitter<number>();

  DurationPackage = DurationPackage;
  DurationFreeTrialPackage = DurationFreeTrialPackage;
  storageSize = StorageSizeType;


  conditionType = ConditionType;
  packageStatus = packageStatus;

  conditionList: any[] = [];
  macAddress: string;
  currentUser: any;
  userCount: number = 1;
  clonePrice: number = 0;
  cloneValueAddedTax: number = 0;
  cloneTotalCost: number = 0;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private appConfirmService: AppConfirmService,
    private authService: AuthService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.initializeConditions();
    console.log(this.fromHomePage);
    localStorage.removeItem('userCount');
    debugger
    if (this.data.durationPackage == DurationPackage.Month) {
      this.cloneTotalCost = this.data.totalCost;
      //this.cloneValueAddedTax = this.data.valueAddedTax;
    }
    else {
      this.cloneTotalCost = ((this.data.totalCost) / 12);
      //this.cloneValueAddedTax = (this.data.valueAddedTax / 12);
    }
  }

  openCalendlyPopup(): void {
    debugger
    const calendlyUrl =
      this.isFromHomePage ? this.createCalendlyUrlForCurrentUser()
        : 'https://calendly.com/salesqyd/30min';

    window.open(calendlyUrl, '_blank');
  }

  private createCalendlyUrlForCurrentUser(): string {
    debugger
    this.currentUser = this.authService.getCurrentUser();
    // this.authService.getDataOfCurrentUser(this.currentUser.email).subscribe((res) => {
    //   const { name, email } = res.data;

    // });
    const calendlyUrl = `https://calendly.com/salesqyd/30min?name=${this.currentUser.userName}&email=${this.currentUser.email}`;
    // window.open(calendlyUrl, '_blank');
    return calendlyUrl; // Returning empty string to avoid undefined usage
  }

  private initializeConditions(): void {
    this.conditionList = this.getConditionsList();
    // this.addEmployeeManagementCondition();
    this.sortConditionsByCheckedStatus();
  }

  private getConditionsList(): any[] {

    let list = Object.keys(this.conditionType)
      .filter((key) => !isNaN(Number(this.conditionType[key as keyof typeof this.conditionType])))
      .map((key) => ({
        id: Number(this.conditionType[key as keyof typeof this.conditionType]),
        name: key,
        isChecked: this.isChecked({ id: Number(this.conditionType[key as keyof typeof this.conditionType]), name: key }),
      }));
    return list;

  }

  private sortConditionsByCheckedStatus(): void {
    this.conditionList.sort((a: any, b: any) => {
      if (a.isChecked && !b.isChecked) return -1;
      if (!a.isChecked && b.isChecked) return 1;
      return 0;
    });
  }

  private isChecked(item: { id: number | null; name: string }): boolean {

    if (item.name === 'menu.employeeManagement') {
      return this.data.maxEmployeeNo !== 0;
    }
    if (item.id === this.conditionType['upgradePackage.BranchManagement']) {
      return this.data.maxBranchNo !== 0 && !this.data.isMain;
    }
    // this.data.packageCondations
    return this.data.packageCondations?.some((e: any) => e.conditionType === item.id) || false;
  }

  choosePackage(): void {
    if (this.data.durationFreeTrialPackage == DurationFreeTrialPackage.Always) {
      this.authService.checkPackageSelectedValid(this.data.id).pipe(finalize(() => {
        this.spinner.hide();
      })).subscribe({
        next: (next) => {
          debugger
          if (next.data == packageStatus.CanDownGridpackage) {
            localStorage.setItem('showBuyPackageWithOutPaid', 'true')
          } else localStorage.setItem('showBuyPackageWithOutPaid', 'false')
          if (next.data == packageStatus.CanNotBuyThisPackageBecauseLimit) {
            if (this.isBranchOrEmployeeLimitExceeded()) {
              this.appConfirmService.confirm(
                this.translate.instant('upgradePackage.branchEmployee'),
                '',
                '/assets/imgs/qyd/attention.svg',
                false
              );
            } else {
              this.router.navigate(['/agent/upgrade-package/invoice-details', this.data.id
              ]);
            }
          }
          else {
            if (this.isBranchOrEmployeeLimitExceeded()) {
              this.appConfirmService.confirm(
                this.translate.instant('upgradePackage.branchEmployee'),
                '',
                '/assets/imgs/qyd/attention.svg',
                false
              );
            } else {
              this.router.navigate(['/agent/upgrade-package/invoice-details', this.data.id
              ]);
            }
          }
        }
      })
    }
    else {
      if (this.isBranchOrEmployeeLimitExceeded()) {
        this.appConfirmService.confirm(
          this.translate.instant('upgradePackage.branchEmployee'),
          '',
          '/assets/imgs/qyd/attention.svg',
          false
        );
      } else {
        this.router.navigate(['/agent/upgrade-package/invoice-details', this.data.id
        ]);
      }
    }
  }

  private isBranchOrEmployeeLimitExceeded(): boolean {
    return this.data.currentBranchNo > this.data.maxBranchNo || this.data.currentEmployeeNo > this.data.maxCustomerNo;
  }

  register(): void {
    this.router.navigate(['/auth/register']);
  }

  onCardClick(): void {
    this.cardClicked.emit();
  }

  increase() {
    if (this.userCount < this.data.maxCustomerNo) {
      this.userCount++;
      this.clonePrice = (this.data.price * this.userCount);
      let rate = (this.clonePrice * (this.data.disCountRate / 100));
      this.cloneTotalCost = (this.clonePrice) - (rate);
      this.cloneValueAddedTax = (this.data.valueAddedTax * this.userCount);
      localStorage.removeItem('userCount');
      localStorage.setItem('userCount', this.userCount.toString());
      this.countOfUsers.emit(this.userCount);
    }
  }

  decrease() {
    if (this.userCount > 1) {
      this.userCount--;
      this.clonePrice = (this.data.price * this.userCount);
      let rate = (this.clonePrice * (this.data.disCountRate / 100));
      this.cloneTotalCost = (this.clonePrice) - (rate);
      this.cloneValueAddedTax = (this.data.valueAddedTax * this.userCount);
      localStorage.removeItem('userCount');
      localStorage.setItem('userCount', this.userCount.toString());
      this.countOfUsers.emit(this.userCount);
    }
  }
}
