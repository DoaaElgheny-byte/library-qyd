import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DateFormatterService, DateType } from 'ngx-hijri-gregorian-datepicker';
import { IssuesService } from 'src/app/services/api/issues.service';
import {
  ClientStaus,
  EntityType,
  FilesType,
  LawsuitState,
  LawsuitStatus,
  LawsuitType,
  LawsuitTypeEnum,
} from 'src/app/services/enums/lawsuit';

@Component({
  selector: 'app-issue-details',
  templateUrl: './issue-details.component.html',
  styleUrls: ['./issue-details.component.scss'],
})
export class IssueDetailsComponent implements OnInit {
  @Input() issueId: any;

  @Input() isAuth: boolean;
  issueDetails: any = {};
  issueTypes = LawsuitTypeEnum;
  issueState = LawsuitState;
  fileType = FilesType;
  lawsuitStatus = LawsuitStatus;
  clientStaus = ClientStaus;
  startDate: any;
  endDate: any;
  constructor(
    public issueService: IssuesService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private dateFormatter: DateFormatterService,
  ) { }
  historyid: any;
  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');
    this.historyid = this.route.snapshot.paramMap.get('historyid');

    this.cdr.detectChanges();
    this.getEntityList()
    if (!this.historyid) {
      this.getIssueById();
    } else {
      this.getIssueHistory(this.historyid);
    }
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
  getIssueById() {
    this.issueService.getLawsuitDetails(this.issueId).subscribe({
      next: (next) => {
        if (next.success) {
          this.isAuth = true;
          this.issueDetails = next.data;
          this.EntityChoosen = this.entityList.filter((x: any) => x.id == this.issueDetails.courtType)[0].name;
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
          this.cdr.detectChanges();
        } else {
          this.isAuth = false;
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
  getIssueHistory(id: any) {
    this.issueService.getIssueHistoryById(id).subscribe({
      next: (next) => {
        if (next.success) {
          this.isAuth = true;
          this.issueDetails = next.data;
          this.EntityChoosen = this.entityList.filter((x: any) => x.id == this.issueDetails.courtType)[0].name;
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
          this.cdr.detectChanges();
        } else {
          this.isAuth = false;
        }
      },
    });
  }
}
