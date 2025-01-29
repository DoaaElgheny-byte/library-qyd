import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';
import { IssuesService } from 'src/app/services/api/issues.service';
import { LawsuitStatus } from 'src/app/services/enums/lawsuit';

@Component({
  selector: 'app-view-issue',
  templateUrl: './view-issue.component.html',
  styleUrls: ['./view-issue.component.scss'],
})
export class ViewIssueComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];
  tabNum: number = 1;
  id: any;
  issueId: any;
  issueState = LawsuitStatus;
  issueDetails: any;

  constructor(
    public route: ActivatedRoute,
    public issueService: IssuesService,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.breadcrumbService.restoreBreadcrumbsFromStorage();

    this.route.params.subscribe({
      next: (next) => {
        this.issueId = next['id'];

        this.changeTab(+next['tab']);
      },
    });
    if (this.issueId) {
      this.getIssueById();
    }
  }
  isAuth: boolean = true;
  getIssueById() {
    this.spinner.show();
    this.issueService.getLawsuitDetails(this.issueId).subscribe({
      next: (next) => {
        if (next.success === true) {
          this.spinner.hide();
          this.issueDetails = next.data;
          this.isAuth = true;
          this.cdr.detectChanges();
        } else {
          this.spinner.hide();
          this.isAuth = false;
          this.cdr.detectChanges();
        }
      },
    });
  }
  changeTab(num: number) {
    this.tabNum = num;
    this.cdr.detectChanges();
  }
  getId(event: any) {
    this.id = event.id;
    if (event.isSuccess) {
      this.tabNum = 2;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
