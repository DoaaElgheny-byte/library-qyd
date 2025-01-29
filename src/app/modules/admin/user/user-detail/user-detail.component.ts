import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserManagementService } from 'src/app/services/api/user-management.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountTypes } from 'src/app/services/enums/accountType.enum';
import { ConfirmationDialogService } from 'src/app/modules/SharedComponent/SharedComponent/confirmation-dialog/confirmation-dialog.service';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  constructor(
    private cdr: ChangeDetectorRef,
    private _UserManagementService: UserManagementService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private confirmationDialogService: ConfirmationDialogService,
    private modalService: NgbModal,
        private breadcrumbService: BreadcrumbService,

  ) {}
  id: number;
  playersDetailsData: any;
  accountType = AccountTypes;
  public lang: string = String(localStorage.getItem('language'));
  ngOnInit(): void {
    this.breadcrumbService.restoreBreadcrumbsFromStorage();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getThePlayerDeatiles(id);
    } else {
      this.getThePlayerDeatiles(0);
    }
  }
  getThePlayerDeatiles(id: any) {
    this.spinner.show();
    this._UserManagementService.playerDetailsApi(id).subscribe(
      (res) => {
        this.playersDetailsData = res.data;
        this.spinner.hide();
        this.cdr.detectChanges();

        this.cdr.detectChanges();
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        this.toastr.error(error.masage);
      }
    );
    this.cdr.detectChanges();
  }
  editPlayer(id: any) {
    this.router.navigate([`admin/user-edit/` + id]);
  }
}
