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
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NgbDate,
  NgbDateStruct,
  NgbTimeStruct,
  NgbTimepickerConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DateFormatterService, DateType } from 'ngx-hijri-gregorian-datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { TranslationService } from 'src/app/i18n';
import { IssuesService } from 'src/app/services/api/issues.service';
import { SittingManagementService } from 'src/app/services/api/sitting-management.service';
import { CourtType } from 'src/app/services/enums/court-type.enum';
import {
  CategoryType,
  ClientStaus,
  EntityType,
  MainCourtType,
} from 'src/app/services/enums/lawsuit';
import {
  ConditionType,
  Payment,
} from 'src/app/services/enums/payment-conditions.enum';
import { SittingStatus } from 'src/app/services/enums/sitting';
import { SittingType } from 'src/app/services/enums/sitting-type.enum';
const pad = (i: number): string => (i < 10 ? `0${i}` : `${i}`);

@Component({
  selector: 'app-sitting-info',
  templateUrl: './sitting-info.component.html',
  styleUrls: ['./sitting-info.component.scss'],
})
export class SittingInfoComponent implements OnInit {
  infoForm: FormGroup;
  hasError: boolean;
  isLoading$: Observable<boolean>;
  private unsubscribe: Subscription[] = [];
  lang: string | null = localStorage.getItem('language');
  mainCourt: any;
  showCourt: boolean = true;
  lawaist: any;
  branches: any;
  sittingStatus = SittingStatus;
  clientStaus = ClientStaus;
  subjectValue =
    'السلام عليكم ورحمة الله وبركاته.\n \n إلى السيد الفاضل رئيس محكمة….\n\n إنه في يوم….تم رفع دعوى مطالبة مالية من مكتب……للمحاماة، بموجب عقد وكالة من السيد…..المقيم في…. رقم الهوية الوطنية…. رقم التوكيل…. ضد السيد….المقيم في….. الوقائع: المتطلبات: لذلك نتطلب من فضيلتكم بالنيابة عن موكلي التالي:';
  @Output() bindValue: EventEmitter<any> = new EventEmitter<any>();
  @Input() issueDetails: any;
  @Input() id: any;
  issueId: any;
  isDisable = false;
  clientList: any;
  dateText: any;
  time: NgbTimeStruct = { hour: 13, minute: 30, second: 0 };
  startTime = '00:00';

