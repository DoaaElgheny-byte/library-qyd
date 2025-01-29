import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DateFormatterService, DateType } from 'ngx-hijri-gregorian-datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { AttornyService } from 'src/app/services/api/attorny.service';
import { AttornyState, AttornyStatus } from 'src/app/services/enums/attorny.enum';

@Component({
  selector: 'app-attorny-details',
  templateUrl: './attorny-details.component.html',
  styleUrls: ['./attorny-details.component.scss']
})
export class AttornyDetailsComponent implements OnInit {
  @Input() id: any;
  attornyDetails: any;
  attornyState = AttornyState;
  attornyStatus = AttornyStatus;
  isAuth: boolean = true;
  startDate: any;
  endDate: any;
  constructor(
    public attornyService: AttornyService,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private dateFormatter: DateFormatterService,
  ) { }

  ngOnInit(): void {
    this.getAttornyById();
  }
  getAttornyById() {
    this.spinner.show()

    this.attornyService.getagencyDetails(this.id).subscribe({
      next: (next) => {
        if (next.success) {
          this.isAuth = true
          this.attornyDetails = next.data;

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
          this.spinner.hide()

        } else {
          this.isAuth = false
          this.spinner.hide()
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
