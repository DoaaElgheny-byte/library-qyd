import { DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DateFormatterService, DateType } from 'ngx-hijri-gregorian-datepicker';
import {
  CountryISO,
  PhoneNumberFormat,
  SearchCountryField,
} from 'ngx-intl-telephone-input';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription, forkJoin } from 'rxjs';
import { AppConfirmService } from 'src/app/modules/SharedComponent/SharedComponent/app-confirm/app-confirm.service';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';
import { ConfirmationDialogService } from 'src/app/modules/SharedComponent/SharedComponent/confirmation-dialog/confirmation-dialog.service';
import { ValidationPattern } from 'src/app/modules/SharedComponent/helper/validator';
import { AuthService } from 'src/app/modules/auth';
import { BranchesService } from 'src/app/services/api/branches.service';
import { EmployeeManagementService } from 'src/app/services/api/employee-management.service';
import { AttachmentType } from 'src/app/services/enums/branches-state.enum';
import {
  ConditionType,
  Payment,
} from 'src/app/services/enums/payment-conditions.enum';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-edit-employee',
  templateUrl: './add-edit-employee.component.html',
  styleUrls: ['./add-edit-employee.component.scss'],
})
export class AddEditEmployeeComponent implements OnInit, OnDestroy {
  id: string;
  public Branches: any[];
  public form: FormGroup = new FormGroup({});
  public lang: string = String(localStorage.getItem('language'));
  successLoad = true;
  public SportList: any = [];
  public dropdownSettings: IDropdownSettings = {};
  all = this.lang === 'ar' ? 'الكل' : 'All';
  unall = this.lang === 'ar' ? 'إلغاء الكل' : 'UnSelect All';
  public CountryISO: any;
  public PhoneNumberFormat: any;
  public SearchCountryField: any;
  public selectedCountryIso: any;
  mobileNumber: any;
  choosenBranchs: any;
  dateTextEnd: any;
  dateText: any;
  changedBranchs: any;
  removedBranchs: any;
  ///date
  expirationDate: any;
  EndDate: any;
  @ViewChild('expirationDatePicker') expirationDatePicker: any;
  @ViewChild('EndDatePicker') EndDatePicker: any;

