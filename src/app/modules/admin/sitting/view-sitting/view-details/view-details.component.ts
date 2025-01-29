import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DateFormatterService, DateType } from 'ngx-hijri-gregorian-datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SittingManagementService } from 'src/app/services/api/sitting-management.service';
import { CourtType } from 'src/app/services/enums/court-type.enum';
import { ClientStaus, EntityType } from 'src/app/services/enums/lawsuit';
import { SittingStatus, SittingState } from 'src/app/services/enums/sitting';
import { SittingType } from 'src/app/services/enums/sitting-type.enum';

@Component({
  selector: 'app-view-details',
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.scss'],
})
export class ViewDetailsComponent implements OnInit {
  issueDetails: any;
  sittingStatus = SittingStatus;
  clientStaus = ClientStaus;
  @Input() sittingId: any;
  sittingState = SittingState;
  courtType = CourtType;
  lang: string | null = localStorage.getItem('language');
  sittingType = SittingType;
  isAuth: boolean = true;
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

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const historyid = this.route.snapshot.paramMap.get('historyid');

    this.getEntityList()
    if (!historyid) {
      this.getIssueById();
    } else {
      this.getIssueHistory(historyid);
    }
  }

  getIssueById() {
    this.spinner.show()
    this._sittingManagementService.getSittingDetails(this.sittingId).subscribe({
      next: (next) => {
        if (next.success) {
          this.isAuth = true
          this.issueDetails = next.data;
          if (this.issueDetails.courtType) {
            this.EntityChoosen = this.entityList.filter((x: any) => x.id == this.issueDetails.courtType)[0].name;
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
          this.cdr.detectChanges();
          this.spinner.hide()

        } else {
          this.isAuth = false
          this.cdr.detectChanges();
          this.spinner.hide()
        }
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
  getIssueHistory(id: any) {
    this.spinner.show()
    this._sittingManagementService.sittingHistoryById(id).subscribe({
      next: (next) => {
        if (next.success) {
          this.isAuth = true
          this.issueDetails = next.data;
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
          this.cdr.detectChanges();
          this.spinner.hide()

        } else {
          this.isAuth = false
          this.spinner.hide()

        }

      },
    });
  }
  send() {
    this.spinner.show();
    this._sittingManagementService.sendReportToClient(this.issueDetails.id).subscribe({
      next: (next) => {
        this.spinner.hide();

        this.toastr.info(this.translate.instant('sitting.sendSuccess'));
      },
      error: (error) => {
        this.spinner.hide();
        this.toastr.error(error.error.error.message);
      },
    })
  }
  download(url: any) {
    window.open(url, "_blank")
  }
  ngOnDestroy() { }
}
