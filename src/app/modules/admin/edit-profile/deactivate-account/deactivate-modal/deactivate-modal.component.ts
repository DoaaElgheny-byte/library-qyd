import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserManagementService } from 'src/app/services/api/user-management.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/modules/auth';

@Component({
  selector: 'app-deactivate-modal',
  templateUrl: './deactivate-modal.component.html',
  styleUrls: ['./deactivate-modal.component.scss']
})
export class DeactivateModalComponent implements OnInit {

  constructor(private cdr: ChangeDetectorRef,
    private _UserManagementService: UserManagementService,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private authservice: AuthService,

  ) { }
  activeModal = inject(NgbActiveModal);

  ngOnInit(): void {
  }
  deactivateAccount() {
    this.spinner.show();
    this._UserManagementService.deactivateAccount().subscribe(
      (data) => {
        this.activeModal.dismiss('Cross click')

        this.spinner.hide();
        this.toastr.success(
          this.translate.instant('userManagement.changeAccountStatus')
        );

        this.cdr.detectChanges();
        this.authservice.logout();

      },
      (err) => {
        this.spinner.hide();
        this.toastr.error(err.error.error.message);
      }
    );
  }
}
