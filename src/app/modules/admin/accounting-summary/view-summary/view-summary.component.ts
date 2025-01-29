import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';
import { PackageManagementService } from 'src/app/services/api/package-management.service';

@Component({
  selector: 'app-view-summary',
  templateUrl: './view-summary.component.html',
  styleUrls: ['./view-summary.component.scss']
})
export class ViewSummaryComponent implements OnInit {

  activeTab: number = 1;
  isShowSummary: boolean = false;


  constructor(private breadcrumbService: BreadcrumbService, private managePackageService: PackageManagementService
    , private spinner: NgxSpinnerService,
    private router: Router,
  ) { }

  ngOnInit(): void {

    this.managePackageService.getConditionsForAgent().subscribe(res => {
      let result = res.data;
      result.forEach((item: any) => {
        if (item.conditionId === 11) this.isShowSummary = true;
      });
      if (this.isShowSummary) {

        this.setActiveTab(1);
        this.breadcrumbService.restoreBreadcrumbsFromStorage();
      }
      else {
        this.router.navigate(['/agent/error-package'], {
          queryParams: { key: 'Finish' },
        });
      }
    });
  }

  setActiveTab(tabNumber: number): void {
    this.activeTab = tabNumber;
  }

  isTabActive(tabNumber: number): boolean {
    return this.activeTab === tabNumber;
  }


}
