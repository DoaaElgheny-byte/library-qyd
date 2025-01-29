import { DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { DateFormatterService, DateType } from 'ngx-hijri-gregorian-datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { ValidationPattern } from 'src/app/modules/SharedComponent/helper/validator';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { Constants } from 'src/app/services/Constants/constants';
import { BranchesService } from 'src/app/services/api/branches.service';
import { ContractService } from 'src/app/services/api/contract.service';
import {
  AttachmentType,
  ContractStatus,
} from 'src/app/services/enums/contractStatus.enum';
import { FilesType } from 'src/app/services/enums/lawsuit';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contract-info',
  templateUrl: './contract-info.component.html',
  styleUrls: ['./contract-info.component.scss'],
})
export class ContractInfoComponent implements OnInit {
  infoForm: FormGroup;
  hasError: boolean;
  isLoading$: Observable<boolean>;
  private unsubscribe: Subscription[] = [];
  lang: string | null = localStorage.getItem('language');
  contractStatus = ContractStatus;
  isAddNewContractFromProject: any;

  @Output() bindValue: EventEmitter<any> = new EventEmitter<any>();
  @Input() contractDetails: any;
  contractId: any;
  clientList: any;
  dateText: any;
  dateTextEnd: any;
  endAfterStart: boolean = true;
  branches: any;
  successLoad = false;
  isEmployee: boolean;
  ///date
  expirationDate: any;
  EndDate: any;
  @ViewChild('expirationDatePicker') expirationDatePicker: any;
  @ViewChild('EndDatePicker') EndDatePicker: any;

  currentDateH: any;
  currentDateG: any;
  selectedDateType = DateType.Hijri;
  selectedEndDateType = DateType.Hijri;
  minDateG: any;
  minDateH: any;
  isRequiredFee: boolean;

  constructor(
    private dateFormatter: DateFormatterService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private _contractManagementService: ContractService,
    private _branchManagementService: BranchesService,
    public datepipe: DatePipe,
    public route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.minDateG = this.dateFormatter.ToGregorianDateStruct('1800-01-01', 'YYYY-MM-DD');
    this.minDateH = this.dateFormatter.ToGregorianDateStruct('1214-01-01', 'YYYY-MM-DD');
    this.isAddNewContractFromProject = localStorage.getItem('addNewContractFromProject')

  }

  ngOnInit(): void {
    localStorage.setItem('stepContract', '1');
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser.roles[0] == Constants.AllRoles.employee) {
      this.isEmployee = true;
    } else {
      this.isEmployee = false;
    }
    this.route.params.subscribe({
      next: (next) => {
        this.contractId = next['id'];
      },
    });

