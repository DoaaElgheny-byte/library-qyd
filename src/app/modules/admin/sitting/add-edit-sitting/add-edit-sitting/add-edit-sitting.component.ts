import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-add-edit-sitting',
  templateUrl: './add-edit-sitting.component.html',
  styleUrls: ['./add-edit-sitting.component.scss'],
})
export class AddEditSittingComponent implements OnInit {
  tabNum: number = 1;
  id: any;
  issueId: any;
  issueDetails: any;
  newStep1: any;
  newStep2: any;
  newStep3: any;
  newStep4: any;
  isAdd = false;
  private unsubscribe: Subscription[] = [];
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.newStep1 || this.newStep2) {
      $event.returnValue = true; // This line is necessary for modern browsers
      return 'Are you sure you want to discard your changes?';
    }
  }
  constructor(public route: ActivatedRoute,
        private breadcrumbService:BreadcrumbService
) {}

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
