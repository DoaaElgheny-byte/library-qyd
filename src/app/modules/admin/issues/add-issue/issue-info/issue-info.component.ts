import { filter } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
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
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { TranslationService } from 'src/app/i18n';
import { IssuesService } from 'src/app/services/api/issues.service';
import {
  CategoryType,
  ClientStaus,
  CourtType,
  EntityType,
  LawsuitStatus,
  LawsuitTypeEnum,
  MainCourtType,
} from 'src/app/services/enums/lawsuit';
import { ClientService } from 'src/app/services/api/client.service';
import { ClientType } from 'src/app/services/enums/client';
import { ConfirmationDialogService } from 'src/app/modules/SharedComponent/SharedComponent/confirmation-dialog/confirmation-dialog.service';
import { AppConfirmService } from 'src/app/modules/SharedComponent/SharedComponent/app-confirm/app-confirm.service';
import { Payment } from 'src/app/services/enums/payment-conditions.enum';
import { AuthService } from 'src/app/modules/auth';
import { Constants } from 'src/app/services/Constants/constants';
import { DateFormatterService, DateType } from 'ngx-hijri-gregorian-datepicker';

@Component({
  selector: 'app-issue-info',
  templateUrl: './issue-info.component.html',
  styleUrls: ['./issue-info.component.scss'],
})
export class IssueInfoComponent implements OnInit {
  isEdit: boolean;
  infoForm: FormGroup;
  hasError: boolean;
  isLoading$: Observable<boolean>;
  private unsubscribe: Subscription[] = [];
  lang: string | null = localStorage.getItem('language');
  courtList: any;
  subCourtList: any;
  committeeList: any;
  clientType = ClientType;
  branches: any;
  lawsuitType = LawsuitTypeEnum;
  lawsuitStatus = LawsuitStatus;
  entityType = EntityType;
  clientStaus = ClientStaus;
  showCourt: boolean = true;
  subjectValue =
    'السلام عليكم ورحمة الله وبركاته.\n \n إلى السيد الفاضل رئيس محكمة….\n\n إنه في يوم….تم رفع دعوى مطالبة مالية من مكتب……للمحاماة، بموجب عقد وكالة من السيد…..المقيم في…. رقم الهوية الوطنية…. رقم التوكيل…. ضد السيد….المقيم في….. الوقائع: المتطلبات: لذلك نتطلب من فضيلتكم بالنيابة عن موكلي التالي:';
  @Output() bindValue: EventEmitter<any> = new EventEmitter<any>();
  @Input() issueDetails: any;
  @Input() id: any;
  issueId: any;
  isDisable = false;
  clientList: any;
  dateText: any;
  dateEndText: any;
  @Input() newStep1: any;
  @Input() isAuth: boolean;
  startingEditMode: boolean;
  endAfterStart: boolean = true;
  entityList: any;
  originalValidators: { [key: string]: ValidatorFn | ValidatorFn[] | null } =
    {};