  @Input() newStep1: any;
  min: NgbDateStruct = { year: 1990, month: 1, day: 1 };
  courtType = CourtType;
  sittingType = SittingType;
  entityList: any;
  isEdit: boolean = false;
  entityType = EntityType;
  committeeList: any;
  courtList: any;
  subCourtList: any;
  originalValidators: { [key: string]: ValidatorFn | ValidatorFn[] | null } =
    {};
  lawaistId: any;
  ///date
  expirationDate: any;
  EndDate: any;
  @ViewChild('expirationDatePicker') expirationDatePicker: any;
  currentDateH: any;
  currentDateG: any;
  selectedDateType = DateType.Hijri;
  isOnline: boolean;
  minDateH: any;
  minDateG: any;
  constructor(
    private dateFormatter: DateFormatterService,
    private fb: FormBuilder,
    private translationService: TranslationService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private toastr: ToastrService,
    private _sittingManagementService: SittingManagementService,
    public datepipe: DatePipe,
    public route: ActivatedRoute,
    private router: Router,
    private config: NgbTimepickerConfig,
    private _lawsuitManagementService: IssuesService
  ) {
    this.minDateG = this.dateFormatter.ToGregorianDateStruct('1800-01-01', 'YYYY-MM-DD');
    this.minDateH = this.dateFormatter.ToGregorianDateStruct('1214-01-01', 'YYYY-MM-DD');

    config.seconds = false;
    config.spinners = true;
    this.currentDateG = this.dateFormatter.GetTodayGregorian();
    this.currentDateH = this.dateFormatter.GetTodayHijri();
    this.getCondition();
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
    let currentDateVal = new Date(this.expirationDatePicker.getSelectedDate());

    const timezoneOffset = currentDateVal.getTimezoneOffset();

    currentDateVal.setMinutes(currentDateVal.getMinutes() + timezoneOffset);
    currentDateVal.setDate(currentDateVal.getDate() + 1);

    this.infoForm.controls.startDate.setValue(currentDateVal);
    if (this.expirationDatePicker.selectedDateType === DateType.Hijri) {
      this.infoForm.controls.startDateType.setValue(DateType.Hijri);
    } else {
      this.infoForm.controls.startDateType.setValue(DateType.Gregorian);
    }

    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    let min = new Date('1990-01-01');
    this.min = {
      year: min.getFullYear(),
      month: min.getMonth() - 1,
      day: min.getDate(),
    }; // Set the minimum date
    localStorage.setItem('step', '1');
    this.route.params.subscribe({
      next: (next) => {
        this.issueId = next['id'];
        this.lawaistId = next['lawaistId'];
      },
    });

    this.initForm();
    this.getCommittee();

    this.getEntityList();
    this.getClientList();
    this.getBranchList();
    this.getSubjectValue();
    if (this.issueId) {
      this.isEdit = true;
      this.getIssueById();
    }
  }
  getEntityList() {
    this.entityList = Object.keys(this.entityType)
      .filter(
        (key) =>
          !isNaN(Number(this.entityType[key as keyof typeof this.entityType]))
      )
      .map((key) => ({
        id: Number(this.entityType[key as keyof typeof this.entityType]),
        name: key,
      }));
  }
  changeType() {
    if (this.infoForm.get('sittingType')?.value == this.sittingType.Online) {
      this.isOnline = true;
    } else {
      this.isOnline = false;
    }
    this.cdr.detectChanges();
  }
  mainCourtEnum = MainCourtType;
  //get main court
  getCourt(courtType: any) {
    if (courtType == this.entityType['addIssue.MinistryOfHumanResources']) {
      courtType = this.mainCourtEnum.MinistryOfHumanResources;
    }
    this._lawsuitManagementService.getCourtByType(courtType).subscribe({
      next: (next) => {
        if (next.success) {
          this.spinner.hide();
          this.courtList = next.data;
          this.cdr.detectChanges();
        }
      },
    });
  }
  //get get Committee
  getCommittee() {
    this._lawsuitManagementService.getCommittee().subscribe({
      next: (next) => {
        this.spinner.hide();
        this.committeeList = next.data;
      },
    });
  }
  //get Sub Court
  getSubCourt(courtId: any) {
    this._lawsuitManagementService.getSubCourt(courtId).subscribe({
      next: (next) => {
        this.spinner.hide();
        this.subCourtList = next.data;
        this.cdr.detectChanges();
      },
    });
  }
  //add date
  setValueOfDate() {
    this.infoForm.get('startDate')?.setValue(this.dateText);
  }
  //get case details
  getIssueById() {
    this.spinner.show();
    this._sittingManagementService.getSittingDetails(this.issueId).subscribe({
      next: (next) => {
        this.issueDetails = next.data;

        this.infoForm.patchValue(this.issueDetails);
        if (this.infoForm.get('startDateType')?.value) {
          if (this.infoForm.get('startDateType')?.value === DateType.Gregorian) {
            this.selectedDateType = DateType.Gregorian;
          } else {
            this.selectedDateType = DateType.Hijri;
          }
        }
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
        this.changeType();
        this.infoForm.get('startDate')?.setValue(currentDate);
        var timeString = next.data.startTime;
        var timeComponents = timeString.match(/(\d+):(\d+)\s(.+)/);
        var hour = parseInt(timeComponents[1]);
        var minute = parseInt(timeComponents[2]);
        var amPmIndicator = timeComponents[3];
        // Step 2: Adjust hour based on AM/PM indicator
        if (amPmIndicator === 'ص' && hour === 12) {
          hour = 0; // 12 AM is represented as 0 in 24-hour format
        } else if (amPmIndicator === 'م' && hour < 12) {
          hour += 12; // Add 12 hours for PM times (1 PM to 11 PM)
        }

        this.time = {
          hour: hour,
          minute: minute,
          second: 0,
        };
        this.startTime = next.data.startTime;
        this.infoForm.get('Time')?.setValue(this.time);

        this.selectEntity(this.issueDetails.courtType, true);

        //if communitte
        if (!this.issueDetails.isDraft) {
          if (this.newStep1) {
            this.infoForm.patchValue(this.newStep1);
          }
        }
        this.cdr.detectChanges();
        this.spinner.hide();
      },
    });
  }
  returnTime(time: any) {
    return `${time.hour.toString().padStart(2, '0')}:${time.minute
      .toString()
      .padStart(2, '0')}`;
  }

