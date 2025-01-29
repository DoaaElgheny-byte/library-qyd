import { ChangeDetectorRef, Component, EventEmitter, inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DateFormatterService, DateType } from 'ngx-hijri-gregorian-datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { SectorModel } from 'src/app/modules/auth/models/sector.model';
import { CompleteProfileService } from 'src/app/modules/auth/services/complete-profile.service';
import { ValidationPattern } from 'src/app/modules/SharedComponent/helper/validator';
import { IssuesService } from 'src/app/services/api/issues.service';
import { ClientType, UnitMeasureType } from 'src/app/services/enums/client';
import {
  CountryISO,
  PhoneNumberFormat,
  SearchCountryField,
} from 'ngx-intl-telephone-input';

@Component({
  selector: 'app-price-offer-step3',
  templateUrl: './price-offer-step3.component.html',
  styleUrls: ['./price-offer-step3.component.scss']
})
export class PriceOfferStep3Component implements OnInit {
  @Output() callNextStep = new EventEmitter<void>(); // EventEmitter to notify the parent
  @Output() callPrevStep = new EventEmitter<void>(); // EventEmitter to notify the parent
  @ViewChild('expirationDatePicker') expirationDatePicker: any;
  @ViewChild('EndDatePicker') EndDatePicker: any;

  dateTextEnd: any;
  dateText: any;
  expirationDate: any;
  EndDate: any;
  currentDateH: any;
  currentDateG: any;
  selectedDateType = DateType.Hijri;
  selectedEndDateType = DateType.Hijri;
  minDateH: any;
  minDateG: any;
  projectId: any;
  infoForm: FormGroup;
  unitMeasureType: any;
  regions: SectorModel[];
  city: SectorModel[];
  cityForAgent: SectorModel[];
  data: any
  priceToProjectDetails: any;

  isAgentHasTaxNumber: boolean = false;
  isClientSpecial: boolean = false;
  isClientHasTaxNumber: boolean = false;
  endAfterStart: boolean = true;

  public CountryISO: any;
  public PhoneNumberFormat: any;
  public SearchCountryField: any;
  public selectedCountryIso: any;
  mobileNumber: any;
  branches: any;
  classes: any;
  isShowNationalType: boolean = false;
  isShowOtherRepresentativeStatusType: boolean = false;

  logo: any;
  logoStamp: any;
  logoImageName: string;
  logoStampImage: string;
  fieldRequired = false;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private issueService = inject(IssuesService);
  private toastr = inject(ToastrService);
  private translateService = inject(TranslateService);


  constructor(
    private dateFormatter: DateFormatterService, private spinner: NgxSpinnerService,
    private completeProfileservice: CompleteProfileService,
    private cdr: ChangeDetectorRef,
  ) {
    this.CountryISO = CountryISO;
    this.PhoneNumberFormat = PhoneNumberFormat;
    this.SearchCountryField = SearchCountryField;
    this.minDateG = this.dateFormatter.ToGregorianDateStruct('1800-01-01', 'YYYY-MM-DD');
    this.minDateH = this.dateFormatter.ToGregorianDateStruct('1214-01-01', 'YYYY-MM-DD');
  }

  getRequestId() {
    this.route.params.subscribe({
      next: (params) => {
        this.projectId = params['id'];
        if (this.projectId)
          this.getDataOfPriceToProject();
      },
    });
  }

  public onInputChange(event: any) {
    if (event.isNumberValid) {
      this.infoForm
        .get('mobileNumber')
        ?.setValue(
          event.phoneNumber.replace(/\s/g, '').split('+' + event.dialCode)[1]
        );
      this.infoForm.get('countryCode')?.setValue(event.dialCode);
      this.infoForm.get('countryCodeIso')?.setValue(event.iso2Code);
    } else {
      this.infoForm.get('mobileNumber')?.markAsTouched({ onlySelf: true });
      this.infoForm.get('mobileNumber')?.setErrors({ required: true });
    }
  }