  ///date
  expirationDate: any;
  EndDate: any;
  @ViewChild('expirationDatePicker') expirationDatePicker: any;
  @ViewChild('EndDatePicker') EndDatePicker: any;
  currentUser: any;
  isEmployee: boolean;
  currentDateH: any;
  currentDateG: any;
  selectedDateType = DateType.Hijri;
  selectedEndDateType = DateType.Hijri;
  minDateH: any;
  minDateG: any;
  isAddNewCaseFromProject: any;
  constructor(
    private dateFormatter: DateFormatterService,
    private fb: FormBuilder,
    private translationService: TranslationService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private _clientService: ClientService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private _lawsuitManagementService: IssuesService,
    public datepipe: DatePipe,
    public route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationDialogService,
    private appconfirmservice: AppConfirmService,
    private authService: AuthService
  ) {
    this.getCondition();
    this.minDateG = this.dateFormatter.ToGregorianDateStruct('1800-01-01', 'YYYY-MM-DD');
    this.minDateH = this.dateFormatter.ToGregorianDateStruct('1214-01-01', 'YYYY-MM-DD');
    this.isAddNewCaseFromProject = localStorage.getItem('addNewCaseFromProject')

  }
  backToProject() {
    localStorage.removeItem('addNewCaseFromProject')
    // admin/departments/project-management/add-edit-project
    this.router.navigate(['../../project-management/add-edit-project'], { relativeTo: this.route });

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
      this.infoForm.controls.date.setValue(currentDateVal);
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
        this.infoForm.controls.date.setValue(currentDateVal);
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

  selectedDateChangeEnd(event: any) {
    if (!this.EndDate) {
      return;
    }
    if (!this.expirationDate) {
      let currentDateVal = new Date(this.EndDatePicker.getSelectedDate());

      const timezoneOffset = currentDateVal.getTimezoneOffset();

      currentDateVal.setMinutes(currentDateVal.getMinutes() + timezoneOffset);
      currentDateVal.setDate(currentDateVal.getDate() + 1);
      this.infoForm.controls.expirationDate.setValue(currentDateVal);
    } else {
      if (
        this.expirationDatePicker.getSelectedDate() <
        this.EndDatePicker.getSelectedDate()
      ) {
        let currentDateVal = new Date(this.EndDatePicker.getSelectedDate());

        const timezoneOffset = currentDateVal.getTimezoneOffset();

        currentDateVal.setMinutes(currentDateVal.getMinutes() + timezoneOffset);
        currentDateVal.setDate(currentDateVal.getDate() + 1);
        this.infoForm.controls.expirationDate.setValue(currentDateVal);
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
        this.issueId = next['id'];
      },
    });
    // this.getCommittee();
    this.initForm();
    this.getBranchList();
    this.getEntityList();
    if (this.issueId && this.isAuth) {
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
  getClientListOnly() {
    let BranchId = this.infoForm.get('branchId')?.value;
    if (BranchId && BranchId !== 'null') {
      this._lawsuitManagementService.getClientListonly(BranchId).subscribe({
        next: (next) => {
          this.spinner.hide();
          this.clientList = next.data;
          this.cdr.detectChanges();
        },
      });
    }
  }
  //get client list accoriding to branch ID
  getClientList() {
    let BranchId = this.infoForm.get('branchId')?.value;
    let type = this.infoForm.get('type')?.value;
    if (BranchId && type && BranchId !== 'null') {
      this._lawsuitManagementService.getClientList(BranchId, type).subscribe({
        next: (next) => {
          this.spinner.hide();
          this.clientList = next.data;
          this.cdr.detectChanges();
        },
      });
    }
  }
  //get get Committee
  getCommittee() {
    this._lawsuitManagementService.getCommittee().subscribe({
      next: (next) => {
        this.spinner.hide();
        this.committeeList = next.data;
        this.cdr.detectChanges();
      },
    });
  }
  //add start date
  setValueOfDate() {
    if (this.dateEndText != undefined) {
      const jsDate1 = new Date(
        this.dateText.year,
        this.dateText.month - 1,
        this.dateText.day
      );

      const jsDate2 = new Date(
        this.dateEndText.year,
        this.dateEndText.month - 1,
        this.dateEndText.day
      );
      if (jsDate1 < jsDate2) {
        this.infoForm.get('date')?.setValue(this.dateText);
        this.endAfterStart = true;
      } else {
        this.dateText = null;
        this.endAfterStart = false;
      }
    } else {
      this.infoForm.get('date')?.setValue(this.dateText);
      this.endAfterStart = true;
    }
  }
  //add End date
  setValueOfEndDate() {
    if (this.dateText != undefined) {
      const jsDate1 = new Date(
        this.dateText.year,
        this.dateText.month - 1,
        this.dateText.day
      );

      const jsDate2 = new Date(
        this.dateEndText.year,
        this.dateEndText.month - 1,
        this.dateEndText.day
      );
      if (jsDate1 < jsDate2) {
        this.infoForm.get('expirationDate')?.setValue(this.dateEndText);
        this.endAfterStart = true;
      } else {
        this.endAfterStart = false;
        this.dateEndText = null;
      }
    } else {
      this.infoForm.get('expirationDate')?.setValue(this.dateEndText);
      this.endAfterStart = true;
    }
  }
  getBranchList() {
    this._clientService.getBranchesList().subscribe({
      next: (next) => {
        this.branches = next.data;
        this.cdr.detectChanges();
      },
    });
  }
  oldBranch: any;
  //get case details
  getIssueById() {
    this.spinner.show();
    this._lawsuitManagementService.getLawsuitDetails(this.issueId).subscribe({
      next: (next) => {

        this.isEdit = true;
        this.startingEditMode = true;
        this.issueDetails = next.data;
        this.issueDetails.type = next.data.clientResponseDto.type;
        if (!this.issueDetails.isDraft) {
          if (this.newStep1) {
            this.issueDetails = this.newStep1;
          }
        }

        this.infoForm.patchValue(this.issueDetails);
        this.infoForm.get('branchId')?.patchValue(next.data.branchId);
        this.oldBranch = this.infoForm.value.branchId;
        this.getClientListOnly();
        setTimeout(() => {
          this.infoForm.patchValue({
            clientId: next.data.clientResponseDto,
          });
        }, 500);
        if (this.infoForm.get('startDateType')?.value) {
          if (
            this.infoForm.get('startDateType')?.value === DateType.Gregorian
          ) {
            this.selectedDateType = DateType.Gregorian;
          } else {
            this.selectedDateType = DateType.Hijri;
          }
        }
        if (this.infoForm.get('expirationDateType')?.value) {
          if (this.infoForm.get('expirationDateType')?.value === DateType.Gregorian) {
            this.selectedEndDateType = DateType.Gregorian;
          } else {
            this.selectedEndDateType = DateType.Hijri;
          }
        }
        if (next.data.date) {
          let currentDate = next.data.date.substring(0, 10);

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
          this.infoForm.get('date')?.setValue(currentDate);
        }

        if (next.data.expirationDate) {
          let endOfDate = next.data.expirationDate.substring(0, 10);

          if (endOfDate) {
            if (this.infoForm.get('expirationDateType')?.value == DateType.Gregorian) {
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
          this.infoForm.get('expirationDate')?.setValue(endOfDate);
        }

        //courType

        this.selectEntity(this.issueDetails.courtType, true);
        this.cdr.detectChanges();
        this.spinner.hide();
        this.startingEditMode = false;
      },
    });
  }
  //init form
  initForm() {
    this.infoForm = this.fb.group({
      id: [],
      courtType: [null, Validators.compose([Validators.required])],
      otherCourtType: [null],
      courtId: [null, Validators.compose([Validators.required])],
      otherCourt: [null],
      committeeId: [null],
      otherCommittee: [null],
      subCourtId: [null, Validators.compose([Validators.required])],
      otherSubCourt: [null],
      subDistrict: [null],
      lawsuitType: [null,],
      subLawsuitType: [null],
      date: [null,],
      expirationDate: [null],
      branchId: [null, Validators.compose([Validators.required])],
      number: [
        null,
      ],
      lawsuitStatus: [null,],
      subject: [
        this.subjectValue,
      ],
      plaintiffRequests: [
        this.subjectValue,
      ],
      plaintiffGrounds: [
        this.subjectValue,
      ],
      defendantRequests: [
        this.subjectValue,
      ],
      defendantGrounds: [
        this.subjectValue,
      ],
      clientId: [null, Validators.compose([Validators.required])],
      clientStaus: [null, Validators.compose([Validators.required])],
      court: [],
      committee: [],
      subCourt: [],
      type: [this.clientType.Individual],
      client: [],
      branch: [],
      clientResponseDto: [],
      expirationDateType: [null],
      startDateType: [null],
    });
    // Store original validators
    for (const key in this.infoForm.controls) {
      if (this.infoForm.controls.hasOwnProperty(key)) {
        this.originalValidators[key] =
          this.infoForm.get(key)?.validator || null;
      }
    }
  }
  //changeBranch
  changeBranch(e: any) {
    this.infoForm.get('clientId')?.setValue(null);
    this.infoForm.get('clientResponseDto')?.setValue(null);
    this.infoForm.get('type')?.setValue(null);

    this.getClientListOnly();
    if (this.isEdit) {
      this.confirmDelete(this.oldBranch);
    }
  }

  //confirmToDeleteranch
  confirmDelete(branchId: any) {
    this.confirmationService
      .confirm(
        this.translate.instant('emplyeeEditAdd.confirmModalTitle'),
        this.translate.instant('addIssue.confirmDelteBranch'),
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
            this.infoForm.get('branchId')?.patchValue(this.oldBranch);
            this.spinner.hide();
            this.cdr.detectChanges();
          }
        },
        () => {
          this.infoForm.get('branchId')?.patchValue(this.oldBranch);
          this.spinner.hide();
        }
      );
  }
  //delete branch
  DeleteBranch(branchId: any) {
    this._lawsuitManagementService
      .confirmDeleteEmployeeBranch(branchId)
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
  //changeClient
  changeClient(clientId: any) {
    // this.infoForm.get('clientId')?.valueChanges.subscribe((clientId) => {
    if (clientId) {
      let clientData = this.clientList?.find((i: any) => i.id === clientId);

      this.infoForm.get('clientResponseDto')?.setValue(clientId);
      this.infoForm.get('type')?.setValue(clientId.type);
    }
    // });
  }
  compareType(item1: any, item2: any): boolean {
    return item1 && item2 && item1.id === item2.id;
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
          this.cdr.detectChanges();
        }
      } else {
        this.otherCommittee = false;
      }
    }, 500);
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
            this.EntityChoosenID != this.entityType['addIssue.MinistryOfHumanResources']
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
  getSubjectValue(name: any) {
    this.infoForm.get(name)?.setValue(this.subjectValue);
  }
  @ViewChild('myTextarea') myTextarea: ElementRef;
  @ViewChild('myTextarea2') myTextarea2: ElementRef;
  @ViewChild('myTextarea3') myTextarea3: ElementRef;

