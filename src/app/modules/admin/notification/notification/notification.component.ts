import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';
import { ConfirmationDialogService } from 'src/app/modules/SharedComponent/SharedComponent/confirmation-dialog/confirmation-dialog.service';
import { NotificationService } from 'src/app/services/api/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  constructor(
    private _NotificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private confirmationDialogService: ConfirmationDialogService,
    public datepipe: DatePipe,
    private breadcrumbService: BreadcrumbService

  ) { }


  totalCount: number;
  payMent: number = 0;
  page: number = 1;
  pageSize: number = 9;
  filterObj = this.initFilterObj();
  allNotifications: any[] = [];

  ngOnInit(): void {
    this.breadcrumbService.restoreBreadcrumbsFromStorage();

    this.getUserAllNotifications();
  }
  getUserAllNotifications() {
    this.spinner.show();
    const startIndex = (this.page - 1) * this.pageSize;
    this.filterObj.SkipCount = startIndex;
    this.filterObj.MaxResultCount = this.pageSize;
    this._NotificationService.getNotification(this.filterObj).subscribe({
      next: next => {
        this.allNotifications = next.data.items;
        console.log(next.data.items);
        this.totalCount = next.data.totalCount;
        this.spinner.hide();
        this.cdr.detectChanges();
      }
    }
    );
  }
  initFilterObj() {
    return {
      Sorting: 'id',
      SkipCount: 0,
      MaxResultCount: this.pageSize,
    };
  }
  readNotification(id: any) {
    this._NotificationService.readNotification(id).subscribe({
      next: next => {

      }
    })
  }
}
