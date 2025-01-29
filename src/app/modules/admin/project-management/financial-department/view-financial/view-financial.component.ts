import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-view-financial',
  templateUrl: './view-financial.component.html',
  styleUrls: ['./view-financial.component.scss']
})
export class ViewFinancialComponent implements OnInit {

  activeTab: number = 1;

  constructor(private breadcrumbService: BreadcrumbService) { }

  ngOnInit(): void {
    this.breadcrumbService.restoreBreadcrumbsFromStorage();
    this.setActiveTab(1);
  }

  setActiveTab(tabNumber: number): void {
    this.activeTab = tabNumber;
  }

  isTabActive(tabNumber: number): boolean {
    return this.activeTab === tabNumber;
  }


}
