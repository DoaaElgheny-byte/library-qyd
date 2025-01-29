import { ViewportScroller } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslationService } from 'src/app/i18n';
import { UpgradePackageService } from 'src/app/services/api/upgrade-package.sevice';
import { Constants } from 'src/app/services/Constants/constants';
import { AuthService } from '../../auth';
import { ValidationPattern } from '../../SharedComponent/helper/validator';

import { Meta, Title } from '@angular/platform-browser';
import { DurationPackage } from 'src/app/services/enums/package.enum';



declare let AOS: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent implements OnInit {
  lang: string = String(localStorage.getItem('language'));
  contactUsForm: FormGroup = new FormGroup({});
  currentUser: any;
  allRoles = Constants.AllRoles;
  role: String;
  @ViewChild('section') section!: ElementRef;
  dynamicSlides: any[];
  cloneDynamicSlides: any[];
  colors: string[] = ['#045883', '#AE2840', '#DDA617'];
  filterObj = this.initFilterObj();
  LawyerOffice: any = '';
  RegularRepresentative: any = '';
  Advisor: any = '';
  totalCount: number;
  page: number = 1;
  pageSize: number = 0;
  packages: any;
  packagesClone: any;
  conditions: any;
  isExpiration: boolean = false;
  isFromHomePage: boolean = false;
  isEmployee: any;
  selectedPackageType: boolean = true;
  @ViewChild('swiperElement') swiperElement: ElementRef;
  activeDivIndex: number | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private router: Router,
    private authService: AuthService,
    private viewportScroller: ViewportScroller,
    private upgradePackageService: UpgradePackageService,
    private translationService: TranslationService,
    private titleService: Title,
    private metaService: Meta,
    private translate: TranslateService,
    private _Renderer2: Renderer2
  ) {

    this.lang = String(localStorage.getItem('language'));

    // Setting page title
    let title = "QYD | Home";
    if (this.lang === "ar") {
      title = "قيد | الرئيسية";
    }
    this.titleService.setTitle(title);

    // Setting Meta Tags for Arabic page
    this.metaService.addTags([
      {
        name: 'description',
        content:
          'اكتشف أحدث الأدوات الرقمية لإدارة القضايا والعقود للمحامين والمستشارين القانونيين.',
      },
      {
        name: 'keywords',
        content:
          'حلول قانونية, برامج المحامين, إدارة القضايا, التحول الرقمي القانوني, المستشارين القانونيين',
      },
      { name: 'robots', content: 'index, follow' },
      { charset: 'UTF-8' },
    ]);

    // Setting hreflang and Canonical for Arabic page
    // this.metaService.addTag({
    //   name: 'hreflang',
    //   content: 'ar',
    //   href: 'https://example.com/ar/services',
    // });
    // this.metaService.addTag({
    //   name: 'canonical',
    //   href: 'https://example.com/ar/services',
    // });
    // Setting Title for English page
    // this.titleService.setTitle(
    //   'Best Legal Digital Solutions for Lawyers - Our Company'
    // );

    // // Setting Meta Tags for English page
    // this.metaService.addTags([
    //   {
    //     name: 'description',
    //     content:
    //       'Discover the latest digital tools for managing legal cases and contracts for lawyers and legal consultants.',
    //   },
    //   {
    //     name: 'keywords',
    //     content:
    //       'Legal solutions, lawyer software, case management, digital transformation, legal consultants',
    //   },
    //   { name: 'robots', content: 'index, follow' },
    //   { charset: 'UTF-8' },
    // ]);

    // Setting hreflang and Canonical for English page
    // this.metaService.addTag({
    //   name: 'hreflang',
    //   content: 'en',
    //   href: 'https://example.com/en/services',
    // });
    // this.metaService.addTag({
    //   name: 'canonical',
    //   href: 'https://example.com/en/services',
    // });
  }
  scrollUp() {
    window.scrollTo(0, 0);
  }
  ngOnInit() {
    const storedLanguage = localStorage.getItem('statusOfToggleLogin');

    if (storedLanguage == null || storedLanguage == 'true') {
      this.translationService.setLanguage('ar');
      this._Renderer2.setAttribute(document.documentElement, 'dir', 'rtl');
      // this._Renderer2.setAttribute(document.documentElement, 'lang', 'ar');
    } else {
      this.translationService.setLanguage('en');
      this._Renderer2.setAttribute(document.documentElement, 'dir', 'ltr');
      // this._Renderer2.setAttribute(document.documentElement, 'lang', 'en');
    }
    AOS.init();
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser?.roles[0] === Constants.AllRoles.qydSuperAdmin) {
      this.role = Constants.AllRoles.qydSuperAdmin;
    } else if (this.currentUser?.roles[0] === Constants.AllRoles.employee) {
      this.role = Constants.AllRoles.employee;
    } else if (this.currentUser?.roles[0] === Constants.AllRoles.qydAgent) {
      this.role = Constants.AllRoles.qydAgent;
    }
    this.initForm();
    this.getAllDataOfPackages()
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

  getColor(index: number): string {
    return this.colors[index % this.colors.length];
  }

  getAllDataOfPackages() {
    this.upgradePackageService.getAllPackagesForHomePage().subscribe(res => {
      this.dynamicSlides = res.data;

      this.cloneDynamicSlides = res.data;
      console.log(this.dynamicSlides)
      this.onChangeYearlyPackages()
    })
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
    this.dynamicSlides = this.cloneDynamicSlides.filter(x => x.durationPackage === DurationPackage.Year || x.price === 0);
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
  }

  onChangeMonthlyPackages() {
    this.selectedPackageType = false;
    this.dynamicSlides = this.cloneDynamicSlides.filter(x => x.durationPackage === DurationPackage.Month || x.price === 0);
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
  }

  logOut() {
    this.authService.logout();
    document.location.reload();
  }
  onScrollToSection(sectionId: string): void {
    if (sectionId) {
      this.viewportScroller.scrollToAnchor(sectionId);
    }
  }

  initForm() {
    this.contactUsForm = this.formBuilder.group({
      name: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(ValidationPattern.Email),
        ]),
      ],
      phoneNumber: [
        null,
        Validators.compose([
          Validators.required,

          Validators.minLength(11),
          Validators.pattern('^[0-9]*$'),
        ]),
      ],

      message: [null, Validators.compose([Validators.required])],
    });
  }

  // submit
  submit() {
    Object.keys(this.contactUsForm.controls).forEach((field) => {
      // {1}
      const control = this.contactUsForm.get(field); // {2}
      control?.markAsTouched({ onlySelf: true }); // {3}
    });

    if (this.contactUsForm.valid) {
      this.spinner.show();
    }
  }
  gotToAbout() {
    this.router.navigate(['/admin/user-managment']);
  }
  goToFeatures() {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  }
  goToConatact() {
    document
      .getElementById('conatact-us')
      ?.scrollIntoView({ behavior: 'smooth' });
  }
  goToServices() {
    this.router.navigate(['/visitor/services']);
  }
  goToRegister() {
    this.router.navigate(['/auth/register']);
  }
  showBtn: boolean = false;
  @HostListener('window:scroll') scrollToTop() {
    let scrollTop = document.documentElement.scrollTop;
    if (scrollTop > 500) {
      this.showBtn = true;
    } else {
      this.showBtn = false;
    }
  }

  setActiveDiv(index: any) {

    this.activeDivIndex = index;

  }
}
