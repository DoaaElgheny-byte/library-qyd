import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DateFormatterService, DateType } from 'ngx-hijri-gregorian-datepicker';
import {
  CountryISO,
  PhoneNumberFormat,
  SearchCountryField,
} from 'ngx-intl-telephone-input';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { AppConfirmService } from 'src/app/modules/SharedComponent/SharedComponent/app-confirm/app-confirm.service';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';
import { ValidationPattern } from 'src/app/modules/SharedComponent/helper/validator';
import { AuthService } from 'src/app/modules/auth';
import { Constants } from 'src/app/services/Constants/constants';
import { ClientService } from 'src/app/services/api/client.service';
import { AccountState, ClientNationalType, ClientType, RepresentativeStatus, RepresentativeStatusType } from 'src/app/services/enums/client';
import { NationalType } from 'src/app/services/enums/lawsuit';
import { Payment } from 'src/app/services/enums/payment-conditions.enum';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-edit-client',
  templateUrl: './add-edit-client.component.html',
  styleUrls: ['./add-edit-client.component.scss'],
})
export class AddEditClientComponent implements OnInit {
  infoForm: FormGroup;
  filesForm: FormGroup;
  hasError: boolean;
  isLoading$: Observable<boolean>;
  private unsubscribe: Subscription[] = [];
  lang: string | null = localStorage.getItem('language');
  clientType = ClientType;
  accountState = AccountState;
  successLoaded = false;
  clientId: any;
  clientDetails: any;
  nationalType: any;
  nationalTypeEnum = ClientNationalType
  public CountryISO: any;
  public PhoneNumberFormat: any;
  public SearchCountryField: any;
  public selectedCountryIso: any;
  mobileNumber: any;
  branches: any;
  classes: any;
  isShowNationalType: boolean = false;
  isShowOtherRepresentativeStatusType: boolean = false;


  ///date
  expirationDate: any;
  EndDate: any;
  @ViewChild('expirationDatePicker') expirationDatePicker: any;

  isEmployee: boolean;
  currentUser: any;
  currentDateH: any;
  currentDateG: any;
  initialDate: any;
  initialDateHijri: any
  selectedDateType = DateType.Hijri;
  minDateH: any;
  minDateG: any;
  otherNational: boolean = false
  others: boolean = false
  isIdNoVisible: boolean = true;
  dateTextEnd: any;
  dateText: any;
  classificationRepeated: boolean;
  attachmentFileInfoArray: {
    id: any;
    classificationName: string;
    imageName: string;
    imageStorageFileName: string;
    imageStorageFileURL: string;
    clientClassificationAttachmentId: number;
    others: string;
    clientClassificationAttachment: string;
    imageURL: string | null
  }[] = [];
  fileName: any;
  fileStorageFileName: any;
  fieldRequired = false;
  fileErrorMessage: String = '';
  representativeStatus = RepresentativeStatus;
  representativeStatusType: any;
  isAddNewClientFromProject
  constructor(
    private dateFormatter: DateFormatterService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private _clientService: ClientService,
    public route: ActivatedRoute,
    private router: Router,
    public datepipe: DatePipe,
    private authService: AuthService,
    private translate: TranslateService,
    private breadcrumbService: BreadcrumbService,
    private appconfirmservice: AppConfirmService
  ) {
    this.isAddNewClientFromProject = localStorage.getItem('addNewClientFromProject')

    this.getCondition()
    this.CountryISO = CountryISO;
    this.PhoneNumberFormat = PhoneNumberFormat;
    this.SearchCountryField = SearchCountryField;

    this.currentDateG = this.dateFormatter.GetTodayGregorian();
    this.currentDateH = this.dateFormatter.GetTodayHijri();
    this.minDateG = this.dateFormatter.ToGregorianDateStruct('1800-01-01', 'YYYY-MM-DD');
    this.minDateH = this.dateFormatter.ToGregorianDateStruct('1214-01-01', 'YYYY-MM-DD');

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


  getCondition() {
    let packageCondition = window.localStorage.getItem(
      'condtions-to-current-user'
    );

    let packageData: any = JSON.parse(packageCondition!);
    if (packageData.paymentType == Payment.Expired) {
      this.router.navigate(['/agent/error-package'], {
        queryParams: { key: 'Expired' },
      });
    }
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser.roles[0] == Constants.AllRoles.employee) {
      this.isEmployee = true;
    } else {
      this.isEmployee = false;
    }
    this.nationalType = Object.keys(ClientNationalType)
      .filter((key) => !isNaN(Number(ClientNationalType[key as keyof typeof ClientNationalType])))
      .map((key) => ({ id: Number(ClientNationalType[key as keyof typeof ClientNationalType]), name: key }));
    this.breadcrumbService.restoreBreadcrumbsFromStorage();
    this.representativeStatusType = Object.keys(RepresentativeStatusType)
      .filter((key) => !isNaN(Number(RepresentativeStatusType[key as keyof typeof RepresentativeStatusType])))
      .map((key) => ({ id: Number(RepresentativeStatusType[key as keyof typeof RepresentativeStatusType]), name: key }));
    this.getBranchList();
    this.route.params.subscribe({
      next: (next) => {
        this.clientId = next['id'];
      },
    });
    this.initfileForm();

    if (this.clientId) {
      this.getClientById();
    } else {
      this.initForm();
      this.getClassification(this.clientType.Special);

      this.successLoaded = true;
    }
    this.checkOfType();
  }

