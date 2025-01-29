import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { IssuesService } from 'src/app/services/api/issues.service';
import { AcceptEditComponent } from '../accept-edit/accept-edit.component';
import {
  CategoryType,
  ClientStaus,
  EntityType,
  FilesType,
  LawsuitState,
  LawsuitStatus,
  LawsuitType,
  LawsuitTypeEnum,
  NationalType,
} from 'src/app/services/enums/lawsuit';
import { ClientType } from 'src/app/services/enums/client';
import { DateFormatterService, DateType } from 'ngx-hijri-gregorian-datepicker';

@Component({
  selector: 'app-review-request',
  templateUrl: './review-request.component.html',
  styleUrls: ['./review-request.component.scss'],
})
export class ReviewRequestComponent implements OnInit {
  @Output() bindValue: EventEmitter<any> = new EventEmitter<any>();
  issueDetails: any;
  lawsuitStatus = LawsuitStatus;
  @Input() newStep1: any;
  @Input() newStep2: any;
  @Input() newStep3: any;
  @Input() newStep4: any;
  clientType = ClientType;
  issueId: any;
  issueTypes = LawsuitTypeEnum;
  issueState = LawsuitState;
  fileType = FilesType;
  nationalType = NationalType;
  lang: string | null = localStorage.getItem('language');
  clientStaus = ClientStaus;
  startDate: any;
  endDate: any;
  isAddNewCaseFromProject: any;
  constructor(
    private translate: TranslateService,
    private toastr: ToastrService,
    private _lawsuitManagementService: IssuesService,
    private spinner: NgxSpinnerService,
    public route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private dateFormatter: DateFormatterService,
  ) {
    this.isAddNewCaseFromProject = localStorage.getItem('addNewCaseFromProject')

  }
  ngAfterViewChecked() {
    this.lang = localStorage.getItem('language');
    this.cdr.detectChanges();
  }
  ngOnInit(): void {
    localStorage.setItem('step', '5');
    this.route.params.subscribe({
      next: (next) => {
        this.issueId = next['id'];
      },
    });
    this.getEntityList();
    if (this.issueId) {
      this.getIssueById();
    }
  }
  entityList: any;
  entityType = EntityType;
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
  private modalService = inject(NgbModal);
  getIssueById() {
    this._lawsuitManagementService.getLawsuitDetails(this.issueId).subscribe({
      next: (next) => {
        this.issueDetails = next.data;

        this.updateData();
        //startDate
        if (this.issueDetails.date) {
          let currentDate = this.issueDetails.date.substring(0, 10);

          if (currentDate) {
            if (this.issueDetails.startDateType) {
              if (this.issueDetails.startDateType == DateType.Gregorian) {
                this.startDate =
                  this.dateFormatter.ToGregorianDateStruct(
                    currentDate,
                    'YYYY-MM-DD'
                  );
              } else {
                this.startDate =
                  this.dateFormatter.ToHijriDateStruct(
                    currentDate,
                    'YYYY-MM-DD'
                  );
              }
            }
          } else {
            this.startDate = null;
          }
        }

        //endDate
        if (this.issueDetails.expirationDate) {
          let endOfDate = this.issueDetails.expirationDate.substring(0, 10);

          if (endOfDate) {
            if (this.issueDetails.expirationDateType === DateType.Gregorian) {
              this.endDate =
                this.dateFormatter.ToGregorianDateStruct(
                  endOfDate,
                  'YYYY-MM-DD'
                );
            } else {
              this.endDate = this.dateFormatter.ToHijriDateStruct(
                endOfDate,
                'YYYY-MM-DD'
              );
            }
          } else {
            this.endDate = null;
          }
        }
        // }
        this.cdr.detectChanges();
      },
    });
  }
  format(date: NgbDateStruct): string {
    if (!date) {
      return '';
    }

    const day = this.isNumber(date.day) ? this.padNumber(date.day) : '';
    const month = this.isNumber(date.month) ? this.padNumber(date.month) : '';
    const year = date.year;

    return `${day}-${month}-${year}`;
  }

  isNumber(value: any): value is number {
    return !isNaN(value as number);
  }