  currentDateH: any;
  currentDateG: any;
  selectedDateType = DateType.Hijri;
  selectedEndDateType = DateType.Hijri;
  minDateH: any;
  minDateG: any;
  constructor(
    private dateFormatter: DateFormatterService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private _employeeManagementService: EmployeeManagementService,
    private _branchesService: BranchesService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    public datepipe: DatePipe,
    private route: ActivatedRoute,
    private appconfirmservice: AppConfirmService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private authService: AuthService,
    private confirmationService: ConfirmationDialogService
  ) {
    this.minDateG = this.dateFormatter.ToGregorianDateStruct('1800-01-01', 'YYYY-MM-DD');
    this.minDateH = this.dateFormatter.ToGregorianDateStruct('1214-01-01', 'YYYY-MM-DD');

    this.route.params.subscribe({
      next: (next) => {
        this.id = next['id'];
      },
    });
    this.getCondition();
    this.CountryISO = CountryISO;
    this.PhoneNumberFormat = PhoneNumberFormat;
    this.SearchCountryField = SearchCountryField;
    this.currentDateG = this.dateFormatter.GetTodayGregorian();
    this.currentDateH = this.dateFormatter.GetTodayHijri();
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
      // } else {
      //   let condition = packageData.getConditions.find(
      //     (i: any) => i.conditionType == ConditionType.EmployeeManagment
      //   );
      //   if (condition.updateValue === 0 && !this.id) {
      //     this.router.navigate(['/agent/error-package'], {
      //       queryParams: { key: 'Finish' },
      //     });
      //   }
    }
  }
  ngOnInit(): void {
    this.breadcrumbService.restoreBreadcrumbsFromStorage();
    this.initForm();
    this.getData();
    this.initfileForm();
    this.getClassification();

    if (this.id) {
      setTimeout(() => {
        this.getPlayerById();
      }, 1000);
    } else {
      this.initForm();
      this.successLoad = true;
    }
  }
  public onInputChange(event: any) {
    if (event.isNumberValid) {
      this.form
        .get('mobileNumber')
        ?.setValue(
          event.phoneNumber.replace(/\s/g, '').split('+' + event.dialCode)[1]
        );
      this.form.get('countryCode')?.setValue(event.dialCode);
      this.form.get('countryCodeIso')?.setValue(event.iso2Code);
    } else {
      this.form.get('mobileNumber')?.markAsTouched({ onlySelf: true });
      this.form.get('mobileNumber')?.setErrors({ required: true });
    }
  }
  initForm() {
    this.form = this.fb.group({
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(200),
        ],
      ],
      jobTitle: [null],
      countryCodeIso: ['sa'],
      countryCode: [null],
      mobileNumber: [
        null,

      ],
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(ValidationPattern.Email),
        ]),
      ],
      authorizationNo: [
        null,
        Validators.compose([Validators.pattern(ValidationPattern.Mobile)]),
      ],
      startAuthorizationDate: [null, Validators.compose([])],
      endAuthorizationDate: [null, Validators.compose([])],
      branchs: [null, Validators.compose([Validators.required])],

      files: [null],
      startDateType: [null],
      endDateType: [null],
    });
  }
  selectedDateChange(event: any) {
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
      this.form.controls.startAuthorizationDate.setValue(currentDateVal);
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
        this.form.controls.startAuthorizationDate.setValue(currentDateVal);
        this.endAfterStart = true;
      } else {
        this.expirationDate = null;
        this.endAfterStart = false;
      }
    }
    if (this.expirationDatePicker.selectedDateType === DateType.Hijri) {
      this.form.controls.startDateType.setValue(DateType.Hijri);
    } else {
      this.form.controls.startDateType.setValue(DateType.Gregorian);
    }
  }
  selectedDateChangeEnd(event: any) {
    if (!this.EndDate) {
      return;
    }
    if (!this.expirationDate) {
      let currentDateVal = new Date(this.EndDatePicker.getSelectedDate());

      const timezoneOffset = currentDateVal.getTimezoneOffset();

      currentDateVal.setMinutes(currentDateVal.getMinutes() + timezoneOffset);
      currentDateVal.setDate(currentDateVal.getDate() + 1);
      this.form.controls.endAuthorizationDate.setValue(currentDateVal);
    } else {
      if (
        this.expirationDatePicker.getSelectedDate() <
        this.EndDatePicker.getSelectedDate()
      ) {
        let currentDateVal = new Date(this.EndDatePicker.getSelectedDate());

        const timezoneOffset = currentDateVal.getTimezoneOffset();

        currentDateVal.setMinutes(currentDateVal.getMinutes() + timezoneOffset);
        currentDateVal.setDate(currentDateVal.getDate() + 1);
        this.form.controls.endAuthorizationDate.setValue(currentDateVal);
        this.endAfterStart = true;
      } else {
        this.EndDate = null;
        this.endAfterStart = false;
      }
    }
    if (this.EndDatePicker.selectedDateType === DateType.Hijri) {
      this.form.controls.endDateType.setValue(DateType.Hijri);
    } else {
      this.form.controls.endDateType.setValue(DateType.Gregorian);
    }
  }
  //add start date
  setValueOfDate() {
    if (this.dateTextEnd != undefined) {
      const jsDate1 = new Date(
        this.dateText.year,
        this.dateText.month - 1,
        this.dateText.day + 1
      );

      const jsDate2 = new Date(
        this.dateTextEnd.year,
        this.dateTextEnd.month - 1,
        this.dateTextEnd.day + 1
      );
      if (jsDate1 < jsDate2) {
        this.form.get('startAuthorizationDate')?.setValue(jsDate1);
        this.form.get('endAuthorizationDate')?.setValue(jsDate2);

        this.endAfterStart = true;
      } else {
        this.dateText = null;
        this.endAfterStart = false;
      }
    } else {
      const jsDate1 = new Date(
        this.dateText.year,
        this.dateText.month - 1,
        this.dateText.day + 1
      );
      this.form.get('startAuthorizationDate')?.setValue(jsDate1);
      this.endAfterStart = true;
    }
  }
  endAfterStart: boolean = true;
  //add End date
  setValueOfDateEnd() {
    if (this.dateText != undefined) {
      const jsDate1 = new Date(
        this.dateText.year,
        this.dateText.month - 1,
        this.dateText.day + 1
      );

      const jsDate2 = new Date(
        this.dateTextEnd.year,
        this.dateTextEnd.month - 1,
        this.dateTextEnd.day + 1
      );
      if (jsDate1 < jsDate2) {
        this.form.get('endAuthorizationDate')?.setValue(jsDate2);
        this.form.get('startAuthorizationDate')?.setValue(jsDate1);

        this.endAfterStart = true;
      } else {
        this.endAfterStart = false;
        this.dateTextEnd = null;
      }
    } else {
      const jsDate2 = new Date(
        this.dateTextEnd.year,
        this.dateTextEnd.month - 1,
        this.dateTextEnd.day + 1
      );
      this.form.get('endAuthorizationDate')?.setValue(jsDate2);
      this.endAfterStart = true;
    }
  }
  getData() {
    forkJoin([this._branchesService.getEmployeeBranch()]).subscribe({
      next: ([Branches]) => {
        this.Branches = Branches.data;
        this.Branches.map((i: any) => {
          (i.branchId = i.id), (i.id = 0);
        });

        this.spinner.hide();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.spinner.hide();
      },
    });
  }

  getPlayerById() {
    this.spinner.show();
    this._employeeManagementService.getEmplyeeDetails(this.id).subscribe({
      next: (next) => {
        const indexOfS = Object.values(this.CountryISO).indexOf(
          next.data.countryCodeIso as unknown as CountryISO
        );

        const key = Object.keys(this.CountryISO)[indexOfS];
        this.selectedCountryIso = key;
        this.mobileNumber = next.data.mobileNumber;
        this.initForm();
        this.form.patchValue(next.data);
        if (this.form.get('startDateType')?.value) {
          if (this.form.get('startDateType')?.value === DateType.Gregorian) {
            this.selectedDateType = DateType.Gregorian;
          } else {
            this.selectedDateType = DateType.Hijri;
          }
        } else {
          this.form.get('startDateType')?.setValue(DateType.Hijri);
        }
        if (this.form.get('endDateType')?.value) {
          if (this.form.get('endDateType')?.value === DateType.Gregorian) {
            this.selectedEndDateType = DateType.Gregorian;
          } else {
            this.selectedEndDateType = DateType.Hijri;
          }
        } else {
          this.form.get('endDateType')?.setValue(DateType.Hijri);
        }
        //startDate
        if (next.data.startAuthorizationDate) {
          let currentDate = next.data.startAuthorizationDate.substring(0, 10);

          if (currentDate) {
            if (this.form.get('startDateType')?.value == DateType.Gregorian) {
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
          this.form.get('startAuthorizationDate')?.setValue(currentDate);
        }

        //endDate
        if (next.data.endAuthorizationDate) {
          let endOfDate = next.data.endAuthorizationDate.substring(0, 10);

          if (endOfDate) {
            if (this.form.get('endDateType')?.value === DateType.Gregorian) {
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
          this.form.get('endAuthorizationDate')?.setValue(endOfDate);
        }

        //attachment
        if (next.data.files != null) {
          this.attachmentFileInfoArray = next.data.files;
        } else {
          this.attachmentFileInfoArray = [];
        }
        //branches
        if (next.data.branchs != null) {
          this.choosenBranchs = next.data.branchs;
          const selectedIds = this.choosenBranchs.map(
            (branch: any) => branch.branchId
          );
          this.form.get('branchs')?.patchValue(selectedIds);
        } else {
          this.choosenBranchs = [];
        }

        this.Branches.forEach((x: any) => {
          next.data.branchs.forEach((y: any) => {
            if (y.branchId === x.branchId) x.id = y.id;
          });
        });

        this.successLoad = true;

        this.spinner.hide();

        this.cdr.detectChanges();
      },
    });
  }

  getBranchesChanged(e: any) {
    this.changedBranchs = e;
  }
  //if remove one by one
  finalBranchesEdit: any;
  getRemovedBranch(e: any) {
    this.removedBranchs = e.value.branchId;
    if (e && this.id) {
      this._employeeManagementService
        .confirmDeleteEmployeeBranch(this.id, this.removedBranchs)
        .subscribe({
          next: (next) => {
            if (next.success) {
              this.finalBranchesEdit = this.changedBranchs;
              this.confirmDelete(this.removedBranchs);
            } else {
              this.confirmDeleteBranch(this.removedBranchs);
            }
          },
        });
    }
  }
  //confirmToDeleteranch
  confirmDelete(branchId: any) {
    this.confirmationService
      .confirm(
        this.translate.instant('emplyeeEditAdd.confirmModalTitle'),
        this.translate.instant('emplyeeEditAdd.confirmDelteBranch'),
        '',
        false
      )
      .then(
        (confirmed: any) => {
          this.spinner.show();

          if (confirmed) {
            this.DeleteBranch(branchId);
            this.spinner.hide();
          } else {
            this.finalBranchesEdit = this.choosenBranchs;
            const selectedIds = this.finalBranchesEdit.map(
              (branch: any) => branch.branchId
            );

            this.form.get('branchs')?.patchValue(selectedIds);
            this.spinner.hide();
            this.cdr.detectChanges();
          }
        },
        () => {
          this.finalBranchesEdit = this.choosenBranchs;
          const selectedIds = this.finalBranchesEdit.map(
            (branch: any) => branch.branchId
          );

          this.form.get('branchs')?.patchValue(selectedIds);
          this.spinner.hide();
        }
      );
  }
  //confirm delete or not
  confirmDeleteBranch(branchId: any) {
    this.confirmationService
      .confirm(
        this.translate.instant('emplyeeEditAdd.confirmModalTitle'),
        this.translate.instant('emplyeeEditAdd.confirmDelte'),
        '',
        false
      )
      .then(
        (confirmed: any) => {
          this.spinner.show();

          if (confirmed) {
            this.finalBranchesEdit = this.changedBranchs;
            const selectedIds = this.finalBranchesEdit.map(
              (branch: any) => branch.branchId
            );

            this.form.get('branchs')?.patchValue(selectedIds);

            this.DeleteBranch(branchId);
            this.spinner.hide();
          } else {
            this.finalBranchesEdit = this.choosenBranchs;
            const selectedIds = this.finalBranchesEdit.map(
              (branch: any) => branch.branchId
            );

            this.form.get('branchs')?.patchValue(selectedIds);
            this.spinner.hide();

            this.cdr.detectChanges();
          }
        },
        () => {
          this.finalBranchesEdit = this.choosenBranchs;
          const selectedIds = this.finalBranchesEdit.map(
            (branch: any) => branch.branchId
          );

          this.form.get('branchs')?.patchValue(selectedIds);
          this.cdr.detectChanges();
          this.spinner.hide();
        }
      );
  }
  //delete branch
  DeleteBranch(branchId: any) {
    this._employeeManagementService
      .deleteEmployeeBranch(this.id, branchId)
      .subscribe({
        next: (next) => {
          if (next.success) {
            this.appconfirmservice.confirm(
              this.translate.instant('emplyeeEditAdd.deleteuccess'),
              '',
              '/assets/imgs/confirm/add.svg',
              false
            );
          } else {
            this.appconfirmservice.confirm(
              this.translate.instant(next.message),
              '',
              '/assets/imgs/confirm/warning.svg',
              false
            );
          }
        },
      });
  }
  /*attachment part */
  classes: any;
  filesForm: FormGroup;
  getClassification() {
    this._employeeManagementService.getClassification().subscribe({
      next: (next) => {
        this.classes = next.data;
        this.cdr.detectChanges();
      },
    });
  }
  classificationRepeated: boolean;
  disableOther: boolean = true;
  AttachmentType = AttachmentType;

  checkRepeatClassification() {
    let otherValue = this.classes.filter(
      (x: any) => x.classificationType === AttachmentType.Other
    )[0].id;

    if (
      this.filesForm.get('employeeClassificationAttachmentId')?.value ==
      otherValue
    ) {
      this.disableOther = false;
      this.filesForm
        .get('classificationName')
        ?.setValidators([Validators.required]);
      this.filesForm.get('classificationName')?.updateValueAndValidity();
    } else {
      this.filesForm.get('classificationName')?.setValue(null);
      this.disableOther = true;
      this.filesForm.get('classificationName')?.setValidators(null);
      this.filesForm.get('classificationName')?.updateValueAndValidity();
      let repeated = this.attachmentFileInfoArray.filter(
        (x: any) =>
          x.employeeClassificationAttachmentId ==
          this.filesForm.get('employeeClassificationAttachmentId')?.value
      )[0];
      if (repeated) {
        this.classificationRepeated = true;
      } else {
        this.classificationRepeated = false;
      }
    }
  }
  /**Attachment form */
  attachmentFileInfoArray: {
    id: any;
    classificationName: string;
    imageName: string;
    imageStorageFileName: string;
    imageStorageFileURL: string;
    employeeClassificationAttachmentId: number;
    employeeClassificationAttachment: string;
    imageURL: string | null;
  }[] = [];
  fileName: any;
  fileStorageFileName: any;
  fieldRequired = false;

  initfileForm() {
    this.filesForm = this.fb.group({
      employeeClassificationAttachmentId: [
        null,
        Validators.compose([Validators.required]),
      ],
      attachment: [null, Validators.compose([Validators.required])],
      classificationName: [null, Validators.compose([Validators.required])],
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
        x.id == this.filesForm.get('employeeClassificationAttachmentId')?.value
    )[0];
    this.attachmentFileInfoArray.push({
      id: 0,
      classificationName: this.filesForm.get('classificationName')?.value,
      imageName: this.fileName,
      imageStorageFileName: this.fileStorageFileName,
      imageStorageFileURL: environment.BlobUrl + this.fileStorageFileName,
      employeeClassificationAttachmentId: this.filesForm.get(
        'employeeClassificationAttachmentId'
      )?.value,
      employeeClassificationAttachment:
        this.lang === 'ar' ? className.nameAr : className.nameEn,
      imageURL: null
    });
    this.fileName = null;
    this.fileStorageFileName = null;
    this.disableOther = true;
    this.filesForm.reset();
  }
  //delete row of info table
  deleteRow(row: {
    id: any;
    classificationName: string;
    imageName: string;
    imageStorageFileName: string;
    imageStorageFileURL: string;
    employeeClassificationAttachmentId: number;
    employeeClassificationAttachment: string;
    imageURL: string | null;
  }) {
    const index = this.attachmentFileInfoArray.indexOf(row);
    if (index > -1) {
      this.attachmentFileInfoArray.splice(index, 1);
    }
  }

  public submit() {
    this.form.get('files')?.setValue(this.attachmentFileInfoArray);
    this.form.get('countryCodeIso')?.setValue(null);
    if (this.form.valid && this.endAfterStart) {
      if (this.finalBranchesEdit?.length) {
        let data = {
          ...this.form.value,
          branchs: this.finalBranchesEdit,
        };
        if (this.id) this.edit(data);
        if (!this.id) this.add(data);
      } else {
        let data = {
          ...this.form.value,
          branchs: this.changedBranchs
            ? this.changedBranchs
            : this.choosenBranchs,
        };
        if (this.id) this.edit(data);
        if (!this.id) this.add(data);
      }
    } else {
      Object.keys(this.form.controls).forEach((field) => {
        const control = this.form.get(field); // {2}
        control?.markAsTouched({ onlySelf: true });
        return;
      });
    }
  }

  disableButton: boolean = false;
  add(data: any) {

    this.disableButton = true;
    this.spinner.show();
    this._employeeManagementService.addNewEmployee(data).subscribe({
      next: (next) => {
        this.spinner.hide();
        if (next.success) {
          this.authService.getConditionsToCurrentUser();

          this.appconfirmservice.confirm(
            this.translate.instant('emplyeeEditAdd.addSuccess'),
            '',
            '/assets/imgs/confirm/add.svg'
          );
          this.cdr.detectChanges();
        } else {
          this.spinner.hide();
          this.disableButton = false;
          this.appconfirmservice.confirm(
            this.translate.instant(next.message),
            '',
            '/assets/imgs/confirm/warning.svg',
            false
          );
        }
      },
      error: (error) => {
        this.spinner.hide();
        this.disableButton = false;
        this.appconfirmservice.confirm(
          this.translate.instant(error.error.error.message),
          '',
          '/assets/imgs/confirm/warning.svg',
          false
        );
      },
    });
  }
  edit(data: any) {
    this.disableButton = true;
    this.spinner.show();

    let dataSend = {
      ...data,
      id: +this.id,
    };
    this._employeeManagementService.editEmployee(dataSend).subscribe({
      next: (next) => {
        this.spinner.hide();
        if (next.success) {
          this.appconfirmservice.confirm(
            this.translate.instant('emplyeeEditAdd.editSuccess'),
            '',
            '/assets/imgs/confirm/add.svg'
          );
          this.cdr.detectChanges();
        } else {
          this.disableButton = false;
          this.spinner.hide();
          this.appconfirmservice.confirm(
            this.translate.instant(next.message),
            '',
            '/assets/imgs/confirm/warning.svg',
            false
          );
        }
      },
      error: (error) => {
        this.disableButton = false;
        this.spinner.hide();
        this.appconfirmservice.confirm(
          this.translate.instant(error.error.error.message),
          '',
          '/assets/imgs/confirm/warning.svg',
          false
        );
      },
    });
  }
  private unsubscribe: Subscription[] = [];

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
  Back() {
    this.router.navigate(['/agent/departments/employee-managment']);
  }

  isTeam = false
  showHEmp(type: boolean) {

    this.isTeam = type
  }
}
