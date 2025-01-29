import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';
import { ContractService } from 'src/app/services/api/contract.service';
import { Payment } from 'src/app/services/enums/payment-conditions.enum';

@Component({
  selector: 'app-add-contract',
  templateUrl: './add-contract.component.html',
  styleUrls: ['./add-contract.component.scss'],
})
export class AddContractComponent implements OnInit {
  tabNum: number = 1;
  id: any;
  issueId: any;
  issueDetails: any;
  newStep1: any;
  newStep2: any;
  newStep3: any;
  newStep4: any;
  newStep5: any;
  isAdd = false;
  private unsubscribe: Subscription[] = [];
  isAddNewContractFromProject: any;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    public contractService: ContractService,
    private breadcrumbService: BreadcrumbService,

  ) {
    this.isAddNewContractFromProject = localStorage.getItem('addNewContractFromProject')
    this.getCondition()
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
    this.route.params.subscribe({
      next: (next) => {
        this.issueId = next['id'];
      },
    });
    if (this.issueId) {
      if (localStorage.getItem('stepContract') && localStorage.getItem('stepContract') != '') {
        this.tabNum = Number(localStorage.getItem('stepContract'));
      } else {
        this.tabNum = 1
      }
    }
    else {
      localStorage.setItem('stepContract', '1')
      this.tabNum = 1
    }
  }
  ///bind from step One
  getId(event: any) {
    if (event.isSuccess) {
      this.tabNum = 2;
    }
    if (this.issueId) {
      this.newStep1 = event.data;
    }
    this.isAdd = event.isAdd;
  }

  ///bind from step six
  stepReview(event: any) {
    if (event.isBack) {
      this.tabNum = 1;
    }
    this.isAdd = event.isAdd;
  }
  ngOnDestroy() {

    localStorage.setItem('stepContract', this.isAdd ? '2' : '');
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  backToProject() {
    this.router.navigate(['../../project-management/add-edit-project'], { relativeTo: this.route });
    localStorage.removeItem('addNewContractFromProject')
  }
}
