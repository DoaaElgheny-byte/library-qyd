import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { IssuesService } from 'src/app/services/api/issues.service';

@Component({
  selector: 'app-account-statement',
  templateUrl: './account-statement.component.html',
  styleUrls: ['./account-statement.component.scss']
})
export class AccountStatementComponent implements OnInit {

  accountingSummary: any[] = [];
  pageSize: number = 10;
  clientName: string = '';
  projectName: string = '';
  startDate: string;
  endDate: string;
  page: number = 1;

  to: any;
  from: any;
  totalCount: number;

  filterObj = this.initFilterObj();
  initFilterObj() {
    return {
      Sorting: 'id',
      SkipCount: 0,
      MaxResultCount: this.pageSize,
      startDate: this.startDate,
      endDate: this.endDate,
      clientName: this.clientName,
      projectName: this.projectName,
    };
  }

  private service = inject(IssuesService);
  private spinner = inject(NgxSpinnerService);
  private cdr = inject(ChangeDetectorRef);

  constructor(public datepipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.getAllAccountingSummary();
  }

  getAllAccountingSummary() {

    if (this.startDate != null && this.startDate != '') {
      // Process startDate
      this.from = this.startDate;
      if (this.endDate == null || this.endDate == '') {
        const today = new Date();
        this.to = this.datepipe.transform(today, 'yyyy-MM-dd');
      }
    }
    if (this.endDate != null && this.endDate != '') {
      // Process endDate
      this.to = this.endDate;
      if (this.startDate == null || this.startDate == '') {
        const defaultStartDate = new Date(2000, 0, 1);
        this.from = this.datepipe.transform(defaultStartDate, 'yyyy-MM-dd');
      }
    }
    if (this.startDate == null || this.startDate == '' && this.endDate == null || this.endDate == '') {
      this.to = '';
      this.from = '';
    }

    const startIndex = (this.page - 1) * this.pageSize;
    this.filterObj.SkipCount = startIndex;
    this.filterObj.startDate = this.from;
    this.filterObj.endDate = this.to;
    this.filterObj.clientName = this.clientName;
    this.filterObj.projectName = this.projectName;

    let data = { ...this.filterObj };

    this.spinner.show();
    this.service.getAllAccountingSummary(data).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe(res => {
      this.accountingSummary = res.data.items;
      console.log(this.accountingSummary)
      this.totalCount = res.data.totalCount;
      console.log(this.totalCount)

      this.cdr.detectChanges();
    })
  }
}
