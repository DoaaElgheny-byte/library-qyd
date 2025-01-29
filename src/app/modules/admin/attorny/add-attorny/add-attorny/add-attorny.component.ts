import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';
import { AttornyService } from 'src/app/services/api/attorny.service';
import { Payment } from 'src/app/services/enums/payment-conditions.enum';

@Component({
  selector: 'app-add-attorny',
  templateUrl: './add-attorny.component.html',
  styleUrls: ['./add-attorny.component.scss'],
})
export class AddAttornyComponent implements OnInit {
  tabNum: number = 1;
  id: any;
  issueId: any;
  issueDetails: any;
  newStep1: any;
  newStep2: any;
  newStep3: any;
  newStep4: any;
  newStep5: any;
  private unsubscribe: Subscription[] = [];
  constructor(
    public route: ActivatedRoute,
    private router: Router,
    public attornyservice: AttornyService,
    private breadcrumbService: BreadcrumbService
  ) {
    this.getCondition();
  }
  getCondition() {
    let packageCondition = window.localStorage.getItem(
      'condtions-to-current-user'
    );

    let packageData: any = JSON.parse(packageCondition!);
    if (packageData.paymentType == Payment.Expired) {
      this.router.navigate(['/agent/error-package'], {
        queryParams: { key: 'Expired' },
      });
    }
  }
  ngOnInit(): void {
    this.breadcrumbService.restoreBreadcrumbsFromStorage();
    if (localStorage.getItem('step') && localStorage.getItem('step') != '') {
      this.tabNum = Number(localStorage.getItem('step'));
    }
    this.route.params.subscribe({
      next: (next) => {
        this.issueId = next['id'];
       
      },
    });
  }
  isAdd: boolean = false;

  ///bind from step One
  getId(event: any) {
    if (this.issueId) {
      this.newStep1 = event.data;
    }
    if (event.isSuccess) {
      this.tabNum = 2;
    }
    this.isAdd = event.isAdd;
  }
  ///bind from step Two
  stepThree(event: any) {
    if (event.isBack) {
      this.tabNum = 1;
    }
    if (this.issueId) {
      this.newStep2 = event.data;
    }
    if (event.isSuccess) {
      this.tabNum = 3;
    }
  }

  ///bind from step six
  stepReview(event: any) {
    if (event.isBack) {
      this.tabNum = 2;
    }
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    localStorage.setItem('step', this.isAdd ? '2' : '');
  }
}
