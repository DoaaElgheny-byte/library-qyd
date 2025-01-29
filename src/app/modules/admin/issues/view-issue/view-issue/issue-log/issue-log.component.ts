import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { IssuesService } from 'src/app/services/api/issues.service';
import { LawsuitState, LawsuitStatus } from 'src/app/services/enums/lawsuit';

@Component({
  selector: 'app-issue-log',
  templateUrl: './issue-log.component.html',
  styleUrls: ['./issue-log.component.scss']
})
export class IssueLogComponent implements OnInit {
  @Input() issueId:any
  @Input() isAuth:boolean
  historyData:any
  issueState=LawsuitState
  issueStatusEnum=LawsuitStatus
  page: number = 1;
  pageSize: number = 20;
filterObj = this.initFilterObj();
  totalCount: number;
  constructor(
    private issueService :IssuesService,
    private spinner:NgxSpinnerService,
    private cdr:ChangeDetectorRef,
    private route:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getAllHistory()
  }
  initFilterObj() {
    return {
      Sorting: 'id',
      SkipCount: 0,
      MaxResultCount: this.pageSize,
      LawsuitId:this.issueId
    };
  }
  getAllHistory(){
    const startIndex = (this.page - 1) * this.pageSize;
    this.filterObj.SkipCount = startIndex;
    (this.filterObj.LawsuitId = this.issueId),
    this.filterObj.MaxResultCount = this.pageSize;
    this.spinner.show()
    this.issueService.getIssueHistory(this.filterObj).subscribe({
      next:next=>{
        this.historyData = next.data.items
        this.cdr.detectChanges()
        this.spinner.hide()

      }
    })
  }
}