  selectedDateChange(event: any) {
    debugger
    if (!this.expirationDate) {
      return;
    }
    if (!this.EndDate) {
      let currentDateVal = new Date(
        this.expirationDatePicker.getSelectedDate()
      );

      const timezoneOffset = currentDateVal.getTimezoneOffset();

      currentDateVal.setMinutes(currentDateVal.getMinutes() + timezoneOffset);
      currentDateVal.setDate(currentDateVal.getDate() + 1);
      this.infoForm.controls.startAuthorizationDate.setValue(currentDateVal);
    } else {
      if (
        this.expirationDatePicker.getSelectedDate() <
        this.EndDatePicker.getSelectedDate()
      ) {
        let currentDateVal = new Date(
          this.expirationDatePicker.getSelectedDate()
        );

        const timezoneOffset = currentDateVal.getTimezoneOffset();

        currentDateVal.setMinutes(currentDateVal.getMinutes() + timezoneOffset);
        currentDateVal.setDate(currentDateVal.getDate() + 1);
        this.infoForm.controls.startAuthorizationDate.setValue(currentDateVal);
        this.endAfterStart = true;
      } else {
        this.expirationDate = null;
        this.endAfterStart = false;
      }
    }
    if (this.expirationDatePicker.selectedDateType === DateType.Hijri) {
      this.infoForm.controls.startDateType.setValue(DateType.Hijri);
    } else {
      this.infoForm.controls.startDateType.setValue(DateType.Gregorian);
    }
  }

  selectedDateChangeEnd(event: any) {
    debugger
    if (!this.EndDate) {
      return;
    }
    if (!this.expirationDate) {
      let currentDateVal = new Date(this.EndDatePicker.getSelectedDate());

      const timezoneOffset = currentDateVal.getTimezoneOffset();

      currentDateVal.setMinutes(currentDateVal.getMinutes() + timezoneOffset);
      currentDateVal.setDate(currentDateVal.getDate() + 1);
      this.infoForm.controls.endAuthorizationDate.setValue(currentDateVal);
    } else {
      if (
        this.expirationDatePicker.getSelectedDate() <
        this.EndDatePicker.getSelectedDate()
      ) {
        let currentDateVal = new Date(this.EndDatePicker.getSelectedDate());

        const timezoneOffset = currentDateVal.getTimezoneOffset();

        currentDateVal.setMinutes(currentDateVal.getMinutes() + timezoneOffset);
        currentDateVal.setDate(currentDateVal.getDate() + 1);
        this.infoForm.controls.endAuthorizationDate.setValue(currentDateVal);
        this.endAfterStart = true;
      } else {
        this.EndDate = null;
        this.endAfterStart = false;
      }
    }
    if (this.EndDatePicker.selectedDateType === DateType.Hijri) {
      this.infoForm.controls.expirationDateType.setValue(DateType.Hijri);
    } else {
      this.infoForm.controls.expirationDateType.setValue(DateType.Gregorian);
    }
  }

  // setValueOfDate() {
  //   if (this.dateTextEnd != undefined) {
  //     const jsDate1 = new Date(
  //       this.dateText.year,
  //       this.dateText.month - 1,
  //       this.dateText.day + 1
  //     );

  //     const jsDate2 = new Date(
  //       this.dateTextEnd.year,
  //       this.dateTextEnd.month - 1,
  //       this.dateTextEnd.day + 1
  //     );
  //     if (jsDate1 < jsDate2) {
  //       this.infoForm.get('startDate')?.setValue(jsDate1);
  //       this.infoForm.get('endDate')?.setValue(jsDate2);

  //       this.endAfterStart = true;
  //     } else {
  //       this.dateText = null;
  //       this.endAfterStart = false;
  //     }
  //   } else {
  //     const jsDate1 = new Date(
  //       this.dateText.year,
  //       this.dateText.month - 1,
  //       this.dateText.day + 1
  //     );
  //     this.infoForm.get('startDate')?.setValue(jsDate1);
  //     this.endAfterStart = true;
  //   }
  // }

