import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';
import { IssuesService } from 'src/app/services/api/issues.service';

@Component({
  selector: 'app-add-issue',
  templateUrl: './add-issue.component.html',
  styleUrls: ['./add-issue.component.scss'],
})
export class AddIssueComponent implements OnInit {
  tabNum: number = 1;
  id: any;
  issueId: any;
  issueDetails: any;
  newStep1: any;
  newStep2: any;
  newStep3: any;
  newStep4: any;
  isAdd = false;
  isAddNewCaseFromProject: any;
  private unsubscribe: Subscription[] = [];
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (
      this.newStep1 ||
      this.newStep2 ||
      this.newStep3 ||
      this.newStep4

    ) {
      $event.returnValue = true; // This line is necessary for modern browsers
      return 'Are you sure you want to discard your changes?';
    }
  }
  constructor(public route: ActivatedRoute, private spinner: NgxSpinnerService,
    private router: Router,

    private breadcrumbService: BreadcrumbService,
    private _lawsuitManagementService: IssuesService, private cdr: ChangeDetectorRef) {
    this.isAddNewCaseFromProject = localStorage.getItem('addNewCaseFromProject')

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
    if (this.issueId) {
      this.getIssueById()
    }
  }
  isAuth: boolean = true
  getIssueById() {
    this.spinner.show();
    this._lawsuitManagementService.getLawsuitDetails(this.issueId).subscribe({
      next: (next) => {
        if (next.success === true) {
          this.spinner.hide();
          this.isAuth = true
          this.cdr.detectChanges()
        } else {
          this.spinner.hide();
          this.isAuth = false
          this.cdr.detectChanges()

        }
      }
    })
  }
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
  ///bind from step Three
  stepFour(event: any) {
    if (event.isBack) {
      this.tabNum = 2;
    }
    if (this.issueId) {
      this.newStep3 = event.data;
    }
    if (event.isSuccess) {
      this.tabNum = 4;
    }
  }
  ///bind from step Four
  stepFive(event: any) {
    if (event.isBack) {
      this.tabNum = 3;
    }
    if (this.issueId) {

      this.newStep4 = event.data;
    }
    if (event.isSuccess) {
      this.tabNum = 5;
    }
  }

  ///bind from step six
  stepReview(event: any) {
    if (event.isBack) {
      this.tabNum = 4;
    }
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    localStorage.setItem('step', this.isAdd ? '2' : '');
  }

  backToProject() {
    localStorage.removeItem('addNewCaseFromProject')
    // admin/departments/project-management/add-edit-project
    this.router.navigate(['../../project-management/add-edit-project'], { relativeTo: this.route });

  }
}