    this.initForm();
    this.initfileForm();
    this.initPaymentForm();
    this.getBranchList();
    if (this.contractId) {
      this.getCntractById();
    } else {
      this.initForm();
      this.successLoad = true;
    }
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
      this.infoForm.controls.startDate.setValue(currentDateVal);

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
        this.infoForm.controls.startDate.setValue(currentDateVal);
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
    if (!this.EndDate) {
      return;
    }
    if (!this.expirationDate) {
      let currentDateVal = new Date(this.EndDatePicker.getSelectedDate());

      const timezoneOffset = currentDateVal.getTimezoneOffset();

      currentDateVal.setMinutes(currentDateVal.getMinutes() + timezoneOffset);
      currentDateVal.setDate(currentDateVal.getDate() + 1);
      this.infoForm.controls.endDate.setValue(currentDateVal);

    } else {
      if (
        this.expirationDatePicker.getSelectedDate() <
        this.EndDatePicker.getSelectedDate()
      ) {
        let currentDateVal = new Date(this.EndDatePicker.getSelectedDate());

        const timezoneOffset = currentDateVal.getTimezoneOffset();

        currentDateVal.setMinutes(currentDateVal.getMinutes() + timezoneOffset);
        currentDateVal.setDate(currentDateVal.getDate() + 1);
        this.infoForm.controls.endDate.setValue(currentDateVal);

        this.endAfterStart = true;
      } else {
        this.EndDate = null;
        this.endAfterStart = false;
      }
    }
    if (this.EndDatePicker.selectedDateType === DateType.Hijri) {
      this.infoForm.controls.endDateType.setValue(DateType.Hijri);
    } else {
      this.infoForm.controls.endDateType.setValue(DateType.Gregorian);
    }
  }
  getBranchList() {
    this._branchManagementService.getAllBranchesList().subscribe({
      next: (next) => {
        this.branches = next.data;
      },
    });
  }
  changeBranch(e: any) {
    this.infoForm.get('clientId')?.setValue(null);
    this.getClientList(e);
  }
  //get client list
  getClientList(e: any) {
    this._contractManagementService.getClientList(e).subscribe({
      next: (next) => {
        this.spinner.hide();
        this.clientList = next.data;
        this.cdr.detectChanges();
      },
    });
  }
  //add start date
  setValueOfDate() {
    if (this.dateTextEnd != undefined) {
      const jsDate1 = new Date(
        this.dateText.year,
        this.dateText.month - 1,
        this.dateText.day
      );

      const jsDate2 = new Date(
        this.dateTextEnd.year,
        this.dateTextEnd.month - 1,
        this.dateTextEnd.day
      );
      if (jsDate1 < jsDate2) {
        this.infoForm.get('startDate')?.setValue(this.dateText);
        this.endAfterStart = true;
      } else {
        this.dateText = null;
        this.endAfterStart = false;
      }
    } else {
      this.infoForm.get('startDate')?.setValue(this.dateText);
      this.endAfterStart = true;
    }
  }
  //add End date
  setValueOfDateEnd() {
    if (this.dateText != undefined) {
      const jsDate1 = new Date(
        this.dateText.year,
        this.dateText.month - 1,
        this.dateText.day
      );

      const jsDate2 = new Date(
        this.dateTextEnd.year,
        this.dateTextEnd.month - 1,
        this.dateTextEnd.day
      );
      if (jsDate1 < jsDate2) {
        this.infoForm.get('endDate')?.setValue(this.dateTextEnd);
        this.endAfterStart = true;
      } else {
        this.endAfterStart = false;
        this.dateTextEnd = null;
      }
    } else {
      this.infoForm.get('endDate')?.setValue(this.dateTextEnd);
      this.endAfterStart = true;
    }
  }
  //get case details
  getCntractById() {
    this.spinner.show();
    this._contractManagementService
      .getContractDetails(this.contractId)
      .subscribe({
        next: (next) => {

          this.contractDetails = next.data;
          console.log(next.data)
          if (this.contractDetails.branchId) {
            this.getClientList(this.contractDetails.branchId);
          }
          this.infoForm.patchValue(this.contractDetails);
          if (next.data.startDate) {
            let currentDate = next.data.startDate.substring(0, 10);
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
          if (this.infoForm.get('startDateType')?.value) {
            if (this.infoForm.get('startDateType')?.value === DateType.Gregorian) {
              this.selectedDateType = DateType.Gregorian;
            } else {
              this.selectedDateType = DateType.Hijri;
            }
          }
          if (this.infoForm.get('endDateType')?.value) {
            if (this.infoForm.get('endDateType')?.value === DateType.Gregorian) {
              this.selectedEndDateType = DateType.Gregorian;
            } else {
              this.selectedEndDateType = DateType.Hijri;
            }
          }
          if (next.data.endDate) {
            let endOfDate = next.data.endDate.substring(0, 10);
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

          if (this.contractDetails.contarctFiles != null) {
            this.attachmentFileInfoArray = this.contractDetails.contarctFiles;
          } else {
            this.attachmentFileInfoArray = [];
          }
          if (this.contractDetails.payments != null) {
            this.PaymentArray = this.contractDetails.payments;
          } else {
            this.PaymentArray = [];
          }
          this.showHFee()
          this.infoForm.get('reason')?.patchValue(next.data.reason)
          this.infoForm.get('advancevalue')?.patchValue(next.data.advancevalue)

          this.successLoad = true;
          this.cdr.detectChanges();
          this.spinner.hide();
        },
      });
  }
  //init form
  initForm() {
    this.infoForm = this.fb.group({
      id: [],
      address: [null, Validators.required],
      contarctStatus: [null,],
      startDate: [null,],
      endDate: [null,],
      details: [null,],
      clientId: [null,],
      branchId: [null,],
      branch: [null],
      startDateType: [null],
      endDateType: [null],

      isRequiredFees: [false],
      contractValue: [null, Validators.compose([Validators.pattern(ValidationPattern.Mobile)])],
      advancevalue: [null, Validators.compose([Validators.pattern(ValidationPattern.Mobile)])],
      backvalue: [null, Validators.compose([Validators.pattern(ValidationPattern.Mobile)])],
      reason: [''],
      payments: []
    });
  }

  /*attachment part */
  filesForm: FormGroup;
  paymentForm: FormGroup;
  PaymentArray: {
    value: any;
    paymentNumber: any;
  }[] = [];

  initPaymentForm() {
    this.paymentForm = this.fb.group({
      value: [null, Validators.compose([Validators.pattern(ValidationPattern.Mobile)])],
      paymentNumber: [null, Validators.compose([Validators.pattern(ValidationPattern.Mobile)])],
    });
  }

  adadPaymentInfo() {
    this.PaymentArray.push({
      value: this.paymentForm.get('value')?.value,
      paymentNumber: this.paymentForm.get('paymentNumber')?.value
    });
    this.paymentForm.reset();
  }

  deletePaymentRow(row: {
    id: any;
    value: number;
    paymentNumber: number;
  }) {
    const index = this.PaymentArray.indexOf(row);
    if (index > -1) {
      this.PaymentArray.splice(index, 1);
    }
  }

  /**Attachment form */
  fileType = FilesType;
  attachmentFileInfoArray: {
    id: any;
    classificationName: string;
    imageName: string;
    imageStorageFileName: string;
    filesType: any;
    name: string;
    imageStorageFileURL: string;
    date: string;
  }[] = [];
  fileName: any;
  fileStorageFileName: any;
  fieldRequired = false;
  currentUser: any;

  initfileForm() {
    this.filesForm = this.fb.group({
      attachment: [null, Validators.compose([Validators.required])],
      name: [null, Validators.compose([Validators.required])],
    });
  }
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

    this.attachmentFileInfoArray.push({
      id: 0,
      classificationName: this.filesForm.get('name')?.value,
      imageName: this.fileName,
      imageStorageFileName: this.fileStorageFileName,
      filesType: this.fileType.AttachmentFile,
      name: this.currentUser.email,
      imageStorageFileURL:
        environment.BlobUrl +
        this.fileStorageFileName,
      date: Date.now().toString(),
    });
    this.fileName = null;
    this.fileStorageFileName = null;
    this.filesForm.reset();
    this.fieldRequired = false;
  }
  //delete row of info table
  deleteRow(row: {
    id: any;
    classificationName: string;
    imageName: string;
    imageStorageFileName: string;
    filesType: any;
    name: string;
    imageStorageFileURL: string;
    date: string;
  }) {
    const index = this.attachmentFileInfoArray.indexOf(row);
    if (index > -1) {
      this.attachmentFileInfoArray.splice(index, 1);
    }
  }
  //send Attachment
  sendAttachment(id: any) {
    let filesArray: {
      id: any;
      classificationName: string;
      imageName: string;
      imageStorageFileName: string;
      filesType: any;
      name: string;
      imageStorageFileURL: string;
      date: string;
    }[] = [];
    this.attachmentFileInfoArray.forEach((element) => {
      filesArray.push(element);
    });
    this._contractManagementService
      .addAttachment({ id: id, files: filesArray })
      .subscribe({
        next: (next) => {
          this.spinner.hide();
          if (next.success) {
            this.router.navigate([
              '/agent/departments/contracts/add-edit-contract',
              id,
            ]);
            this.bindValue.emit({
              id: id,
              isSuccess: next.success,
              isAdd: true,
            });
          } else {
            this.spinner.hide();
            this.bindValue.emit({
              id: this.contractId,
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
  }

  //back function
  Back() {
    this.router.navigate(['/agent/departments/contracts']);
  }

  //saveData
  submit() {

    this.infoForm.get('payments')?.setValue(this.PaymentArray);
    if (this.infoForm.invalid) {
      Object.keys(this.infoForm.controls).forEach((field) => {
        // {1}
        const control = this.infoForm.get(field); // {2}
        control?.markAsTouched({ onlySelf: true }); // {3}
      });
      return;
    }
    if (this.infoForm.valid && this.endAfterStart) {
      this.spinner.show();
      if (this.contractId) {
        this._contractManagementService
          .editContractInfo(this.infoForm.value)
          .subscribe({
            next: (next) => {
              this.spinner.hide();
              if (next.success) {
                if (this.attachmentFileInfoArray.length === 0) {
                  this.bindValue.emit({
                    id: this.contractId,
                    isSuccess: next.success,
                    isAdd: true,
                  });
                } else {
                  this.sendAttachment(this.contractId);
                }
              } else {
                this.spinner.hide();
                this.bindValue.emit({
                  id: this.contractId,
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
        this._contractManagementService
          .addContractInfo(this.infoForm.value)
          .subscribe({
            next: (next) => {
              this.spinner.hide();
              if (next.success) {
                this.contractId = next.data;
                if (this.attachmentFileInfoArray.length === 0) {
                  this.router.navigate([
                    '/agent/departments/contracts/add-edit-contract',
                    this.contractId,
                  ]);

                  this.bindValue.emit({
                    id: this.contractId,
                    isSuccess: next.success,
                    isAdd: true,
                  });
                } else {
                  this.sendAttachment(this.contractId);
                }
              } else {
                this.spinner.hide();
                this.bindValue.emit({
                  id: next.data,
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
      }
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    localStorage.removeItem('addNewContractFromProject')
  }
  showHFee() {
    let value = this.infoForm.get('isRequiredFees')?.value;
    this.isRequiredFee = value;
    if (!this.isRequiredFee) {
      this.infoForm.get('contractValue')?.setValue(null);
      this.infoForm.get('advancevalue')?.setValue(null);
      this.infoForm.get('backvalue')?.setValue(null);
      this.infoForm.get('reason')?.setValue(null);
      this.infoForm.get('payments')?.setValue(null);
    }
  }
}