  editText(name: HTMLTextAreaElement) {
    name.focus();
    name.setSelectionRange(0, 0);
  }

  //back function
  Back() {
    this.router.navigate(['/agent/departments/cases']);
  }
  submit() {
    debugger
    let val = this.infoForm.get('clientStaus')?.value;
    localStorage.setItem('clientStausForCases', val)
    if (this.infoForm.invalid) {
      Object.keys(this.infoForm.controls).forEach((field) => {
        // {1}
        const control = this.infoForm.get(field); // {2}
        control?.markAsTouched({ onlySelf: true }); // {3}
      });
      return;
    }
    if (this.infoForm.valid && this.endAfterStart) {
      let branchName = this.branches.find(
        (i: any) => i.id == this.infoForm.value.branchId
      );

      if (branchName !== undefined && branchName) {
        this.infoForm.value.branch = branchName.name;
      }
      if (!this.infoForm.value.clientResponseDto) {
        let clientName = this.clientList.find(
          (i: any) => i.id == this.infoForm.value.clientId
        );
        this.infoForm.value.client = clientName.name;
        this.infoForm.value.clientResponseDto = clientName;
      }

      this.infoForm.value.lawsuitType = +this.infoForm.value.lawsuitType;
      this.infoForm.value.lawsuitStatus = +this.infoForm.value.lawsuitStatus;
      if (this.infoForm.value.clientResponseDto)
        this.infoForm.value.clientId = this.infoForm.value.clientResponseDto.id;
      this.spinner.show();

      if (this.issueId) {
        if (this.issueDetails.isDraft) {
          this._lawsuitManagementService
            .editLawsuit(this.infoForm.value)
            .subscribe({
              next: (next) => {
                this.spinner.hide();
                if (next.success) {
                  localStorage.setItem('addNewCaseFromProject', 'true')

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
        this._lawsuitManagementService
          .addLawsuit(this.infoForm.value)
          .subscribe({
            next: (next) => {
              this.spinner.hide();
              if (next.success) {
                this.issueId = next.data;
                this.router.navigate([
                  '/agent/departments/cases/add-issue',
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
    localStorage.removeItem('addNewCaseFromProject')

  }
}
