import { DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { DateFormatterService, DateType } from 'ngx-hijri-gregorian-datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';
import { Constants } from 'src/app/services/Constants/constants';
import { BranchesService } from 'src/app/services/api/branches.service';
import { ContractService } from 'src/app/services/api/contract.service';
import { IssuesService } from 'src/app/services/api/issues.service';
import { WorkDutyService } from 'src/app/services/api/work-duty.service';
import { ContractStatus } from 'src/app/services/enums/contractStatus.enum';
import { DutyKind } from 'src/app/services/enums/duty-kind.enum';
import { Payment } from 'src/app/services/enums/payment-conditions.enum';
import { DutyType, WorkDutyStatus } from 'src/app/services/enums/work-duty.enum';

@Component({
  selector: 'app-work-duty-info',
  templateUrl: './work-duty-info.component.html',
  styleUrls: ['./work-duty-info.component.scss'],
})
export class WorkDutyInfoComponent implements OnInit, OnDestroy {
  infoForm: FormGroup;
  hasError: boolean;
  isLoading$: Observable<boolean>;
  private unsubscribe: Subscription[] = [];
  lang: string | null = localStorage.getItem('language');
  workDutyStatus = WorkDutyStatus;
  DutyType = DutyType
  @Output() bindBranchID: EventEmitter<any> = new EventEmitter<any>();
  @Input() workDutyDetails: any;
  workDutyId: any;
  dutyKind = DutyKind;
  casesList: any;
  dateText: any;
  dateTextEnd: any;
  lawsuitList: any;
  isEmployee: boolean;
  currentUser: any;
  branches: any;
  dutyNames: any[] = [];
  otherValue: any;
  fromIssue: any
  issueNo: any
  issueId: any
  edit: boolean = false
  ///date 
  expirationDate: any;
  EndDate: any;
  @ViewChild('expirationDatePicker') expirationDatePicker: any;
  @ViewChild('EndDatePicker') EndDatePicker: any;
  endAfterStart: boolean = true;
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
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private _workDutyService: WorkDutyService,
    private _IssueService: IssuesService,
    public datepipe: DatePipe,
    public route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private _branchManagementService: BranchesService,
  ) {
    this.getCondition();
    this.minDateG = this.dateFormatter.ToGregorianDateStruct('1800-01-01', 'YYYY-MM-DD');
    this.minDateH = this.dateFormatter.ToGregorianDateStruct('1214-01-01', 'YYYY-MM-DD');

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
  selectedDateChange(event: any) {
    if (!this.expirationDate) {
      return;
    }
    if (!this.EndDate) {
      let currentDateVal = new Date(this.expirationDatePicker.getSelectedDate());

      const timezoneOffset = currentDateVal.getTimezoneOffset();

      currentDateVal.setMinutes(currentDateVal.getMinutes() + timezoneOffset);
      currentDateVal.setDate(currentDateVal.getDate() + 1);

      this.infoForm.controls.startDate.setValue(currentDateVal);
    }
    else {
      if (this.expirationDatePicker.getSelectedDate() < this.EndDatePicker.getSelectedDate()) {
        let currentDateVal = new Date(this.expirationDatePicker.getSelectedDate());

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
      if (this.expirationDatePicker.getSelectedDate() < this.EndDatePicker.getSelectedDate()) {
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
  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser.roles[0] == Constants.AllRoles.employee) {
      this.isEmployee = true;
    } else {
      this.isEmployee = false;
    }
    localStorage.setItem('step', '1');
    this.route.params.subscribe({
      next: (next) => {
        this.workDutyId = next['id'];
        this.fromIssue = next['fromIssue']
        if (next['issueNo'] != 0) this.issueId = next['issueNo']

      },
    });


    this.initForm();
    this.getBranchList()
    if (this.fromIssue == 'true') {
      this.getCasesList()
      this.infoForm.get('dutyKind')?.patchValue(this.dutyKind.RelatedLawsuit)

      this.infoForm.get('lawsuitId')?.disable()
      this.infoForm.get('lawsuitId')?.setValidators([Validators.required]);
      this.infoForm.get('lawsuitId')?.updateValueAndValidity();
    } else {
      this.infoForm.get('dutyKind')?.patchValue(this.dutyKind.General)
      this.infoForm.get('dutyType')?.setValue('general');
      this.infoForm.get('lawsuitId')?.setValue(null);
      this.infoForm.get('lawsuitId')?.setValidators(null);
      this.infoForm.get('lawsuitId')?.updateValueAndValidity();
    }
    if (this.workDutyId) {

      this.getCntractById();
      this.edit = true
    } else {
      this.getDutyName()
      this.edit = false

    }
  }
  branchOfIssue: any
  getIssueById() {
    this._IssueService.getLawsuitDetails(this.issueId).subscribe({
      next: next => {
        this.branchOfIssue = next.data.branchId
        this.infoForm.get('branchId')?.setValue(this.branchOfIssue)

      }
    })
  }
  getDutyName() {
    this._workDutyService.getWorkName().subscribe((next) => {

      this.dutyNames = next.data
      this.otherValue = next.data.filter((x: any) => x.dutyType === DutyType.Other);

      this.cdr.detectChanges();
    })
  }
  //add start date
  setValueOfDate() {
    this.infoForm.get('startDate')?.setValue(this.dateText);
  }
  //add End date
  setValueOfDateEnd() {
    this.infoForm.get('endDate')?.setValue(this.dateTextEnd);
  }
  disableName: boolean = false
  changeName() {


    // if (this.infoForm.get('dutyNameId')?.value === this.otherValue[0].id) {
    //   this.disableName = false
    //   this.infoForm.get('name')?.setValidators([Validators.required]);
    //   this.infoForm.get('name')?.updateValueAndValidity();
    // } else {
    //   this.infoForm.get('name')?.setValue(null);
    //   this.disableName = true
    //   this.infoForm.get('name')?.setValidators(null);
    //   this.infoForm.get('name')?.updateValueAndValidity();
    // }
  }
  errorDate: boolean = false
  public checkDate(event: any) {
    const startDate = this.dateText;
    let endDate = new Date(event.target.value);

    if (endDate.getFullYear() < startDate.year) {
      this.infoForm.get('endDate')?.markAsTouched({ onlySelf: true });
      this.infoForm.get('endDate')?.setErrors({ inFuture: true });

      return;
    } else if (endDate.getFullYear() >= startDate.year) {
      if ((endDate.getMonth() + 1) < startDate.month) {
        this.infoForm.get('endDate')?.markAsTouched({ onlySelf: true });
        this.infoForm.get('endDate')?.setErrors({ inFuture: true });
        return;
      } else if (endDate.getMonth() + 1 >= startDate.month) {
        if (endDate.getDate() < startDate.day) {
          this.infoForm.get('endDate')?.markAsTouched({ onlySelf: true });
          this.infoForm.get('endDate')?.setErrors({ inFuture: true });

          return;
        } else {
          this.infoForm.get('endDate')?.markAsUntouched({ onlySelf: true });
          this.infoForm.get('endDate')?.setValue(this.dateTextEnd);

          return;
        }
      }
    } else {
      this.infoForm.get('endDate')?.markAsUntouched({ onlySelf: true });
      this.infoForm.get('endDate')?.setValue(this.dateTextEnd);


      return;
    }
  }
  getBranchList() {
    this._branchManagementService.getAllBranchesList().subscribe({
      next: next => {
        this.branches = next.data
      }
    })
  }
  //get case details
  getCntractById() {
    this.spinner.show();
    this._workDutyService.getDutyDetails(this.workDutyId).subscribe({
      next: (next) => {

        this.workDutyDetails = next.data;
        if (this.workDutyDetails.branchId)
          this.getLawsuitList(this.workDutyDetails.branchId);
        this.infoForm.patchValue(this.workDutyDetails);

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
        if (next.data.lawsuitId) {
          this.infoForm.get('dutyType')?.setValue('relatedCase');
          this.fromIssue = 'true'
          this.infoForm.get('lawsuitId')?.disable()
          this.infoForm.get('lawsuitId')?.setValue(next.data.lawsuitNumber)

        } else {
          this.infoForm.get('dutyType')?.setValue('general');
          this.fromIssue = 'false'

          this.infoForm.get('lawsuitId')?.disable();
        }
        this._workDutyService.getWorkName().subscribe((next) => {

          this.dutyNames = next.data
          this.otherValue = next.data.filter((x: any) => x.dutyType === DutyType.Other);
          //this.changeName()
          //this.cdr.detectChanges();
        })

        this.cdr.detectChanges();
        this.spinner.hide();
      },
    });
  }
  //init form
  initForm() {
    this.infoForm = this.fb.group({
      id: [],
      name: [null, Validators.compose([Validators.required])],
      dutyStatus: [this.workDutyStatus.Active, Validators.compose([Validators.required])],
      startDate: [null,],
      endDate: [null,],
      details: [null,],
      dutyType: ['relatedCase'],
      lawsuitId: [null, Validators.compose([Validators.required])],
      // dutyNameId: [null],
      branchId: [null,],
      dutyKind: [null],
      branch: [],
      number: [],
      lawsuitNumber: [],
      startDateType: [null],
      endDateType: [null],
    });
  }
  //get client list
  getLawsuitList(e: any) {
    this.bindBranchID.emit(e)

    this._workDutyService.getLawsuitInBranch(e).subscribe({
      next: (next) => {
        this.spinner.hide();
        this.lawsuitList = next.data;
        this.cdr.detectChanges();
      },
    });
  }
  //get cases list

  getCasesList() {

    this._workDutyService.getCaseslist().subscribe({
      next: (next) => {
        this.spinner.hide();
        this.casesList = next.data;

        this.issueNo = next.data.filter((x: any) => x.id == this.issueId)[0].number
        if (this.issueNo == 0) {
          this.infoForm.get('lawsuitNumber')?.patchValue('')
        } else this.infoForm.get('lawsuitNumber')?.patchValue(this.issueNo)


        this.cdr.detectChanges();
      },
    });
  }
  //back function
  Back() {
    this.router.navigate(['/agent/departments/work-duty']);
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
