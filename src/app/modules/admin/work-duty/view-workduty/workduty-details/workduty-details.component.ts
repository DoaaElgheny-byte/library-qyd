import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DateFormatterService, DateType } from 'ngx-hijri-gregorian-datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { WorkDutyService } from 'src/app/services/api/work-duty.service';
import {
  WorkDutyState,
  WorkDutyStatus,
} from 'src/app/services/enums/work-duty.enum';

@Component({
  selector: 'app-workduty-details',
  templateUrl: './workduty-details.component.html',
  styleUrls: ['./workduty-details.component.scss'],
})
export class WorkdutyDetailsComponent implements OnInit {
  @Input() id: any;
  @Input() view: any;

  contractDetails: any;
  issueState = WorkDutyState;
  workDutyStatus = WorkDutyStatus;
  isAuth: boolean = true;
  startDate: any;
  endDate: any;
  constructor(
    public workutyservice: WorkDutyService,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private dateFormatter: DateFormatterService,
  ) { }

  ngOnInit(): void {
    this.getIssueById();
  }
  getIssueById() {

    this.spinner.show();
    this.workutyservice.getDutyDetails(this.id).subscribe({
      next: (next) => {
        if (next.success) {
          this.isAuth = true;
          this.contractDetails = next.data;
          console.log(next.data)
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

          //endDate
          if (next.data.endDate) {
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
          this.spinner.hide();
        } else {
          this.isAuth = false;
          this.spinner.hide();

          this.cdr.detectChanges();
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
}