  getBranchList() {
    this._clientService.getBranchesList().subscribe({
      next: (next) => {
        this.branches = next.data;
        console.log(this.branches)
        this.cdr.detectChanges();
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

  chooseNationalType(event: any) {

    if (event != null) {
      this.isShowNationalType = true
      this.infoForm.get('nationalId')?.markAsTouched({ onlySelf: true });
      this.infoForm.get('nationalId')?.setErrors({ required: false });
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

  getClientById() {

    this._clientService.getClientDetails(this.clientId).subscribe({
      next: (next) => {
        this.clientDetails = next.data;
        console.log(this.clientDetails)
        const indexOfS = Object.values(this.CountryISO).indexOf(
          this.clientDetails.countryCodeIso as unknown as CountryISO
        );
        const key = Object.keys(this.CountryISO)[indexOfS];
        this.selectedCountryIso = key;

        this.initForm();
        this.chooseRepresentativeStatusType(next.data.representativeStatusType);
        this.infoForm.patchValue(this.clientDetails);
        if (next.data.nationalType == null)
          this.isShowNationalType = false
        else
          this.isShowNationalType = true;

        if (this.clientDetails.birthDate) {
          let currentDate = this.clientDetails.birthDate.substring(0, 10);
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


        this.mobileNumber = this.clientDetails.mobileNumber;
        this.checkOfType();
        if (this.clientDetails.files != null) {
          this.attachmentFileInfoArray = this.clientDetails.files;
        } else {
          this.attachmentFileInfoArray = [];
        }
        this.chooseNationalType(this.clientDetails.nationalType)
        this.successLoaded = true;
        this.cdr.detectChanges();
      },
    });
  }

  initForm() {
    this.infoForm = this.fb.group({
      id: [],
      type: [
        this.clientType.Special,
        Validators.compose([Validators.required]),
      ],
      state: [this.accountState.Active, Validators.compose([Validators.required])],
      name: [null, Validators.compose([Validators.required])],
      representativeName: [null,],
      representativeStatusType: [null,],
      otherRepresentativeStatusType: [null],

      nationalId: [
        null,
      ],
      nationalType: [null,],
      otherNational: [null, Validators.compose([Validators.required])],
      birthDate: [null,],
      email: [
        null,
        Validators.compose([
          Validators.pattern(ValidationPattern.Email),
        ]),
      ],
      mobileNumber: [null],
      countryCode: [null,],
      countryCodeIso: [null,],
      branchId: [null, Validators.compose([Validators.required])],
      nationalAddress: [null],
      commercialName: [null,],

      commercialRegistrationNo: [
        null,

      ],
      vatRegistrationNumber: [
        null,

      ],
      files: [null],
      branch: [],
      birthDateType: [null],


    });
    this.infoForm.get('type')?.valueChanges.subscribe((type) => {
      this.getClassification(type)
    });

    if (this.isEmployee) {
      this.infoForm.get('state')?.disable()
    } else {
      this.infoForm.get('state')?.enable()
    }
  }

  checkOfType() {

    let type = this.infoForm.get('type')?.value;
    if (type != ClientType.Individual)
      this.isIdNoVisible = false
    else this.isIdNoVisible = true
    this.getClassification(type);
  }

  getClassification(type: number) {
    this._clientService.getClassification(type).subscribe({
      next: (next) => {
        this.classes = next.data;
        if (this.infoForm.controls['type'].value == ClientType.Individual) {
          this.classes = this.classes.filter((item: any) => item.id !== 12 && item.id !== 13);
        }
        this.cdr.detectChanges();
      },
    });
  }

  checkRepeatClassification() {
    this.fieldRequired = false;
    const currentClassificationId = this.filesForm.get('clientClassificationAttachmentId')?.value;
    if (currentClassificationId == '14') {
      this.classificationRepeated = false;
      return; // exit the function
    }
    const repeated = this.attachmentFileInfoArray.some(
      (x: any) => x.clientClassificationAttachmentId == currentClassificationId
    );
    this.classificationRepeated = repeated;
  }

  initfileForm() {
    this.filesForm = this.fb.group({
      clientClassificationAttachmentId: [
        null,
        Validators.compose([Validators.required]),
      ],
      others: [null, Validators.compose([Validators.required])],
      attachment: [null, Validators.compose([Validators.required])],
    });
    this.filesForm.get('clientClassificationAttachmentId')?.valueChanges.subscribe(value => {
      console.log({ value })
      if (value == '14') {
        this.others = true
        this.filesForm.get('others')?.setValidators([Validators.required]);
        this.filesForm.get('others')?.markAsTouched({ onlySelf: true });
        this.filesForm.get('others')?.updateValueAndValidity();
      }
      else {
        this.others = false
        this.filesForm.get('others')?.clearValidators();
        this.filesForm.get('others')?.updateValueAndValidity();
      }
    });

  }

  //upload file of info
  uploadImg(data: any) {
    this.fileName = data.fileName;
    this.fileStorageFileName = data.storageFileName;
    this.filesForm.get('attachment')?.setValue(data.storageFileName);
  }

  //addAttachment of info
  addAttachmentInfo() {
    if (this.filesForm.invalid) {
      Object.keys(this.filesForm.controls).forEach((field) => {
        // {1}
        const control = this.filesForm.get(field); // {2}
        control?.markAsTouched({ onlySelf: true }); // {3}
      });
      return;
    }
    let className = this.classes.filter(
      (x: any) =>
        x.id == this.filesForm.get('clientClassificationAttachmentId')?.value
    )[0];
    this.attachmentFileInfoArray.push({
      id: 0,
      classificationName:
        this.lang === 'ar' ? (className?.nameAr || '') : (className?.nameEn || ''),
      imageName: this.fileName,
      imageStorageFileName: this.fileStorageFileName,
      imageStorageFileURL:
        environment.BlobUrl +
        this.fileStorageFileName,
      clientClassificationAttachmentId: this.filesForm.get(
        'clientClassificationAttachmentId'
      )?.value,
      others: this.filesForm.get(
        'others'
      )?.value,
      clientClassificationAttachment:
        this.lang === 'ar' ? (className?.nameAr || '') : (className?.nameEn || ''),
      imageURL: null,
    });
    this.fileName = null;
    this.fileStorageFileName = null;
    this.filesForm.reset();
    this.checkFilesRequired();
  }

  //delete row of info table
  deleteRow(row: {
    id: any;
    classificationName: string;
    imageName: string;
    imageStorageFileName: string;
    imageStorageFileURL: string;
    others: string;
    clientClassificationAttachmentId: number;
    clientClassificationAttachment: string;
    imageURL: string | null
  }) {
    const index = this.attachmentFileInfoArray.indexOf(row);
    if (index > -1) {
      this.attachmentFileInfoArray.splice(index, 1);
    }
  }

  Back() {
    this.router.navigate(['/agent/departments/clients']);
  }

  checkFilesRequired() {
    this.fileErrorMessage = '';
    this.classes.forEach((element: any) => {
      let row = this.attachmentFileInfoArray.findIndex(
        (i: any) => i.clientClassificationAttachmentId == element.id
      );
      if (row === -1) {
        this.fileErrorMessage +=
          this.lang === 'ar'
            ? `يجب رفع  ${element.nameAr} \n`
            : `you must upload ${element.nameEn}\n`;
      }
    });
  }

  submit() {

    this.checkFilesRequired();
    if (this.infoForm.get('nationalType')?.value == null) {
      this.infoForm.get('nationalId')?.clearValidators();
      this.infoForm.get('nationalId')?.updateValueAndValidity();
      this.infoForm.get('otherNational')?.clearValidators();
      this.infoForm.get('otherNational')?.updateValueAndValidity();
    }
    if (this.infoForm.get('type')?.value === this.clientType.Individual) {
      this.infoForm.get('commercialRegistrationNo')?.clearValidators();
      this.infoForm.get('commercialRegistrationNo')?.updateValueAndValidity();
      this.infoForm.get('commercialName')?.clearValidators();
      this.infoForm.get('commercialName')?.updateValueAndValidity();
      this.infoForm.get('vatRegistrationNumber')?.clearValidators();
      this.infoForm.get('vatRegistrationNumber')?.updateValueAndValidity();
      this.infoForm.get('representativeName')?.clearValidators();
      this.infoForm.get('representativeName')?.updateValueAndValidity();
      this.infoForm.get('files')?.setValue(this.attachmentFileInfoArray);
      this.fieldRequired = false;
    } else if (this.infoForm.get('type')?.value === this.clientType.Special) {
      this.infoForm.get('files')?.setValue(this.attachmentFileInfoArray);
      this.fieldRequired = false;
    }

    if (this.infoForm.invalid) {
      Object.keys(this.infoForm.controls).forEach((field) => {
        // {1}
        const control = this.infoForm.get(field); // {2}
        control?.markAsTouched({ onlySelf: true }); // {3}
      });
      return;
    }

    if (this.infoForm.valid) {
      //check Files
      this.spinner.show();
      if (this.clientId) {
        this._clientService.editClient(this.infoForm.value).subscribe({
          next: (next) => {
            this.spinner.hide();
            if (next.success) {

              this.appconfirmservice.confirm(
                this.translate.instant('addClient.editSuccessfuly'), '',
                '/assets/imgs/confirm/add.svg'
              );
            } else {
              this.appconfirmservice.confirm(
                next.message, '',
                '/assets/imgs/confirm/warning.svg',
                false
              );
            }
          },
          error: (error) => {
            this.spinner.hide();

            this.appconfirmservice.confirm(
              error.error.error.message, '',
              '/assets/imgs/confirm/warning.svg',
              false
            );
          },
        });
      } else {
        this._clientService.addClient(this.infoForm.value).subscribe({
          next: (next) => {
            this.spinner.hide();
            if (next.success) {

              if (localStorage.getItem('AddNewClientFromProject') == 'true') {

                this.route.queryParams.subscribe(params => {
                  this.router.navigate(['../../project-management/add-edit-project/' + params['step2Id']], { relativeTo: this.route });
                  localStorage.removeItem('addNewClientFromProject')
                });
              } else {
                this.appconfirmservice.confirm(
                  this.translate.instant('addClient.addSuccessfuly'), '',
                  '/assets/imgs/confirm/add.svg'
                );
              }
            } else {
              this.appconfirmservice.confirm(
                next.message, '',
                '/assets/imgs/confirm/warning.svg',
                false
              );
            }
          },
          error: (error) => {
            this.spinner.hide();

            this.appconfirmservice.confirm(
              error.error.error.message, '',
              '/assets/imgs/confirm/warning.svg',
              false
            );
          },
        });
      }
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
  ngOnDestroy() {
    localStorage.removeItem('addNewClientFromProject')
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }


  backToProject() {
    this.route.queryParams.subscribe(params => {
      this.router.navigate(['../../project-management/add-edit-project/' + params['step2Id']], { relativeTo: this.route });
      localStorage.removeItem('addNewClientFromProject')
    });
  }

}
