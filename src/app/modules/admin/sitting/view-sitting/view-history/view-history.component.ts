import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SittingManagementService } from 'src/app/services/api/sitting-management.service';
import { SittingState, SittingStatus } from 'src/app/services/enums/sitting';

@Component({
  selector: 'app-view-history',
  templateUrl: './view-history.component.html',
  styleUrls: ['./view-history.component.scss'],
})
export class ViewHistoryComponent implements OnInit {
  @Input() issueId: any;
  historyData: any;
  issueState = SittingState;
  issueStatusEnum = SittingStatus;
  page: number = 1;
  isSuccess:boolean
  pageSize: number = 20;
  filterObj = this.initFilterObj();
  totalCount: number;
  constructor(
    private issueService: SittingManagementService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getAllHistory();
  }
  initFilterObj() {
    return {
      Sorting: 'id',
      SkipCount: 0,
      MaxResultCount: this.pageSize,
      SittingId: this.issueId,
    };
  }
  getAllHistory() {
    const startIndex = (this.page - 1) * this.pageSize;
    this.filterObj.SkipCount = startIndex;
    (this.filterObj.SittingId = this.issueId),
      (this.filterObj.MaxResultCount = this.pageSize);
    this.spinner.show();
    this.issueService.sittingHistory(this.filterObj).subscribe({
      next: (next) => {
        if(next.data){
          this.historyData = next.data.items;
          this.isSuccess = next.success
        }
        else{
          this.historyData = next.data
          this.isSuccess = next.success
          
        }
        

        this.cdr.detectChanges();
        this.spinner.hide();
      },
    });
  }
}
