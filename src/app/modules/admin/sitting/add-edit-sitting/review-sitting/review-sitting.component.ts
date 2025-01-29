import { SittingManagementService } from './../../../../../services/api/sitting-management.service';
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

import { SittingState, SittingStatus } from 'src/app/services/enums/sitting';
import { ClientStaus, EntityType } from 'src/app/services/enums/lawsuit';
import { AcceptEditComponent } from '../accept-edit/accept-edit.component';
import { CourtType } from 'src/app/services/enums/court-type.enum';
import { SittingType } from 'src/app/services/enums/sitting-type.enum';
import { DateFormatterService, DateType } from 'ngx-hijri-gregorian-datepicker';

@Component({
  selector: 'app-review-sitting',
  templateUrl: './review-sitting.component.html',
  styleUrls: ['./review-sitting.component.scss'],
})
export class ReviewSittingComponent implements OnInit {
  @Output() bindValue: EventEmitter<any> = new EventEmitter<any>();
  issueDetails: any;
  sittingStatus = SittingStatus;
  clientStaus = ClientStaus;
  @Input() newStep1: any;
  @Input() newStep2: any;
  @Input() newStep3: any;
  @Input() newStep4: any;
  @Input() newStep5: any;
  sittingId: any;
  sittingState = SittingState;
  lang: string | null = localStorage.getItem('language');
  courtType = CourtType;
  sittingType = SittingType;
  startDate: any;
  endDate: any;
  constructor(
    private translate: TranslateService,
    private toastr: ToastrService,
    private _sittingManagementService: SittingManagementService,
    private spinner: NgxSpinnerService,
    public route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private dateFormatter: DateFormatterService,
  ) { }
  ngAfterViewChecked() {
    this.lang = localStorage.getItem('language');
    this.cdr.detectChanges();
  }
  ngOnInit(): void {

    localStorage.setItem('step', '3');
    this.route.params.subscribe({
      next: (next) => {
        this.sittingId = next['id'];
      },
    });
    this.getEntityList()
    if (this.sittingId) {
      this.getIssueById();
    }
  }
  private modalService = inject(NgbModal);
  getIssueById() {
    this._sittingManagementService.getSittingDetails(this.sittingId).subscribe({
      next: (next) => {
        this.issueDetails = next.data;
        if (this.issueDetails.courtType) {

          this.EntityChoosen = this.entityList?.filter((x: any) => x.id == this.issueDetails.courtType)[0].name;
        }
        //startDate

        if (next.data.startDate) {
          let currentDate = next.data.startDate.substring(0, 10);
          if (currentDate) {
            if (next.data.startDateType) {
              if (next.data.startDateType == DateType.Gregorian) {
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
        if (this.newStep1 && this.newStep2) {
          this.updateData();
        }
        this.cdr.detectChanges();
      },
    });
  }
  entityList: any
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
  EntityChoosen: any
  updateData() {
    this.issueDetails = {
      ...this.newStep1,
      ...this.newStep2,
    };
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
  submit() {
    if (this.sittingId && !this.issueDetails.isDraft) {
      const modalRef = this.modalService.open(AcceptEditComponent);

      modalRef.result.then(
        () => {
          let report = modalRef.componentInstance.infoForm.get('report')?.value;
          if (report != null) {
            this.spinner.show();
            this._sittingManagementService
              .editSitting(
                this.newStep1
                  ? this.newStep1
                  : {
                    id: this.sittingId,
                    mainCourtId: this.issueDetails.mainCourtId,
                    name: this.issueDetails.name,
                    startDate: this.issueDetails.startDate,
                    startTime: this.issueDetails.startTime,
                    lawsuitId: this.issueDetails.lawsuitId,
                    sittingStatus: this.issueDetails.sittingStatus,
                    clientId: this.issueDetails.clientId,
                    clientStaus: this.issueDetails.clientStaus,
                  }
              ).subscribe({
                next: (next) => {
                  if (next.success) {
                    this._sittingManagementService
                      .addAttachment(
                        this.newStep2
                          ? this.newStep2
                          : {
                            id: this.sittingId,
                            files: this.issueDetails.files,
                          }
                      )
                      .subscribe({
                        next: (next) => {
                          if (next.success) {
                            this._sittingManagementService
                              .addReason({
                                id: this.sittingId,
                                reason: report,
                              })
                              .subscribe({
                                next: (next) => {
                                  this.spinner.hide();

                                  this.toastr.info(
                                    this.translate.instant(
                                      'sitting.caseEditSuccess'
                                    )
                                  );
                                  this.router.navigate([
                                    '/agent/departments/court-sessions',
                                  ]);
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


          }
        },
        () => {
        }
      );
    } else {
      this.spinner.show();
      this._sittingManagementService.changeToPublic(this.sittingId).subscribe({
        next: (next) => {
          this.spinner.hide();

          this.toastr.info(this.translate.instant('sitting.caseAddSuccess'));
          this.router.navigate(['/agent/departments/court-sessions']);
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
  send() {
    this.spinner.show();
    this._sittingManagementService
      .sendReportToClient(this.issueDetails.id)
      .subscribe({
        next: (next) => {
          this.spinner.hide();

          this.toastr.info(this.translate.instant('sitting.sendSuccess'));
        },
        error: (error) => {
          this.spinner.hide();
          this.toastr.error(error.error.error.message);
        },
      });
  }
  ngOnDestroy() { }
}
