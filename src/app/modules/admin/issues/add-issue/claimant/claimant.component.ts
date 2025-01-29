import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import {
  CountryISO,
  NgxIntlTelephoneInputComponent,
  PhoneNumberFormat,
  SearchCountryField,

} from 'ngx-intl-telephone-input';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { ValidationPattern } from 'src/app/modules/SharedComponent/helper/validator';
import { IssuesService } from 'src/app/services/api/issues.service';
import { Client, ClientNationalType, ClientType, RepresentativeStatus, RepresentativeStatusType } from 'src/app/services/enums/client';
import { DatePipe } from '@angular/common';
import { ClientStaus } from 'src/app/services/enums/lawsuit';
import { NgxIntlTelephoneInputModule } from 'ngx-intl-telephone-input';
import { DateFormatterService, DateType } from 'ngx-hijri-gregorian-datepicker';
@Component({
  selector: 'app-claimant',
  templateUrl: './claimant.component.html',
  styleUrls: ['./claimant.component.scss'],
})
export class ClaimantComponent implements OnInit {
  @ViewChild('phoneInput') phoneInput!: NgxIntlTelephoneInputComponent;

  infoForm: FormGroup;
  hasError: boolean;
  clientStaus = ClientStaus;
  isLoading$: Observable<boolean>;
  private unsubscribe: Subscription[] = [];
  lang: string | null = localStorage.getItem('language');
  clientType = ClientType;
  public CountryISO: any;
  public PhoneNumberFormat: any;
  public SearchCountryField: any;
  public selectedCountryIso: any;
  mobileNumber: any;
  fieldRequired = false;
  isShowOtherRepresentativeStatusType: boolean = false
  newAssigned: any[] = [];
  @Output() bindValue: EventEmitter<any> = new EventEmitter<any>();
  issueDetails: any;
  issueId: any;
  iti: any
  @Input() newStep2: any;
  @Input() newStep1: any;
  ///date 
  expirationDate: any;
  EndDate: any;
  @ViewChild('expirationDatePicker') expirationDatePicker: any;
  representativeStatus = RepresentativeStatus;
  representativeStatusType: any;
  currentUser: any;
  currentDateH: any;
  currentDateG: any;
  selectedDateType = DateType.Hijri;
  minDateG: any;
  minDateH: any;
  nationalType: any;
  otherNational: boolean = false
  isBusinessSector: boolean = false
  dateTextEnd: any;
  dateText: any;
  isShowNationalType: boolean = false;
  isShow: boolean = false;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private _lawsuitManagementService: IssuesService,
    public route: ActivatedRoute,
    private dateFormatter: DateFormatterService,
  ) {
    this.CountryISO = CountryISO;
    this.PhoneNumberFormat = PhoneNumberFormat;
    this.SearchCountryField = SearchCountryField;

    this.currentDateG = this.dateFormatter.GetTodayGregorian();
    this.currentDateH = this.dateFormatter.GetTodayHijri();
    this.minDateG = this.dateFormatter.ToGregorianDateStruct('1800-01-01', 'YYYY-MM-DD');
    this.minDateH = this.dateFormatter.ToGregorianDateStruct('1214-01-01', 'YYYY-MM-DD');
  }

  ngAfterViewChecked() {
    this.lang = localStorage.getItem('language');

    this.cdr.detectChanges();
  }

  selectedDateChange(event: any) {
    if (!this.expirationDate) {
      return;
    }
    let currentDateVal = new Date(this.expirationDatePicker.getSelectedDate());

    const timezoneOffset = currentDateVal.getTimezoneOffset();

    currentDateVal.setMinutes(currentDateVal.getMinutes() + timezoneOffset);
    currentDateVal.setDate(currentDateVal.getDate() + 1);
    this.infoForm.controls.birthDate.setValue(currentDateVal);
    if (this.expirationDatePicker.selectedDateType === DateType.Hijri) {
      this.infoForm.controls.birthDateType.setValue(DateType.Hijri);
    } else {
      this.infoForm.controls.birthDateType.setValue(DateType.Gregorian);
    }
  }

  ngOnInit(): void {
    let val = localStorage.getItem('clientStausForCases');
    if (val == "3") this.isShow = true
    else this.isShow = false;
    localStorage.setItem('step', '2');
    this.initForm();
    this.representativeStatusType = Object.keys(RepresentativeStatusType)
      .filter((key) => !isNaN(Number(RepresentativeStatusType[key as keyof typeof RepresentativeStatusType])))
      .map((key) => ({ id: Number(RepresentativeStatusType[key as keyof typeof RepresentativeStatusType]), name: key }));
    this.nationalType = Object.keys(ClientNationalType)
      .filter((key) => !isNaN(Number(ClientNationalType[key as keyof typeof ClientNationalType])))
      .map((key) => ({ id: Number(ClientNationalType[key as keyof typeof ClientNationalType]), name: key }));
    console.log(this.nationalType)
    this.route.params.subscribe({
      next: (next) => {
        this.issueId = next['id'];
      },
    });
    if (this.issueId) {
      this.getIssueById();
    }

  }

  setValueOfDate() {
    if (this.dateText != undefined) {
      const date1: NgbDate = new NgbDate(
        this.dateText.year,
        this.dateText.month,
        this.dateText.day
      );
      const jsDate1 = new Date(date1.year, date1.month - 1, date1.day);
      let startDate = this.datepipe.transform(jsDate1, 'yyyy-MM-dd');
      this.infoForm.get('birthDate')?.setValue(startDate);
    }
  }
  //init form
  initForm() {
    this.infoForm = this.fb.group({
      id: [],
      clientType: [
        this.clientType.Individual,
        Validators.compose([Validators.required]),
      ],
      name: [null, Validators.compose([Validators.required])],
      birthDate: [null],
      email: [
        null,
        Validators.compose([
          Validators.pattern(ValidationPattern.Email),
        ]),
      ],
      nationalType: [null,],
      otherNational: [null, Validators.compose([Validators.required])],
      commercialRegistrationNumber: [null,],
      nationalId: [
        null,

      ],
      mobileNumber: [null],
      countryCode: [null],
      countryCodeIso: [null],
      nationalAddress: [null],
      birthDateType: [null],
      representativeName: [null,],
      representativeStatusType: [null,],
      otherRepresentativeStatusType: [null],
    });
    this.infoForm.get('clientType')?.valueChanges.subscribe(value => {
      if (value == ClientType.Special) {
        this.isBusinessSector = true
        this.infoForm.get('commercialRegistrationNumber')?.setValidators([Validators.required]);
        this.infoForm.get('commercialRegistrationNumber')?.markAsTouched({ onlySelf: true });
        this.infoForm.get('commercialRegistrationNumber')?.updateValueAndValidity();
      }
      else {
        this.isBusinessSector = false
        this.infoForm.get('commercialRegistrationNumber')?.clearValidators();
        this.infoForm.get('commercialRegistrationNumber')?.updateValueAndValidity();
      }
    });
  }

  nationalTypeEnum = ClientNationalType
  chooseNationalType(event: any) {
    if (event != null) {
      this.isShowNationalType = true
      this.infoForm.get('nationalId')?.markAsTouched({ onlySelf: true });
      this.infoForm.get('nationalId')?.setErrors({ required: true });
      this.infoForm.get('nationalId')?.updateValueAndValidity();
    }

    if (event == this.nationalTypeEnum['addClient.Other']) {
      this.otherNational = true
      this.infoForm.get('otherNational')?.markAsTouched({ onlySelf: true });
      this.infoForm.get('otherNational')?.setErrors({ required: true });
    } else {
      this.otherNational = false
      this.infoForm.get('otherNational')?.clearValidators();
      this.infoForm.get('otherNational')?.updateValueAndValidity();
    }
  }

  //get case details
  getIssueById() {

    this.spinner.show();
    this._lawsuitManagementService.getLawsuitDetails(this.issueId).subscribe({
      next: (next) => {

        this.issueDetails = next.data;
        console.log(this.issueDetails)
        if (this.issueDetails.birthDate) {
          let currentDate = this.issueDetails.birthDate.substring(0, 10);
          if (this.infoForm.get('birthDateType')?.value) {
            if (this.infoForm.get('birthDateType')?.value === DateType.Gregorian) {
              this.selectedDateType = DateType.Gregorian;
            } else {
              this.selectedDateType = DateType.Hijri;
            }
          } else {
            this.infoForm.get('birthDateType')?.setValue(DateType.Hijri);
          }
          if (currentDate) {
            if (this.infoForm.get('birthDateType')?.value == DateType.Gregorian) {
              this.expirationDate = this.dateFormatter.ToGregorianDateStruct(
                currentDate,
                'YYYY-MM-DD'
              );
            } else {
              this.expirationDate = this.dateFormatter.ToHijriDateStruct(currentDate, 'YYYY-MM-DD');
            }
          } else {
            this.expirationDate = this.dateFormatter.ToHijriDateStruct(currentDate, 'YYYY-MM-DD');
          }

          this.infoForm.get('birthDate')?.setValue(currentDate);
        }
        if (this.issueDetails.plaintiffs != null) {
          this.newAssigned = next.data.plaintiffs;
        } else {
          this.newAssigned = [];
        }
        if (!this.issueDetails.isDraft) {
          if (this.newStep2) {
            this.newAssigned = this.newStep2;
          }
        }
        let obj: any = {};
        if (this.newStep1) {


          obj.clientStaus = this.newStep1.clientStaus;

          obj.clientResponseDto = this.newStep1.clientResponseDto
        }
        this.issueDetails = { ...this.issueDetails, ...obj }


        this.cdr.detectChanges();
        this.spinner.hide();
      },
    });
  }

  //add plaintiff
  addPlaintiff() {
    if (this.infoForm.get('nationalType')?.value == null) {
      this.infoForm.get('nationalId')?.clearValidators();
      this.infoForm.get('nationalId')?.updateValueAndValidity();
      this.infoForm.get('otherNational')?.clearValidators();
      this.infoForm.get('otherNational')?.updateValueAndValidity();
    }
    let value = this.infoForm.get('clientType')?.value;
    if (value == ClientType.Special) {
      this.isBusinessSector = true
      this.infoForm.get('commercialRegistrationNumber')?.setValidators(null);
      this.infoForm.get('commercialRegistrationNumber')?.markAsTouched({ onlySelf: true });
      this.infoForm.get('commercialRegistrationNumber')?.updateValueAndValidity();
    }
    else {
      this.isBusinessSector = false
      this.infoForm.get('commercialRegistrationNumber')?.clearValidators();
      this.infoForm.get('commercialRegistrationNumber')?.updateValueAndValidity();
    }
    if (this.infoForm.invalid) {
      Object.keys(this.infoForm.controls).forEach((field) => {
        // {1}
        const control = this.infoForm.get(field); // {2}
        control?.markAsTouched({ onlySelf: true }); // {3}
      });
      return;
    }
    this.newAssigned.push(this.infoForm.value);
    console.log(this.newAssigned)

    this.infoForm.reset();
    if (this.phoneInput) {
      this.phoneInput.phoneNumber = null; // Call the reset method if available
    }

    this.mobileNumber = null

    this.fieldRequired = false;
  }
  //detete row
  deleteRow(index: number) {
    this.newAssigned.splice(index, 1);
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

  chooseRepresentativeStatusType(event: any) {
    if (event == "7") {
      this.isShowOtherRepresentativeStatusType = true
    } else {
      this.isShowOtherRepresentativeStatusType = false
      this.infoForm.get('otherRepresentativeStatusType')?.setValue(null)
    }
  }
  //save
  submit() {

    if (this.newAssigned.length > 0) {
      this.spinner.show();
      if (this.issueId) {
        if (this.issueDetails?.isDraft) {
          this._lawsuitManagementService
            .addPlaintiff({ id: this.issueId, plaintiffs: this.newAssigned })
            .subscribe({
              next: (next) => {
                this.spinner.hide();
                if (next.success) {
                  this.bindValue.emit({
                    isSuccess: next.success,
                    isBack: false,
                  });
                } else {
                  this.spinner.hide();
                  this.bindValue.emit({
                    isSuccess: next.success,
                  });
                  this.toastr.info(next.message);
                }
              },
              error: (error) => {
                this.spinner.hide();
                this.toastr.error(error.error.error.message);
              },
            });
        } else {
          this.bindValue.emit({
            isSuccess: true,
            isBack: false,
            data: this.newAssigned,
          });
        }
      }
    } else if (this.issueDetails?.clientStaus === this.clientStaus.Plaintiff) {
      this.bindValue.emit({
        isSuccess: true,
      });
    } else {
      this.fieldRequired = true;
    }
  }
  //back to second step
  Back() {
    this.bindValue.emit({
      isBack: true,
    });
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