  tConvert(time: any): void {
    // Check correct time format and split into components
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;
    const matches = time.toString().match(timePattern);

    if (matches) {
      // If time format is correct
      const hours = parseInt(matches[1], 10);
      const minutes = parseInt(matches[2], 10);
      const period = hours < 12 ? 'AM' : 'PM';

      // Adjust hours to 12-hour format
      const adjustedHours = hours % 12 || 12;

      // Format the time as "hh:mm tt"
      const formattedTime = `${adjustedHours
        .toString()
        .padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
      this.startTime = formattedTime;
      this.cdr.detectChanges();
    }

    // If the time format is incorrect, return the original string
    // return time.toString();
  }
  change() {
    let startTime = this.time;
    this.infoForm
      .get('startTime')
      ?.setValue(
        `${pad(startTime.hour)}:${pad(startTime.minute)}:${pad(
          startTime.second
        )}`
      );
  }
  //init form
  initForm() {
    this.infoForm = this.fb.group({
      id: [],
      name: [null, Validators.compose([Validators.required])],
      startDate: [null,],
      Time: [
        {
          hour: 1,
          minute: 1,
          second: 0,
        },
        Validators.compose([Validators.required]),
      ],
      startTime: [, Validators.compose([Validators.required])],
      lawsuitId: [null, Validators.compose([Validators.required])],
      sittingType: [null],
      courtId: [null],
      sittingStatus: [null],
      committeeId: [null],
      committee: [null],
      court: [null],
      sittingLink: [null],
      otherCourtType: [null],
      otherCourt: [null],
      otherCommittee: [null],
      subCourtId: [null],
      subCourt: [null],
      otherSubCourt: [null],
      subDistrict: [null],
      startDateType: [null],
    });
    if (this.lawaistId != 0) {
      this.infoForm.get('lawsuitId')?.setValue(this.lawaistId);
    }

    // Store original validators
    for (const key in this.infoForm.controls) {
      if (this.infoForm.controls.hasOwnProperty(key)) {
        this.originalValidators[key] =
          this.infoForm.get(key)?.validator || null;
      }
    }
  }
  //choose entity
  otherCourtType: boolean = false;
  subDistrict: boolean = false;
  committee: boolean = false;
  court: boolean = false;
  EntityChoosen: any;
  EntityChoosenID: any;
  selectEntity(e: any, patch: boolean) {
    this.EntityChoosenID = e;
    this.EntityChoosen = this.entityList?.filter((x: any) => x.id == e)[0].name;
    this.otherCourt = false;
    this.otherCommittee = false;
    this.subDistrict = false;
    this.committee = false;
    this.court = false;
    this.otherCourtType = false;
    this.subCourt = false;
    this.otherSubCourt = false;
    this.infoForm.patchValue({
      courtId: null,
      otherCourt: null,
      committeeId: null,
      otherCommittee: null,
      subCourtId: null,
      otherSubCourt: null,
      subDistrict: null,
      otherCourtType: null,
      court: null,
      committee: null,
      subCourt: null,
    });
    this.cdr.detectChanges();
    //
    if (this.issueId) {
      //reset the Validation
      for (const key in this.infoForm.controls) {
        if (this.infoForm.controls.hasOwnProperty(key)) {
          const control = this.infoForm.get(key);
          if (control) {
            control.setValidators(this.originalValidators[key]);
            control.updateValueAndValidity();
          }
        }
      }
    }

    // choose other
    if (e == this.entityType['addIssue.Other']) {
      this.otherCourtType = true;
      this.infoForm.get('otherCourtType')?.setValidators(Validators.required);
      this.infoForm.get('otherCourtType')?.updateValueAndValidity();
      if (this.isEdit) {
        this.infoForm
          .get('otherCourtType')
          ?.setValue(this.issueDetails.otherCourtType);
      }
      this.cdr.detectChanges();

      // choose not other
    } else if (e != this.entityType['addIssue.Other']) {
      this.infoForm.get('otherCourtType')?.setValidators(null);
      this.infoForm.get('otherCourtType')?.updateValueAndValidity();
      this.cdr.detectChanges();

      //choose prisons,police,represent
      if (
        e == this.entityType['addIssue.Prisons'] ||
        e == this.entityType['addIssue.PoliceStation'] ||
        e == this.entityType['addIssue.Representative']
      ) {
        this.subDistrict = true;
        this.infoForm.get('subDistrict')?.setValidators(Validators.required);
        this.infoForm.get('subDistrict')?.updateValueAndValidity();
        if (this.isEdit && patch) {
          this.infoForm
            .get('subDistrict')
            ?.setValue(this.issueDetails.subDistrict);
        }
        this.cdr.detectChanges();

        //choose committee
      } else if (e == this.entityType['addIssue.Committee']) {
        this.committee = true;
        this.infoForm.get('committeeId')?.setValidators(Validators.required);
        this.infoForm.get('committeeId')?.updateValueAndValidity();
        this.getCommittee();

        if (this.isEdit) {
          this.infoForm
            .get('committeeId')
            ?.setValue(this.issueDetails.committeeId);
          this.infoForm.get('committee')?.setValue(this.issueDetails.committee);
          this.changeCommunitte(this.issueDetails.committeeId);
        }
        this.cdr.detectChanges();

        //choose court general / Administrative
      } else if (
        e == this.entityType['addIssue.AdministrativeCourt'] ||
        e == this.entityType['addIssue.GeneralCourt'] ||
        e == this.entityType['addIssue.MinistryOfHumanResources']
      ) {
        this.getCourt(e);
        this.court = true;
        this.infoForm.get('courtId')?.setValidators(Validators.required);
        this.infoForm.get('courtId')?.updateValueAndValidity();
        if (this.isEdit && patch) {
          //  ;
          this.infoForm.get('courtId')?.setValue(this.issueDetails.courtId);
          this.infoForm.get('court')?.setValue(this.issueDetails.court);
          this.changeMainCourt(this.issueDetails.courtId, patch);
        }
        this.cdr.detectChanges();
      }
    }
  }

  //choose communitte
  otherCommittee: boolean = false;
  changeCommunitte(e: any) {
    this.infoForm.patchValue({
      otherCommittee: null,
    });
    this.infoForm.get('otherCommittee')?.setValidators(null);
    this.infoForm.get('otherCommittee')?.updateValueAndValidity();
    setTimeout(() => {
      let communitte = this.committeeList.filter((x: any) => x.id == e)[0];
      let communitteCategory = this.committeeList.filter(
        (x: any) => x.id == e
      )[0].categoryType;
      if (this.EntityChoosenID == this.entityType['addIssue.Committee']) {
        if (communitteCategory == CategoryType.Other) {
          this.otherCommittee = true;
          this.infoForm
            .get('otherCommittee')
            ?.setValidators(Validators.required);
          this.infoForm.get('otherCommittee')?.updateValueAndValidity();
          if (this.isEdit) {
            this.infoForm
              .get('otherCommittee')
              ?.setValue(this.issueDetails.otherCommittee);
          }
          this.cdr.detectChanges();
        } else if (communitteCategory != CategoryType.Other) {
          this.otherCommittee = false;
          this.infoForm.get('otherCommittee')?.setValidators(null);
          this.infoForm.get('otherCommittee')?.updateValueAndValidity();
          this.infoForm
            .get('committee')
            ?.setValue(
              this.lang === 'ar' ? communitte.nameAr : communitte.nameEn
            );
        }
      } else {
        this.otherCommittee = false;
      }
    }, 500);
    this.cdr.detectChanges();
  }

  //choose mainCourt
  otherCourt: boolean = false;
  subCourt: boolean = false;
  changeMainCourt(e: any, patch: any) {
    this.otherSubCourt = false;
    this.subCourt = false;
    this.infoForm.patchValue({
      otherCourt: null,
      subCourtId: null,
      subCourt: null,
      otherSubCourt: null,
    });
    this.infoForm.get('otherSubCourt')?.setValidators(null);
    this.infoForm.get('otherSubCourt')?.updateValueAndValidity();
    this.infoForm.get('otherCourt')?.setValidators(null);
    this.infoForm.get('otherCourt')?.updateValueAndValidity();
    this.infoForm.get('subCourtId')?.setValidators(null);
    this.infoForm.get('subCourtId')?.updateValueAndValidity();
    setTimeout(() => {
      let court = this.courtList.filter((x: any) => x.id == e)[0];
      let courtCategory = this.courtList.filter((x: any) => x.id == e)[0]
        .categoryType;
      if (
        this.EntityChoosenID ==
        this.entityType['addIssue.AdministrativeCourt'] ||
        this.EntityChoosenID == this.entityType['addIssue.GeneralCourt'] ||
        this.EntityChoosenID ==
        this.entityType['addIssue.MinistryOfHumanResources']
      ) {
        if (courtCategory == CategoryType.Other) {
          this.otherCourt = true;
          this.infoForm.get('otherCourt')?.setValidators(Validators.required);
          this.infoForm.get('otherCourt')?.updateValueAndValidity();
          if (this.isEdit && patch) {
            this.infoForm
              .get('otherCourt')
              ?.setValue(this.issueDetails.otherCourt);
          }
          this.cdr.detectChanges();
        } else if (courtCategory != CategoryType.Other) {
          this.otherCourt = false;
          this.infoForm.get('otherCourt')?.setValidators(null);
          this.infoForm.get('otherCourt')?.updateValueAndValidity();
          if (
            this.EntityChoosenID !=
            this.entityType['addIssue.MinistryOfHumanResources']
          ) {
            this.getSubCourt(e);
            setTimeout(() => {
              if (this.subCourtList.length !== 0) {
                this.subCourt = true;
                this.cdr.detectChanges()
                this.infoForm
                  .get('court')
                  ?.setValue(this.lang === 'ar' ? court.nameAr : court.nameEn);
                if (this.isEdit && patch) {
                  this.infoForm
                    .get('subCourtId')
                    ?.setValue(this.issueDetails.subCourtId);
                  this.infoForm
                    .get('subCourt')
                    ?.setValue(this.issueDetails.subCourt);
                  this.changeSubCourt(this.issueDetails.subCourtId, patch);
                }
              } else {
                this.subCourt = false;

              }
            }, 1000);

          }
          this.cdr.detectChanges();
        }
      }
    }, 1000);
  }
  //change sub court
  otherSubCourt: boolean = false;
  changeSubCourt(e: any, patch: any) {
    this.otherSubCourt = false;
    this.infoForm.patchValue({
      otherSubCourt: null,
    });
    this.infoForm.get('otherSubCourt')?.setValidators(null);
    this.infoForm.get('otherSubCourt')?.updateValueAndValidity();
    setTimeout(() => {
      let subCourt = this.subCourtList.filter((x: any) => x.id == e)[0];

      let subCourtCategory = this.subCourtList.filter((x: any) => x.id == e)[0]
        .categoryType;
      if (
        this.EntityChoosenID ==
        this.entityType['addIssue.AdministrativeCourt'] ||
        this.EntityChoosenID == this.entityType['addIssue.GeneralCourt'] ||
        this.EntityChoosenID ==
        this.entityType['addIssue.MinistryOfHumanResources']
      ) {
        if (subCourtCategory == CategoryType.Other) {
          this.otherSubCourt = true;
          this.cdr.detectChanges();
          this.infoForm
            .get('otherSubCourt')
            ?.setValidators(Validators.required);
          this.infoForm.get('otherSubCourt')?.updateValueAndValidity();
          if (this.isEdit && patch) {
            this.infoForm
              .get('otherSubCourt')
              ?.setValue(this.issueDetails.otherSubCourt);
          }
          this.cdr.detectChanges();
        } else if (subCourtCategory != CategoryType.Other) {
          this.otherSubCourt = false;
          this.infoForm.get('otherSubCourt')?.setValidators(null);
          this.infoForm.get('otherSubCourt')?.updateValueAndValidity();
          this.infoForm
            .get('subCourt')
            ?.setValue(this.lang === 'ar' ? subCourt.nameAr : subCourt.nameEn);
        }
        this.cdr.detectChanges();
      }
    }, 1000);
  }
  //return template of subject
  getSubjectValue() {
    this.infoForm.get('subject')?.setValue(this.subjectValue);
  }

  //get client list accoriding to branch ID
  getClientList() {
    let BranchId = this.infoForm.get('branchId')?.value;
    if (BranchId && BranchId !== 'null') {
      this._sittingManagementService.getClientList(BranchId).subscribe({
        next: (next) => {
          this.spinner.hide();
          this.clientList = next.data;
          this.cdr.detectChanges();
        },
      });
      this._sittingManagementService.getLawsuitInBranch(BranchId).subscribe({
        next: (next) => {
          this.spinner.hide();
          this.lawaist = next.data;
          this.cdr.detectChanges();
        },
      });
    }
  }
  ///branch
  getBranchList() {
    this._sittingManagementService.getBranch().subscribe({
      next: (next) => {
        this.branches = next.data;
        this.cdr.detectChanges();
      },
    });
  }
  //back function
  Back() {
    this.router.navigate(['/agent/departments/court-sessions']);
  }
  submit() {
    this.tConvert(this.returnTime(this.infoForm.get('Time')?.value));
    this.infoForm.get('startTime')?.setValue(this.startTime);
    if (this.infoForm.invalid) {
      Object.keys(this.infoForm.controls).forEach((field) => {
        // {1}
        const control = this.infoForm.get(field); // {2}
        control?.markAsTouched({ onlySelf: true }); // {3}
      });
      return;
    }
    if (this.infoForm.valid) {
      this.infoForm.value.lawsuitId = +this.infoForm.value.lawsuitId;
      this.infoForm.value.sittingStatus = +this.infoForm.value.sittingStatus;
      this.infoForm.value.sittingType = +this.infoForm.value.sittingType;

      if (this.infoForm.value.courtType == this.courtType.Court) {
        this.infoForm.value.committeeId = null;
        this.infoForm.value.committee = null;
        let courtName = this.mainCourt.find(
          (i: any) => i.id == this.infoForm.value.courtId
        );
        this.infoForm.value.court =
          this.lang == 'ar' ? courtName.nameAr : courtName.nameEn;
      }
      this.spinner.show();

      if (this.issueId) {
        if (this.issueDetails.isDraft) {
          this._sittingManagementService
            .editSitting(this.infoForm.value)
            .subscribe({
              next: (next) => {
                this.spinner.hide();
                if (next.success) {
                  this.bindValue.emit({
                    id: this.issueId,
                    isSuccess: next.success,
                  });
                } else {
                  this.spinner.hide();
                  this.bindValue.emit({
                    id: this.issueId,
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
          this.spinner.hide();
          this.bindValue.emit({
            id: this.issueId,
            isSuccess: true,
            data: this.infoForm.value,
          });
        }
      } else {
        this._sittingManagementService
          .addSitting(this.infoForm.value)
          .subscribe({
            next: (next) => {
              this.spinner.hide();
              if (next.success) {
                this.issueId = next.data;
                this.router.navigate([
                  '/agent/departments/court-sessions/add-edit-court-sessions',
                  this.lawaistId,
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
                  isAdd: true,
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
