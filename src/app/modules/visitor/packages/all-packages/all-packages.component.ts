import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from 'src/app/i18n';
import { AuthService } from 'src/app/modules/auth';
import { UpgradePackageService } from 'src/app/services/api/upgrade-package.sevice';
import { Constants } from 'src/app/services/Constants/constants';
import { Title } from '@angular/platform-browser';
declare let AOS: any;

@Component({
  selector: 'app-all-packages',
  templateUrl: './all-packages.component.html',
  styleUrls: ['./all-packages.component.scss']
})
export class AllPackagesComponent implements OnInit {
  lang: string = String(localStorage.getItem('language'));

  selectedPackageType: boolean = true;
  filterObj = this.initFilterObj();
  Advisor: any = '';
  LawyerOffice: any = '';
  dynamicSlides: any[];
  RegularRepresentative: any = '';
  currentUser: any;
  allRoles = Constants.AllRoles;
  role: String;
  activeDivIndex: number | null = null;

  constructor(
    private upgradePackageService: UpgradePackageService,
    private cdr: ChangeDetectorRef,
    private translationService: TranslationService,
    private authService: AuthService,
    private translate: TranslateService,
    private titleService: Title

  ) { }

  ngOnInit(): void {
    AOS.init();

    this.lang = String(localStorage.getItem('language'));

    // Setting page title
    let title = "QYD | Packages";
    if (this.lang === "ar") {
      title = "قيد | الباقات";
    }
    this.titleService.setTitle(title);

    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser?.roles[0] === Constants.AllRoles.qydSuperAdmin) {
      this.role = Constants.AllRoles.qydSuperAdmin;
    } else if (this.currentUser?.roles[0] === Constants.AllRoles.employee) {
      this.role = Constants.AllRoles.employee;
    } else if (this.currentUser?.roles[0] === Constants.AllRoles.qydAgent) {
      this.role = Constants.AllRoles.qydAgent;
    }
    this.getPayments();


  }
  getPayments() {
    this.dynamicSlides = [];

    this.filterObj.SkipCount = 0;
    this.filterObj.Advisor = this.Advisor;
    this.filterObj.LawyerOffice = this.LawyerOffice;
    this.filterObj.RegularRepresentative = this.RegularRepresentative;
    this.filterObj.filterType = this.selectedPackageType;

    this.upgradePackageService.getAllPackages(this.filterObj).subscribe({
      next: (next) => {
        setTimeout(() => {

          this.dynamicSlides = next.data.items;
          this.dynamicSlides.push({
            "customPackage": true,
            "name": this.translate.instant('package.CustomizedPackage'),
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


          this.cdr.detectChanges();
        }, 50);
      },
    });
  }
  onChangeYearlyPackages() {
    this.selectedPackageType = true;
    this.getPayments();
  }

  onChangeMonthlyPackages() {
    this.selectedPackageType = false;
    this.getPayments();
  }

  initFilterObj() {
    return {
      Sorting: 'id',
      LawyerOffice: this.LawyerOffice,
      RegularRepresentative: this.RegularRepresentative,
      Advisor: this.Advisor,
      SkipCount: 0,
      MaxResultCount: 100,
      filterType: this.selectedPackageType,
    };
  }

  setActiveDiv(index: any) {

    this.activeDivIndex = index;

  }
}