  // setValueOfDateEnd() {
  //   if (this.dateText != undefined) {
  //     const jsDate1 = new Date(
  //       this.dateText.year,
  //       this.dateText.month - 1,
  //       this.dateText.day + 1
  //     );

  //     const jsDate2 = new Date(
  //       this.dateTextEnd.year,
  //       this.dateTextEnd.month - 1,
  //       this.dateTextEnd.day + 1
  //     );
  //     if (jsDate1 < jsDate2) {
  //       this.infoForm.get('endDate')?.setValue(jsDate2);
  //       this.infoForm.get('startDate')?.setValue(jsDate1);

  //       this.endAfterStart = true;
  //     } else {
  //       this.endAfterStart = false;
  //       this.dateTextEnd = null;
  //     }
  //   } else {
  //     const jsDate2 = new Date(
  //       this.dateTextEnd.year,
  //       this.dateTextEnd.month - 1,
  //       this.dateTextEnd.day + 1
  //     );
  //     this.infoForm.get('endDate')?.setValue(jsDate2);
  //     this.endAfterStart = true;
  //   }
  // }

  triggerNextStep(): void {
    window.scrollTo(0, 0)
    this.callNextStep.emit();
  }

  triggerPrevStep(): void {
    this.callPrevStep.emit();
    window.scrollTo(0, 0)
    // this.router.navigate(['../add-edit-project', this.projectId], { relativeTo: this.route });

  }

  ngOnInit(): void {
    this.initForm();
    this.getRegion();
    this.getRequestId();
    this.getUnitMeasures();
  }

  getRegion() {
    this.completeProfileservice.getRegion().subscribe(res => {
      this.regions = res.data
    })
  }

  getCity(id: any) {
    this.spinner.show();
    this.completeProfileservice.getCity({ regionId: id }).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe({
      next: next => {
        this.city = next.data
        this.cdr.detectChanges()
      }
    })
  }

  getCityForAgent(id: any) {
    this.spinner.show();
    this.completeProfileservice.getCity({ regionId: id }).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe({
      next: next => {
        this.cityForAgent = next.data
        this.cdr.detectChanges()
      }
    })
  }

  initForm(): void {
    this.infoForm = this.fb.group({
      projectId: [],
      taxNumberForAgent: [null],
      startDate: [],
      endDate: [],
      clientName: [],
      taxNumberForClient: [null],
      regionClientId: [null, Validators.required],
      cityClientId: [null, Validators.required],
      district: ['', Validators.required],
      street: ['', Validators.required],
      buildingNumber: [null, [Validators.required, Validators.pattern(ValidationPattern.Mobile)]],
      subNumber: [null, [Validators.required, Validators.pattern(ValidationPattern.Mobile)]],
      zipCode: [null, [Validators.required, Validators.pattern(ValidationPattern.Mobile)]],
      unitMeasure: [null],
      numberUnits: [1],
      unitPrice: [0, [Validators.required, Validators.pattern(ValidationPattern.Mobile)]],
      taxAmount: [0],
      totalTax: [0],
      vat: [0],
      regionAgentId: [null, Validators.required],
      cityAgentId: [null, Validators.required],
      agentDistrict: ['', Validators.required],
      agentStreet: ['', Validators.required],
      agentBuildingNumber: [null, [Validators.required, Validators.pattern(ValidationPattern.Mobile)]],
      agentSubNumber: [null, [Validators.required, Validators.pattern(ValidationPattern.Mobile)]],
      agentZipCoder: [null, [Validators.required, Validators.pattern(ValidationPattern.Mobile)]],
      mobileNumber: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(ValidationPattern.Mobile),
          Validators.maxLength(16),
          Validators.minLength(9)
        ]),
      ],
      phone: ['', Validators.compose([
        Validators.required,

      ]),],
      countryCode: [966],
      countryCodeIso: 'sa',
      logoImageName: [null,],
      logoImageStorageFileName: [null,],
      logoStampImage: [null, Validators.required,],
      logoStampImageStorageFileName: [null, Validators.required,],

