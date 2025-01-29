import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-add-workduty',
  templateUrl: './add-workduty.component.html',
  styleUrls: ['./add-workduty.component.scss'],
})
export class AddWorkdutyComponent implements OnInit, OnDestroy {
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
  fromIssue: boolean = false;
  issueNo: any;
  isAddNewTaskFromProject: any
  private unsubscribe: Subscription[] = [];
  constructor(
    public route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private router: Router,


  ) {
    this.isAddNewTaskFromProject = localStorage.getItem('addNewTaskFromProject')

  }

  ngOnInit(): void {
    this.breadcrumbService.restoreBreadcrumbsFromStorage();

    this.route.params.subscribe({
      next: (next) => {
        this.issueId = next['id'];
        if (this.issueId) {
          if (
            localStorage.getItem('stepWorkDuty') &&
            localStorage.getItem('stepWorkDuty') != ''
          ) {
            this.tabNum = Number(localStorage.getItem('stepWorkDuty'));
          }
        }
        if (next['fromIssue']) this.fromIssue = next['fromIssue'];
        this.issueNo = next['issueNo'];
      },
    });
  }
  ///bind from step One
  getId(event: any) {
    if (event.isSuccess) {
      this.tabNum = 2;
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

    localStorage.setItem('stepWorkDuty', this.isAdd ? '2' : '1');
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    localStorage.removeItem('addNewTaskFromProject')


  }

  backToProject() {
    this.route.queryParams.subscribe(params => {
      this.router.navigate(['../../../../project-management/add-edit-project/' + params['step2Id']], { relativeTo: this.route });
      localStorage.removeItem('addNewTaskFromProject')
    });
  }
}
