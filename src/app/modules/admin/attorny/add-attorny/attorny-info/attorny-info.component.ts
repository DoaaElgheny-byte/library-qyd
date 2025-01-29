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

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { ValidationPattern } from 'src/app/modules/SharedComponent/helper/validator';
import { AuthService } from 'src/app/modules/auth';
import { Constants } from 'src/app/services/Constants/constants';
import { AttornyService } from 'src/app/services/api/attorny.service';
import { BranchesService } from 'src/app/services/api/branches.service';
import { ClientService } from 'src/app/services/api/client.service';
import { AttornyStatus } from 'src/app/services/enums/attorny.enum';
import { ContractStatus } from 'src/app/services/enums/contractStatus.enum';
import { DateType, DateFormatterService } from 'ngx-hijri-gregorian-datepicker';
@Component({
  selector: 'app-attorny-info',
  templateUrl: './attorny-info.component.html',
  styleUrls: ['./attorny-info.component.scss'],
})
export class AttornyInfoComponent implements OnInit {
  infoForm: FormGroup;
  hasError: boolean;
  isLoading$: Observable<boolean>;
  private unsubscribe: Subscription[] = [];
  lang: string | null = localStorage.getItem('language');
  contractStatus = AttornyStatus;

  @Output() bindValue: EventEmitter<any> = new EventEmitter<any>();
  @Input() attornyDetails: any;
  attornyId: any;
  clientList: any;
  dateText: any;
  dateTextEnd: any;
  endAfterStart: boolean = true;
  branches: any;
  isEmployee: boolean;
  currentUser: any;

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
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private _attornyManagementService: AttornyService,
    private _clientService: ClientService,
    private _branchManagementService: BranchesService,
    public datepipe: DatePipe,
    public route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private dateFormatter: DateFormatterService,
    private calendar: NgbCalendar
  ) {
    this.currentDateG = this.dateFormatter.GetTodayGregorian();
    this.currentDateH = this.dateFormatter.GetTodayHijri();
    this.minDateG = this.dateFormatter.ToGregorianDateStruct('1800-01-01', 'YYYY-MM-DD');
    this.minDateH = this.dateFormatter.ToGregorianDateStruct('1214-01-01', 'YYYY-MM-DD');

  }

  ngOnInit(): void {
    localStorage.setItem('step', '1');
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser.roles[0] == Constants.AllRoles.employee) {
      this.isEmployee = true;
    } else {
      this.isEmployee = false;
    }
    this.route.params.subscribe({
      next: (next) => {
        this.attornyId = next['id'];
      },
    });
    this.getBranchList();
    this.initForm();
    if (this.attornyId) {
      this.getattornyById();
    }
  }
  //init form
  initForm() {
    this.infoForm = this.fb.group({
      id: [],
      number: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(ValidationPattern.allNumber),
        ]),
      ],
      address: [null,],
      agencyStatus: [null,],
      startDate: [null,],
      endDate: [null,],
      details: [null],
      clientId: [null,],
      branchId: [null,],
      branch: [],
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
  //get branchList
  getBranchList() {
    this._branchManagementService.getAllBranchesList().subscribe({
      next: (next) => {
        this.branches = next.data;
        this.cdr.detectChanges();
      },
    });
  }
  //get client list
  getClientList(e: any) {
    this._clientService.getClientListByBranch(e).subscribe({
      next: (next) => {
        this.spinner.hide();
        this.clientList = next.data;
        this.cdr.detectChanges();
      },
    });
  }
  changeBranch(e: any) {
    this.infoForm.get('clientId')?.setValue(null);
    this.getClientList(e);
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
  getattornyById() {

    this.spinner.show();
    this._attornyManagementService.getagencyDetails(this.attornyId).subscribe({
      next: (next) => {
        this.attornyDetails = next.data;
        if (this.attornyDetails.branchId) {
          this.getClientList(this.attornyDetails.branchId);
        }
        this.infoForm.patchValue(this.attornyDetails);

        this.infoForm.get('clientId')?.setValue(this.attornyDetails.clientId);
        if (this.infoForm.get('startDateType')?.value) {
          if (
            this.infoForm.get('startDateType')?.value === DateType.Gregorian
          ) {
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
        if (next.data.startDate != null) {
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
        }
        if (next.data.endDate != null) {
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
        }


        this.cdr.detectChanges();
        this.spinner.hide();
      },
    });
  }

  //back function
  Back() {
    this.router.navigate(['/agent/departments/attorny']);
  }
  //saveData
  submit() {

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
      if (this.attornyId) {
        this._attornyManagementService
          .editagencyInfo(this.infoForm.value)
          .subscribe({
            next: (next) => {
              this.spinner.hide();
              if (next.success) {
                this.bindValue.emit({
                  id: this.attornyId,
                  isSuccess: next.success,
                });
              } else {
                this.spinner.hide();
                this.bindValue.emit({
                  id: this.attornyId,
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
        this._attornyManagementService
          .addagencyInfo(this.infoForm.value)
          .subscribe({
            next: (next) => {
              this.spinner.hide();
              if (next.success) {
                this.attornyId = next.data;
                this.router.navigate([
                  '/agent/departments/attorny/add-edit-attorny',
                  next.data,
                ]);
                this.bindValue.emit({
                  id: next.data,
                  isSuccess: next.success,
                  isAdd: true,
                });
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
  }
}
