import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UpgradePackageService } from 'src/app/services/api/upgrade-package.sevice';
import { Constants } from 'src/app/services/Constants/constants';
import { DurationPackage } from 'src/app/services/enums/package.enum';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-step3-select-package',
  templateUrl: './step3-select-package.component.html',
  styleUrls: ['./step3-select-package.component.scss']
})
export class Step3SelectPackageComponent implements OnInit {
  @ViewChild('section') section!: ElementRef;
  @Input() active: boolean;

  lang: string = String(localStorage.getItem('language'));
  contactUsForm: FormGroup = new FormGroup({});
  currentUser: any;
  allRoles = Constants.AllRoles;
  role: String;
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
  userCount: number = 1;
  activeDivIndex: number | null = null;
  numberOfUsers: any;
  selectedPackageId: number;
  isSelectPackage: boolean = true;

  constructor(
    private upgradePackageService: UpgradePackageService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private service: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
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

  getAllDataOfPackages() {
    this.upgradePackageService.getAllPackagesForHomePage().subscribe(res => {
      this.dynamicSlides = res.data;
      this.cloneDynamicSlides = res.data;
      console.log(res.data);
      this.onChangeYearlyPackages()
      this.cdr.detectChanges();
    })
  }

  onChangeYearlyPackages() {
    this.selectedPackageType = true;
    this.dynamicSlides = this.cloneDynamicSlides.filter(x => x.durationPackage === DurationPackage.Year || x.price === 0);
    console.log(this.dynamicSlides);

  }

  onChangeMonthlyPackages() {
    this.selectedPackageType = false;
    this.dynamicSlides = this.cloneDynamicSlides.filter(x => x.durationPackage === DurationPackage.Month || x.price === 0);
  }

  increase(): void {
    if (this.userCount < 99) {
      this.userCount++;
    }
  }

  decrease(): void {
    if (this.userCount > 1) {
      this.userCount--;
    }
  }

  selectPackage() {
    if (this.isSelectPackage) {
      this.toastr.error(this.translate.instant('attorny.pleaseSelectPackage'));
      return;
    }
    let obj = {
      appUserId: localStorage.getItem('userId'),
      id: this.selectedPackageId,
      numberOfUsers: this.numberOfUsers
    }
    this.spinner.show();
    this.service.selectFreeTrialPackage(obj).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe(res => {
      this.router.navigate(['../complete-info'], { relativeTo: this.route });
    })
  }

  countOfUser(event: any) {
    this.numberOfUsers = event;
  }

  setActiveDiv(selectedpackage: any, index: any) {
    this.activeDivIndex = index;
    this.selectedPackageId = selectedpackage.id;
    this.isSelectPackage = false;
  }
}
