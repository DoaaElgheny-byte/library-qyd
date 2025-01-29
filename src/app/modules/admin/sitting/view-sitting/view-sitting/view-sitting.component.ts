import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';
import { SittingManagementService } from 'src/app/services/api/sitting-management.service';
import { SittingStatus } from 'src/app/services/enums/sitting';

@Component({
  selector: 'app-view-sitting',
  templateUrl: './view-sitting.component.html',
  styleUrls: ['./view-sitting.component.scss'],
})
export class ViewSittingComponent implements OnInit {
  private unsubscribe: Subscription[] = [];
  tabNum: number = 1;
  id: any;
  issueId: any;
  issueState = SittingStatus;
  issueDetails: any;

  constructor(
    public route: ActivatedRoute,
    public issueService: SittingManagementService,
    private cdr: ChangeDetectorRef,
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
  getIssueById() {
    this.issueService.getSittingDetails(this.issueId).subscribe({
      next: (next) => {
        this.issueDetails = next.data;
        this.cdr.detectChanges();
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
