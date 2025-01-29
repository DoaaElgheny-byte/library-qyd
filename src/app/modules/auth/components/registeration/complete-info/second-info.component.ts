import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { ValidationPattern } from 'src/app/modules/SharedComponent/helper/validator';
import { AccountTypes } from 'src/app/services/enums/accountType.enum';
import { CompleteProfileService } from '../../../services/complete-profile.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SectorModel } from '../../../models/sector.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-second-info',
  templateUrl: './second-info.component.html',
  styleUrls: ['./second-info.component.scss'],
})
export class SecondInfoComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  hasError: boolean;
  private unsubscribe: Subscription[] = [];
  accountTypes = AccountTypes;
  lang: string | null = localStorage.getItem('language');
  commercialName: string | null;
  commercialStorageFileName: string | null;
  commercialStorageFileNameForVat: string | null;
  commercialStorageFileNameForVatTax: string | null;
  vatFlag: boolean;

  sectors: SectorModel[];
  employeeNo: { id: number; size: string }[];
  isDisable = false;

  constructor(
    private fb: FormBuilder,
    private completeProfileservice: CompleteProfileService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getData();
    this.getCompletedData();
  }

  getData() {
    forkJoin([
      this.completeProfileservice.getSectors(),
      this.completeProfileservice.getEmployeeNo(),
    ]).subscribe({
      next: ([Sectors, EmployeeNo]) => {
        this.sectors = Sectors.data;
        this.employeeNo = EmployeeNo.data;
        this.spinner.hide();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.spinner.hide();
      },
    });
  }

  initForm() {
    this.loginForm = this.fb.group({
      agentName: [null, Validators.compose([Validators.required])],
      logoImageName: [null, Validators.compose([Validators.required])],
      logoImageNameForVat: [null],
      logoImageNameForVatTax: [null,],

      logoImageStorageFileName: [
        null,
        Validators.compose([Validators.required]),
      ],

      vatRegistrationNumber: [null],
      commercialRegistrationNo: [null],
      LogoImageStorageFileNameForVat: [null],
      LogoImageStorageFileNameForVatTax: [null],

      accountType: [null, Validators.compose([Validators.required])],
      isSubscribeOnVat: [null, Validators.compose([Validators.required])],
      organizationSectors: [null, Validators.compose([Validators.required])],
      agentSizeId: [null, Validators.compose([Validators.required])],
      agentEmail: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(ValidationPattern.Email),
        ]),
      ],
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

  getCompletedData() {
    this.completeProfileservice.getDataOfCompleteInfo(0).subscribe({
      next: (next) => {
        this.loginForm.patchValue(next.data);
        this.vatFlag = next.data.isSubscribeOnVat;
        this.showHideVat(this.vatFlag);
        this.loginForm
          .get('organizationSectors')
          ?.setValidators([Validators.required]);
        this.loginForm.get('organizationSectors')?.updateValueAndValidity();
        let data =
          next.data.organizationSectors.length > 0
            ? next.data.organizationSectors[0].id
            : null;
        this.loginForm.patchValue({
          organizationSectors: data,
        });
        this.commercialStorageFileName = next.data.logoImageName;
        this.commercialStorageFileNameForVat = next.data.logoImageNameForVat;
        this.commercialStorageFileNameForVatTax = next.data.logoImageNameForVatTax;
        this.cdr.detectChanges();
        //}
      },
    });
  }

  disableSector(data: any) {
    // if (+data === this.accountTypes.LawyerOffice) {
    //   this.isDisable = true;
    //   this.loginForm.get('organizationSectors')?.clearValidators();
    //   this.loginForm.get('organizationSectors')?.updateValueAndValidity();
    //   this.loginForm.get('organizationSectors')?.setValue(null);
    // } else {
    //   this.isDisable = false;
    //   this.loginForm
    //     .get('organizationSectors')
    //     ?.setValidators([Validators.required]);
    //   this.loginForm.get('organizationSectors')?.updateValueAndValidity();
    // }
  }

  submit() {
    debugger
    this.loginForm.markAllAsTouched();
    this.loginForm.get('isSubscribeOnVat')?.setValue(this.vatFlag);
    let data = {
      ...this.loginForm.value,
      organizationSectors: this.loginForm.value.organizationSectors
        ? [this.loginForm.value.organizationSectors]
        : [],
    };
    debugger
    if (this.loginForm.valid) {
      this.spinner.show();
      this.completeProfileservice.completeProfile(data).subscribe({
        next: (next) => {
          this.spinner.hide();
          if (next.success) {
            this.router.navigate(['/auth/register/step-2']);

            this.cdr.detectChanges();
          } else {
            this.toastr.error(next.message);
          }
        },
        error: (error) => {
          this.spinner.hide();
          this.toastr.error(error.error.error.message);
        },
      });
    }
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

  goBack(): void {
    this.location.back();
  }

  showHideVat(flag: boolean) {
    this.vatFlag = flag;
    this.updateValidators(flag);
    if (!flag) {
      this.loginForm.get('vatRegistrationNumber')?.setValue(null);
      this.loginForm.get('commercialRegistrationNo')?.setValue(null);
      this.loginForm.get('LogoImageStorageFileNameForVat')?.setValue(null);
      this.loginForm.get('LogoImageStorageFileNameForVatTax')?.setValue(null);
      this.loginForm.get('logoImageNameForVat')?.setValue(null);
      this.loginForm.get('logoImageNameForVatTax')?.setValue(null);
      this.commercialStorageFileNameForVat = null;
      this.commercialStorageFileNameForVatTax = null;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