  padNumber(value: number): string {
    return value.toString().padStart(2, '0');
  }
  EntityChoosen: any;
  updateData() {
    let step1 = this.newStep1 ? this.newStep1 : this.issueDetails;

    this.issueDetails = {
      ...step1,
      plaintiffs: this.newStep2 ? this.newStep2 : this.issueDetails.plaintiffs,
      defendants: this.newStep3 ? this.newStep3 : this.issueDetails.defendants,
      lawsuitFiles: this.newStep4
        ? this.newStep4
        : this.issueDetails.lawsuitFiles,
    };
    this.EntityChoosen = this.entityList.filter(
      (x: any) => x.id == this.issueDetails.courtType
    )[0].name;

    this.cdr.detectChanges();
  }
  courtList: any;
  otherCourtId: any;
  CategoryType = CategoryType;
  //get main court
  getCourt(courtType: any) {
    this._lawsuitManagementService.getCourtByType(courtType).subscribe({
      next: (next) => {
        if (next.success) {
          this.spinner.hide();
          this.courtList = next.data;
          this.otherCourtId = this.courtList.filter(
            (x: any) => x.categoryType == CategoryType.Other
          )[0].id;
          this.cdr.detectChanges();
        }
      },
    });
  }
  subCourtList: any;
  otherSubCourtId: any;
  //get Sub Court
  getSubCourt(courtId: any) {
    this._lawsuitManagementService.getSubCourt(courtId).subscribe({
      next: (next) => {
        this.spinner.hide();
        this.subCourtList = next.data;
        this.cdr.detectChanges();
        this.otherSubCourtId = this.subCourtList.filter(
          (x: any) => x.categoryType == CategoryType.Other
        )[0].id;
      },
    });
  }
  submit() {
    debugger
    if (this.issueId && !this.issueDetails.isDraft) {
      const modalRef = this.modalService.open(AcceptEditComponent);

      modalRef.result.then(
        () => {
          let report = modalRef.componentInstance.infoForm.get('report')?.value;
          if (report != null) {
            this.spinner.show();
            this._lawsuitManagementService
              .editLawsuit(
                this.newStep1
                  ? this.newStep1
                  : {
                    id: this.issueId,
                    courtType: this.issueDetails.courtType,
                    courtId: this.issueDetails.courtId,
                    committeeId: this.issueDetails.committeeId,
                    lawsuitType: this.issueDetails.lawsuitType,
                    date: this.issueDetails.date,
                    branchId: this.issueDetails.branchId,
                    number: this.issueDetails.number,
                    lawsuitStatus: this.issueDetails.lawsuitStatus,
                    subject: this.issueDetails.subject,
                    plaintiffRequests: this.issueDetails.plaintiffRequests,
                    plaintiffGrounds: this.issueDetails.plaintiffGrounds,
                    clientId: this.issueDetails.clientId,
                    clientStaus: this.issueDetails.clientStaus,
                    type: this.issueDetails.type,
                  }
              )
              .subscribe({
                next: (next) => {
                  if (next.success) {
                    this._lawsuitManagementService
                      .addPlaintiff({
                        id: this.issueId,
                        plaintiffs: this.newStep2
                          ? this.newStep2
                          : this.issueDetails.plaintiffs
                            ? this.issueDetails.plaintiffs
                            : [],
                      })
                      .subscribe({
                        next: (next) => {
                          if (next.success) {
                            this._lawsuitManagementService
                              .addDefendant({
                                id: this.issueId,
                                defendants: this.newStep3
                                  ? this.newStep3
                                  : this.issueDetails.defendants
                                    ? this.issueDetails.defendants
                                    : [],
                              })
                              .subscribe({
                                next: (next) => {
                                  if (next.success) {
                                    this._lawsuitManagementService
                                      .addAttachment({
                                        id: this.issueId,
                                        files: this.newStep4
                                          ? this.newStep4
                                          : this.issueDetails.lawsuitFiles
                                            ? this.issueDetails.lawsuitFiles
                                            : [],
                                      })
                                      .subscribe({
                                        next: (next) => {
                                          if (next.success) {
                                            this._lawsuitManagementService
                                              .addReason({
                                                id: this.issueId,
                                                reason: report,
                                              })
                                              .subscribe({
                                                next: (next) => {

                                                  if (next.success) {
                                                    this.spinner.hide();

                                                    this.toastr.info(
                                                      this.translate.instant(
                                                        'addIssue.caseEditSuccess'
                                                      )
                                                    );



                                                    // } 
                                                    this.router.navigate([
                                                      '/agent/departments/cases',
                                                    ]);




                                                  } else {
                                                    this.spinner.hide();

                                                    this.toastr.info(
                                                      next.message
                                                    );
                                                  }
                                                },
                                                error: (error) => {
                                                  this.spinner.hide();
                                                  this.toastr.error(
                                                    error.error.error.message
                                                  );
                                                },
                                              });
                                          } else {
                                            this.spinner.hide();

                                            this.toastr.info(next.message);
                                          }
                                        },
                                        error: (error) => {
                                          this.spinner.hide();
                                          this.toastr.error(
                                            error.error.error.message
                                          );
                                        },
                                      });
                                  } else {
                                    this.spinner.hide();

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

                    this.toastr.error(next.message);
                  }
                },
                error: (error) => {
                  this.spinner.hide();

                  this.toastr.error(error.error.error.message);
                },
              });
          }
        },
        () => { }
      );
    } else {
      debugger
      this.spinner.show();
      this._lawsuitManagementService.changeToPublic(this.issueId).subscribe({
        next: (next) => {
          if (next.data) {
            alert('خلي بالك عدد القضايا المسموح ليك قرب يخلص ')
          }
          this.spinner.hide();
          if (this.isAddNewCaseFromProject == 'true') {
            this.router.navigate(['../../../project-management/add-edit-project'], { relativeTo: this.route });
            localStorage.removeItem('addNewCaseFromProject')
          } else {
            this.toastr.info(this.translate.instant('addIssue.caseAddSuccess'));
            this.router.navigate(['/agent/departments/cases']);
          }

        },
        error: (error) => {
          this.spinner.hide();
          this.toastr.error(error.error.error.message);
        },
      });
    }
  }
  Back() {
    this.bindValue.emit({
      isBack: true,
    });
  }
  ngOnDestroy() { }
}
