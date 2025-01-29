import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DateFormatterService, DateType } from 'ngx-hijri-gregorian-datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ContractService } from 'src/app/services/api/contract.service';
import {
  ContractState,
  ContractStatus,
} from 'src/app/services/enums/contractStatus.enum';
import { LawsuitType, LawsuitState } from 'src/app/services/enums/lawsuit';

@Component({
  selector: 'app-contract-details',
  templateUrl: './contract-details.component.html',
  styleUrls: ['./contract-details.component.scss'],
})
export class ContractDetailsComponent implements OnInit {
  @Input() id: any;
  contractDetails: any;
  issueTypes = LawsuitType;
  issueState = LawsuitState;
  contractState = ContractState;
  contractStatus = ContractStatus;
  isAuth: boolean = true;
  startDate: any;
  endDate: any;
  constructor(
    public contractService: ContractService,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private dateFormatter: DateFormatterService,
  ) { }

  ngOnInit(): void {
    this.getIssueById();
  }
  getIssueById() {
    this.spinner.show()
    this.contractService.getContractDetails(this.id).subscribe({
      next: (next) => {
        if (next.success === true) {
          this.isAuth = true
          this.contractDetails = next.data;
          console.log(next.data)
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
}
