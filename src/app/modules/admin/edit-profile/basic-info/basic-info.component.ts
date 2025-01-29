import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { TranslationService } from 'src/app/i18n';
import { ValidationPattern } from 'src/app/modules/SharedComponent/helper/validator';
import { SectorModel } from 'src/app/modules/auth/models/sector.model';
import { CompleteProfileService } from 'src/app/modules/auth/services/complete-profile.service';
import { AccountTypes } from 'src/app/services/enums/accountType.enum';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss']
})
export class BasicInfoComponent implements OnInit, OnDestroy {


  loginForm: FormGroup;
  hasError: boolean;
  isLoading$: Observable<boolean>;
  accountTypes = AccountTypes;
  private unsubscribe: Subscription[] = [];
  sectors: SectorModel[]
  employeeNo: { id: number, size: string }[]
  regions: SectorModel[]
  city: SectorModel[]
  currency: any
  lang: string | null = localStorage.getItem('language');
  commercialStorageFileNameForVat: string | null;
  commercialStorageFileNameForVatTax: string | null;
  commercialName: string | null
  commercialStorageFileName: string | null;
  vatFlag: boolean;
  profileData: any;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private completeProfileservice: CompleteProfileService,
    private translate: TranslateService,
    private toastr: ToastrService,

  ) {
  }

  ngOnInit(): void {
    this.initForm();
    this.getData();
    this.getCompletedData();
    this.loginForm.get('isSubscribeOnVat')?.setValue(true);
  }

  initForm() {
    this.loginForm = this.fb.group({
      name: [null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(200),
        ]),],
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(ValidationPattern.Email),
        ]),
      ],
      mobileNumber: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(ValidationPattern.Mobile),
          Validators.maxLength(16),
          Validators.minLength(9)

        ]),
      ],
      countryCode: [966],
      countryCodeIso: 'sa',
      accountType: [
        null,
        Validators.compose([
          Validators.required,
        ])
      ],
      countryId: [
        null,
        Validators.compose([
          Validators.required,
        ]),
      ],
      regionId: [
        null,
      ],
      cityId: [
        null,
        Validators.compose([
          Validators.required,
        ]),
      ],
      currencyId: [
        2
      ],
      agentAddress: [
        null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(200)
        ]),
      ],
      language: [
        null,
        Validators.compose([
          Validators.required,
        ]),
      ],
      agentName: [
        null,
        Validators.compose([
          Validators.required,
        ]),
      ],



      organizationSectors: [
        null,
        Validators.compose([
          Validators.required,
        ]),
      ],
      agentSizeId: [
        null,
        Validators.compose([
          Validators.required,
        ]),
      ],
      agentEmail: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(ValidationPattern.Email),
        ]),

      ],

      vatRegistrationNumber: [null],
      commercialRegistrationNo: [null],



      logoImageStorageFileName: [
        null,
        Validators.compose([
          Validators.required,
        ]),
      ],
      logoImageStorageFileNameForVat: [null],
      logoImageStorageFileNameForVatTax: [null],


      logoImageName: [
        null,
        Validators.compose([
          Validators.required,
        ]),
      ],
      logoImageNameForVat: [null,],
      logoImageNameForVatTax: [null,],
      isSubscribeOnVat: [null, Validators.compose([Validators.required])],
    });
  }

  getData() {
    this.spinner.show();

    forkJoin([
      this.completeProfileservice.getSectors(),
      this.completeProfileservice.getEmployeeNo(),
      this.completeProfileservice.getRegion(),
      this.completeProfileservice.getCurrancy()
    ]).subscribe({
      next: ([Sectors, EmployeeNo, Regions, Currency]) => {
        this.sectors = Sectors.data;
        this.employeeNo = EmployeeNo.data;
        this.regions = Regions.data;
        this.currency = Currency.data
        this.spinner.hide();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.spinner.hide();
      },
    });
  }

  hasRequiredValidator(control: AbstractControl | null): boolean {
    if (!control || !control.validator) {
      return false;
    }

    const validator = control.validator({} as AbstractControl);
    if (validator && validator['required']) {
      return true;
    }

    return !!control.errors?.['required'];
  }

  updateValidators(isRequired: boolean) {
    const controls = [
      this.loginForm.get('vatRegistrationNumber'),
      this.loginForm.get('commercialRegistrationNo'),
      this.loginForm.get('LogoImageStorageFileNameForVat'),
      this.loginForm.get('LogoImageStorageFileNameForVatTax'),
    ];

    controls.forEach(control => {
      if (isRequired) {
        control?.setValidators([Validators.required]);
      } else {
        control?.clearValidators();
      }
      control?.updateValueAndValidity();
    });
  }

  LogoImageStorageFileNameForVat: string;
  LogoImageStorageFileNameForVatTax: string;

  getCompletedData() {
    this.completeProfileservice.getDataOfCompleteInfo(0).subscribe({
      next: next => {
        this.profileData = next.data
        this.loginForm.patchValue(this.profileData)
        this.vatFlag = next.data.isSubscribeOnVat;
        this.showHideVat(this.vatFlag);
        this.LogoImageStorageFileNameForVat = this.profileData.logoImageStorageFileNameForVat;
        this.LogoImageStorageFileNameForVatTax = this.profileData.logoImageStorageFileNameForVatTax;

        this.loginForm.get('organizationSectors')?.enable()
        let data = this.profileData.organizationSectors.map((x: any) => x.id)
        this.loginForm.get('organizationSectors')?.patchValue(data);
        this.commercialStorageFileNameForVat = next.data.logoImageNameForVat;
        this.commercialStorageFileNameForVatTax = next.data.logoImageNameForVatTax;
        this.cdr.detectChanges();
        //}
        if (this.profileData.regionId) this.getCity(this.profileData.regionId)

      }
    })
  }

  disableSector(data: any) {
    // if (+data === this.accountTypes.LawyerOffice) {
    //   this.loginForm.get('organizationSectors')?.patchValue(null)

    //   this.loginForm.get('organizationSectors')?.disable()

    // } else {
    //   this.loginForm.get('organizationSectors')?.enable()
    // }
  }

  getCity(id: any) {
    this.completeProfileservice.getCity({ regionId: id }).subscribe({
      next: next => {
        this.city = next.data
        if (this.profileData.cityId) this.loginForm.get('cityId')?.patchValue(this.profileData.cityId)
        this.cdr.detectChanges()
      }
    })
  }

  uploadImg(data: any, type: number) {
    if (type == 1) {
      this.loginForm.get('logoImageName')?.setValue(data.fileName);
      this.loginForm
        .get('logoImageStorageFileName')
        ?.setValue(data.storageFileName);
      this.commercialName = null;
      this.commercialStorageFileName = data.fileName;

    }
    if (type == 2) {
      this.loginForm.get('logoImageNameForVat')?.setValue(data.fileName);
      this.loginForm
        .get('LogoImageStorageFileNameForVat')
        ?.setValue(data.storageFileName);
      this.commercialName = null;
      this.commercialStorageFileNameForVat = data.fileName;
    }
    if (type == 3) {
      this.loginForm.get('logoImageNameForVatTax')?.setValue(data.fileName);
      this.loginForm
        .get('LogoImageStorageFileNameForVatTax')
        ?.setValue(data.storageFileName);
      this.commercialName = null;
      this.commercialStorageFileNameForVatTax = data.fileName;
    }
  }

  getOrganizatinSector(e: any) {
    let data = [e.target.value]
    this.loginForm.get('organizationSectors')?.patchValue(data)
  }

  submit() {
    this.loginForm.markAllAsTouched()
    if (this.loginForm.valid) {
      this.spinner.show();
      this.loginForm.get('isSubscribeOnVat')?.setValue(this.vatFlag);

      let data = {
        ...this.loginForm.value,
        organizationSectors: this.loginForm.value.organizationSectors ? this.loginForm.value.organizationSectors : []
      }
      this.completeProfileservice.editProfile(data).subscribe({
        next: next => {
          this.spinner.hide();
          if (next.success) {
            this.toastr.success(
              this.translate.instant('editProfile.addSuccess')
            );
            this.cdr.detectChanges();
          } else {
            this.toastr.error(next.message);

          }

        }, error: error => {
          this.spinner.hide();
          this.toastr.error(error.error.message);
        }
      })
    }
  }
  vatFlagFromSelected: boolean;
  showHideVat(flag: boolean) {
    this.vatFlag = flag;
    this.updateValidators(flag);
    if (!flag) {
      this.loginForm.get('vatRegistrationNumber')?.setValue(null);
      this.loginForm.get('commercialRegistrationNo')?.setValue(null);
      this.loginForm.get('LogoImageStorageFileNameForVat')?.setValue(null);
      this.loginForm.get('LogoImageStorageFileNameForVatTax')?.setValue(null);
      this.commercialStorageFileNameForVat = null;
      this.commercialStorageFileNameForVatTax = null;
      this.loginForm.get('logoImageNameForVat')?.setValue(null);
      this.loginForm.get('logoImageNameForVatTax')?.setValue(null);
    }
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}