      expirationDateType: [null],
      startDateType: [null],
    });
  }

  getUnitMeasures() {
    this.unitMeasureType = Object.keys(UnitMeasureType)
      .filter((key) => !isNaN(Number(UnitMeasureType[key as keyof typeof UnitMeasureType])))
      .map((key) => ({ id: Number(UnitMeasureType[key as keyof typeof UnitMeasureType]), name: key }));
  }

  calculatePrice() {
    let unitCount = this.infoForm.get('numberUnits')?.value;
    let unitPrice = this.infoForm.get('unitPrice')?.value;
    let taxAmount = unitCount * unitPrice;
    this.infoForm.get('taxAmount')?.setValue(taxAmount);
    let totalAmountWithTax = this.infoForm.get('taxAmount')?.value;
    const percentage = 15;
    const result = (totalAmountWithTax * percentage) / 100;
    this.infoForm.get('vat')?.setValue(result);
    let vat = this.infoForm.get('vat')?.value;
    let total = totalAmountWithTax + vat;
    this.infoForm.get('totalTax')?.setValue(total);
  }

  uploadImg(data: any, type: number) {
    if (type == 1) {
      this.infoForm.get('logoImageName')?.setValue(data.fileName);
      this.infoForm
        .get('logoImageStorageFileName')
        ?.setValue(data.storageFileName);
    }
    if (type == 2) {
      this.infoForm.get('logoStampImage')?.setValue(data.fileName);
      this.infoForm
        .get('logoStampImageStorageFileName')
        ?.setValue(data.storageFileName);
    }
  }

  getDataPrePriceToProject() {
    debugger;
    this.spinner.show();
    this.issueService.GetDataPrePriceToProjectData(this.projectId).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe(res => {
      this.data = res.data;
      debugger
      if (res.data.clientType == ClientType.Special) {
        this.isClientSpecial = true
        if (res.data.taxNumberForClient != null && res.data.taxNumberForClient != "") {
          this.infoForm.get('taxNumberForClient')?.setValue(res.data.taxNumberForClient);
          this.infoForm.get('taxNumberForClient')?.disable();
        }
        else {
          this.infoForm.get('taxNumberForClient')?.enable();
        }
      }
      else this.isClientSpecial = false



      this.logoImageName = res.data.logoImageName;

      this.infoForm.get('clientName')?.setValue(res.data.clientName);
      this.infoForm.get('taxRate')?.setValue('15 %');
      this.infoForm.get('taxRate')?.disable();

      this.infoForm.get('logoImageName')?.setValue(this.logoImageName);
      this.infoForm.get('logoImageStorageFileName')?.setValue(res.data.logoImageStorageFileName);

      this.logo = res.data.logoImageStorageFileURL
      // التاكد ان العميل له رقم ضريبي مسجل ام لا وايضا يكون قطاع اعمال وليس فرد

      //التاكد ان المنشاة الخاصة بك لها رقم ضريبي ام لا 
      if (res.data.taxNumberForAgent) {
        this.infoForm.get('taxNumberForAgent')?.setValue(res.data.taxNumberForAgent);
        this.infoForm.get('taxNumberForAgent')?.disable();
      }
      else {
        this.infoForm.get('taxNumberForAgent')?.enable();
      }
      if (res.data.startDate) {
        let currentDate = res.data.startDate.substring(0, 10);

        if (currentDate) {
          if (this.infoForm.get('startDateType')?.value == DateType.Gregorian) {
            this.expirationDate = this.dateFormatter.ToGregorianDateStruct(
              currentDate,
              'YYYY-MM-DD'
            );
          } else {
            this.expirationDate = this.dateFormatter.ToHijriDateStruct(
              currentDate,
              'YYYY-MM-DD'
            );
          }
        } else {
          this.expirationDate = this.dateFormatter.ToHijriDateStruct(
            currentDate,
            'YYYY-MM-DD'
          );
        }
        this.infoForm.get('startDate')?.setValue(currentDate);
      }
      if (res.data.endDate) {
        let endOfDate = res.data.endDate.substring(0, 10);
        if (endOfDate) {
          if (this.infoForm.get('endDateType')?.value == DateType.Gregorian) {
            this.EndDate = this.dateFormatter.ToGregorianDateStruct(
              endOfDate,
              'YYYY-MM-DD'
            );
          } else {
            this.EndDate = this.dateFormatter.ToHijriDateStruct(
              endOfDate,
              'YYYY-MM-DD'
            );
          }
        } else {
          this.EndDate = this.dateFormatter.ToHijriDateStruct(
            endOfDate,
            'YYYY-MM-DD'
          );
        }
        this.infoForm.get('endDate')?.setValue(endOfDate);
      }
      this.cdr.detectChanges();
    })
  }

  getDataOfPriceToProject() {
    this.spinner.show();
    this.issueService.getDataPriceToProjectDataQuery(this.projectId).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe(async res => {

      this.priceToProjectDetails = res.data;
      if (this.priceToProjectDetails != null) {
        if (res.data.regionAgentId != null) {
          this.getCity(res.data.regionAgentId)
        }
        if (res.data.regionClientId != null) {
          this.getCity(res.data.regionClientId)
        }
        if (res.data.regionAgentId != null && res.data.regionClientId != null) {
          await Promise.all([
            this.getCityForAgent(res.data.regionAgentId),
            this.getCity(res.data.regionClientId)
          ]);
        }
        this.mobileNumber = res.data.mobileNumber;
        this.infoForm.get('projectId')?.setValue(res.data.projectId);
        this.infoForm.get('taxNumberForAgent')?.setValue(res.data.taxNumberForAgent);
        this.infoForm.get('startDate')?.setValue(res.data.startDate);
        this.infoForm.get('endDate')?.setValue(res.data.endDate);
        this.infoForm.get('clientName')?.setValue(res.data.clientName);
        this.infoForm.get('regionClientId')?.setValue(res.data.regionClientId);
        this.infoForm.get('cityClientId')?.setValue(res.data.cityClientId);
        this.infoForm.get('district')?.setValue(res.data.district);
        this.infoForm.get('street')?.setValue(res.data.street);
        this.infoForm.get('buildingNumber')?.setValue(res.data.buildingNumber);
        this.infoForm.get('subNumber')?.setValue(res.data.subNumber);
        this.infoForm.get('zipCode')?.setValue(res.data.zipCode);
        this.infoForm.get('unitMeasure')?.setValue(res.data.unitMeasure);
        this.infoForm.get('numberUnits')?.setValue(res.data.numberUnits);
        this.infoForm.get('unitPrice')?.setValue(res.data.unitPrice);
        this.infoForm.get('taxAmount')?.setValue(res.data.taxAmount);
        this.infoForm.get('totalTax')?.setValue(res.data.totalTax);
        this.infoForm.get('vat')?.setValue(res.data.vat);
        this.infoForm.get('regionAgentId')?.setValue(res.data.regionAgentId);
        this.infoForm.get('cityAgentId')?.setValue(res.data.cityAgentId);
        this.infoForm.get('agentDistrict')?.setValue(res.data.agentDistrict);
        this.infoForm.get('agentStreet')?.setValue(res.data.agentStreet);
        this.infoForm.get('agentBuildingNumber')?.setValue(res.data.agentBuildingNumber);
        this.infoForm.get('agentSubNumber')?.setValue(res.data.agentSubNumber);
        this.infoForm.get('agentZipCoder')?.setValue(res.data.agentZipCoder);
        this.infoForm.get('phone')?.setValue(res.data.phone);
        this.infoForm.get('taxNumberForClient')?.setValue(res.data.taxNumberForClient);
        this.infoForm.get('taxRate')?.setValue('15 %');


        this.logoImageName = res.data.logoImageName;
        this.logoStampImage = res.data.logoStampImage;
        this.logo = res.data.logoImageStorageFileURL;
        this.logoStamp = res.data.logoStampImageStorageFileURL;

        this.infoForm.get('logoImageName')?.setValue(this.logoImageName);
        this.infoForm.get('logoImageStorageFileName')?.setValue(res.data.logoImageStorageFileName);
        this.infoForm.get('logoStampImage')?.setValue(this.logoStampImage);
        this.infoForm.get('logoStampImageStorageFileName')?.setValue(res.data.logoStampImageStorageFileName);


        this.infoForm.get('countryCode')?.setValue(966);
        this.infoForm.get('countryCodeIso')?.setValue('sa');
        this.infoForm.get('mobileNumber')?.setValue(res.data.mobileNumber);

        if (res?.data?.taxNumberForClient)
          this.isClientSpecial = true;

        debugger
        if (res.data.startDate) {
          let currentDate = res.data.startDate.substring(0, 10);

          if (currentDate) {
            if (this.infoForm.get('startDateType')?.value == DateType.Gregorian) {
              this.expirationDate = this.dateFormatter.ToGregorianDateStruct(
                currentDate,
                'YYYY-MM-DD'
              );
            } else {
              this.expirationDate = this.dateFormatter.ToHijriDateStruct(
                currentDate,
                'YYYY-MM-DD'
              );
            }
          } else {
            this.expirationDate = this.dateFormatter.ToHijriDateStruct(
              currentDate,
              'YYYY-MM-DD'
            );
          }
          this.infoForm.get('startDate')?.setValue(currentDate);
        }
        if (res.data.endDate) {
          let endOfDate = res.data.endDate.substring(0, 10);
          if (endOfDate) {
            if (this.infoForm.get('endDateType')?.value == DateType.Gregorian) {
              this.EndDate = this.dateFormatter.ToGregorianDateStruct(
                endOfDate,
                'YYYY-MM-DD'
              );
            } else {
              this.EndDate = this.dateFormatter.ToHijriDateStruct(
                endOfDate,
                'YYYY-MM-DD'
              );
            }
          } else {
            this.EndDate = this.dateFormatter.ToHijriDateStruct(
              endOfDate,
              'YYYY-MM-DD'
            );
          }
          this.infoForm.get('endDate')?.setValue(endOfDate);
        }

        this.cdr.detectChanges();
      }
      else {
        this.getDataPrePriceToProject();
      }
    })
  }

  submit() {
    debugger
    this.infoForm.enable();
    if (this.infoForm.invalid) {
      Object.keys(this.infoForm.controls).forEach((field) => {
        const control = this.infoForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      this.toastr.error(this.translateService.instant('attorny.CheckInsertData'));
      return;
    }
    const formValue = { ...this.infoForm.value };
    formValue.projectId = +this.projectId;
    formValue.taxNumberForClient = formValue.taxNumberForClient;
    formValue.startDate = formValue.startDate.substring(0, 10);
    formValue.endDate = formValue.endDate.substring(0, 10);


    this.spinner.show();
    if (this.projectId) {
      this.issueService.AddPriceToProject(formValue).subscribe({
        next: (res) => {
          this.spinner.hide();
          if (res.success) {
            this.triggerNextStep();
          } else {
            this.toastr.info(res.message);
          }
        },
        error: (err) => {
          this.spinner.hide();
          this.toastr.error(err.error.error?.message);
        },
      });
    }
  }

  submitLater() {
    this.infoForm.setValidators(null);
    const formValue = { ...this.infoForm.value };
    formValue.projectId = +this.projectId;
    this.spinner.show();
    if (this.projectId) {
      formValue.projectId = +this.projectId;
      this.issueService.addPriceToProjectCompleteLaterData(formValue).subscribe({
        next: (res) => {
          this.spinner.hide();
          if (res.success) {
            this.router.navigate(['/admin/departments/project-management']);
          }
        },
        error: (err) => {
          this.spinner.hide();
          this.toastr.error(err.error.error?.message);
        },
      });
    }
  }
}
