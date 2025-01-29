import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/modules/auth';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';
import { UpgradePackageService } from 'src/app/services/api/upgrade-package.sevice';
import { Constants } from 'src/app/services/Constants/constants';
import { DurationPackage } from 'src/app/services/enums/package.enum';
import { Payment } from 'src/app/services/enums/payment-conditions.enum';

@Component({
  selector: 'app-upgrade-package',
  templateUrl: './upgrade-package.component.html',
  styleUrls: ['./upgrade-package.component.scss']
})
export class UpgradePackageComponent implements OnInit {
  accuntTypes: { [key: string]: boolean } = {
    all: true,
    LawyerOffice: false,
    RegularRepresentative: false,
    Advisor: false,
  };
  LawyerOffice: any = ''
  RegularRepresentative: any = ''
  Advisor: any = ''
  totalCount: number;
  page: number = 1;
  pageSize: number = 10;
  filterObj = this.initFilterObj();
  packages: any;
  packagesClone: any;
  conditions: any;
  isExpiration: boolean = false
  isFromHomePage: boolean = true;
  currentUser: any;
  isEmployee: any;
  selectedPackageType: boolean = true;
  activeDivIndex: number | null = null;

  constructor(private breadcrumbService: BreadcrumbService,
    private _upgragePackagesService: UpgradePackageService,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.breadcrumbService.restoreBreadcrumbsFromStorage();
    this.currentUser = this.authService.getCurrentUser();
    if ((this.currentUser.roles[0] == Constants.AllRoles.employee) ||
      (this.currentUser.roles[0] == Constants.AllRoles.qYDManager)
    ) {
      this.isEmployee = true;
    } else {
      this.isEmployee = false;
    }
    this.spinner.show();
    const statusOfToggle = localStorage.getItem('statusOfToggleInUpgardePackage');
    if (statusOfToggle === null) {
      this.selectedPackageType = true;
    } else {
      this.selectedPackageType = JSON.parse(statusOfToggle);
    }
    this.getAllPackages()
    let packageCondition = window.localStorage.getItem(
      'condtions-to-current-user'
    );

    let packageData: any = JSON.parse(packageCondition!);
    if (packageData?.paymentType == Payment.Expired) {
      this.isExpiration = true
    }
  }
  openCalendlyPopup() {
    this.currentUser = this.authService.getCurrentUser();
    const name = this.currentUser.userName;
    const email = this.currentUser.email;
    const MobileNumber = encodeURIComponent("+20122518653");

    const calendlyUrl = `https://calendly.com/salesqyd/30min?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&Mobile=${encodeURIComponent(MobileNumber)}`;

    window.open(calendlyUrl, '_blank');

  }

  selectAccountType(e: any, checkboxName: string) {
    this.accuntTypes[checkboxName] = (e.target as HTMLInputElement).checked;
    const isChecked = (e.target as HTMLInputElement).checked;
    if (checkboxName === 'all') {
      if (isChecked) {
        this.accuntTypes.LawyerOffice = false;
        this.accuntTypes.RegularRepresentative = false;
        this.accuntTypes.Advisor = false;
        this.LawyerOffice = this.RegularRepresentative = this.Advisor = ''

      }
    } else {
      if (isChecked) {
        this.accuntTypes.all = false;
        this.accuntTypes[checkboxName] = isChecked;
        this.LawyerOffice = this.accuntTypes['LawyerOffice']
        this.RegularRepresentative = this.accuntTypes['RegularRepresentative']
        this.Advisor = this.accuntTypes['Advisor']

      } else {
        if (!this.accuntTypes['LawyerOffice'] && !this.accuntTypes['RegularRepresentative'] && !this.accuntTypes['Advisor']) {
          this.accuntTypes['all'] = true;
          this.LawyerOffice = this.RegularRepresentative = this.Advisor = ''

        } else {

          this.LawyerOffice = this.accuntTypes['LawyerOffice']
          this.RegularRepresentative = this.accuntTypes['RegularRepresentative']
          this.Advisor = this.accuntTypes['Advisor']
        }
      }

    }
    this.getAllPackages()
  }

  getAllPackages() {
    const startIndex = (this.page - 1) * this.pageSize;
    this.filterObj.SkipCount = startIndex;
    this.filterObj.Advisor = this.Advisor;
    this.filterObj.LawyerOffice = this.LawyerOffice;
    this.filterObj.RegularRepresentative = this.RegularRepresentative;
    this.filterObj.filterType = this.selectedPackageType;

    this._upgragePackagesService.getAllPackages(this.filterObj).subscribe({
      next: next => {
        this.packages = next.data.items;
        console.log(this.packages)
        this.packages.push({
          "customPackage": true,
          "name": "الباقة المخصصة",
          "packageConditions": [

            {
              "condationId": 471,
              "condation": "اداره العملاء",
              "value": 0,
              "conditionValue": 0,
              "conditionType": 1
            },
            {
              "condationId": 472,
              "condation": "اداره الموظفين",
              "value": 9,
              "conditionValue": 1,
              "conditionType": 2
            },
            {
              "condationId": 473,
              "condation": "اداره العقود",
              "value": 0,
              "conditionValue": 0,
              "conditionType": 3
            },
            {
              "condationId": 475,
              "condation": "اداره الجلسات",
              "value": 0,
              "conditionValue": 0,
              "conditionType": 5
            },
            {
              "condationId": 476,
              "condation": "اداره الوكلات",
              "value": 0,
              "conditionValue": 0,
              "conditionType": 6
            },
            {
              "condationId": 477,
              "condation": "اداره القضايا",
              "value": 0,
              "conditionValue": 0,
              "conditionType": 7
            },
            {
              "condationId": 478,
              "condation": "اداره المهام",
              "value": 0,
              "conditionValue": 0,
              "conditionType": 8
            },
            {
              "condationId": 479,
              "condation": "عدد مستخدمين غير محدود",
              "value": 0,
              "conditionValue": 0,
              "conditionType": 9
            },
          ],

        })
        this.totalCount = next.data.totalCount;
        this.spinner.hide();
        this.cdr.detectChanges();
      }
    })
  }

  initFilterObj() {
    return {
      Sorting: 'id',
      LawyerOffice: this.LawyerOffice,
      RegularRepresentative: this.RegularRepresentative,
      Advisor: this.Advisor,
      SkipCount: 0,
      MaxResultCount: this.pageSize,
      filterType: true
    };
  }

  onPageChange() {
    this.getAllPackages();
  }

  filterPackagesByType() {
    if (this.selectedPackageType) {
      localStorage.setItem('statusOfToggleInUpgardePackage', 'true');
    } else {
      localStorage.setItem('statusOfToggleInUpgardePackage', 'false');
    }
    this.getAllPackages()
  }

  selectPackageType() {
    this.page = 1;
    this.getAllPackages();
  }

  setActiveDiv(index: any) {
    this.activeDivIndex = index;
  }
}
