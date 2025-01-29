import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DateFormatterService, DateType } from 'ngx-hijri-gregorian-datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AttornyService } from 'src/app/services/api/attorny.service';
import { AttornyStatus } from 'src/app/services/enums/attorny.enum';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  id: any;

  @Output() bindValue: EventEmitter<any> = new EventEmitter<any>();
  lang: string | null = localStorage.getItem('language');
  attornyDetails: any = {};
  attornyStatus = AttornyStatus;
  startDate: any;
  endDate: any;
  hideAlert: boolean = false
  constructor(
    public _attornyService: AttornyService,
    private cdr: ChangeDetectorRef,
    public route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private router: Router,
    private dateFormatter: DateFormatterService,
  ) { }

  ngOnInit(): void {
    localStorage.setItem('step', '3');
    this.route.params.subscribe({
      next: (next) => {
        this.id = next['id'];
      },
    });
    if (this.id) {
      this.getIssueById();
    }
  }
  getIssueById() {
    this._attornyService.getagencyDetails(this.id).subscribe({
      next: (next) => {
        this.attornyDetails = next.data;
        //startDate

        if (next.data.startDate != null) {
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

        //endDate
        if (next.data.endDate != null) {
          let endOfDate = next.data.endDate.substring(0, 10);

          if (endOfDate) {
            if (next.data.endDateType === DateType.Gregorian) {
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
        this.cdr.detectChanges();

      },
      error: (error) => {
        this.spinner.hide();
        this.toastr.error(error.error.error.message);
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

  submit() {

    this.spinner.show();
    if (this.attornyDetails.isDraft) {

      this._attornyService.changeToPublic(this.id).subscribe({
        next: (next) => {
          if (next.data) {
            // alert('خلي بالك عدد الوكالات المسموح ليك قرب يخلص ')
          }
          this.spinner.hide();
          this.toastr.info(this.translate.instant('attorny.caseAddSuccess'));
          this.router.navigate(['/agent/departments/attorny']);
        },
        error: (error) => {
          this.spinner.hide();
          this.toastr.error(error.error.error.message);
        },
      });
    } else {

      this._attornyService.updateagency(this.id).subscribe({
        next: (next) => {

          if (next.data) {
            // alert('خلي بالك عدد الوكالات المسموح ليك قرب يخلص ')
          }
          this.spinner.hide();
          this.toastr.info(this.translate.instant('attorny.caseAddSuccess'));
          this.router.navigate(['/agent/departments/attorny']);
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

