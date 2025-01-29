import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmEmailValidator } from 'src/app/modules/SharedComponent/helper/confirm-email.validator';
import { ConfirmPasswordValidator } from 'src/app/modules/SharedComponent/helper/confirm-password.validator';
import { ValidationPattern } from 'src/app/modules/SharedComponent/helper/validator';
import { AuthService } from 'src/app/modules/auth';
import { CompleteProfileService } from 'src/app/modules/auth/services/complete-profile.service';
import { SendCodeComponent } from '../send-code/send-code.component';

@Component({
  selector: 'app-vat-info',
  templateUrl: './vat-info.component.html',
  styleUrls: ['./vat-info.component.scss'],
})
export class VatInfoComponent implements OnInit {
  loginForm: FormGroup;
  hasError: boolean;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  commercialStorageFileNameForVat: string | null;
  commercialStorageFileNameForVatTax: string | null;
  commercialName: string | null;


  constructor(
    private fb: FormBuilder,
    private completeProfileservice: CompleteProfileService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getCompletedData();
  }
  profileData: any;
  getCompletedData() {
    this.completeProfileservice.getDataOfCompleteInfo(0).subscribe({
      next: (next) => {
        this.profileData = next.data;
        this.loginForm.patchValue({
          email: this.profileData.email,
          emailConfirm: this.profileData.email,
        });
      },
    });
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  uploadImg(data: any, type: number) {

    if (type == 1) {
      this.loginForm.get('logoImageNameForVat')?.setValue(data.fileName);
      this.loginForm
        .get('LogoImageStorageFileNameForVat')
        ?.setValue(data.storageFileName);
      this.commercialName = null;
      this.commercialStorageFileNameForVat = data.fileName;
    }
    if (type == 2) {
      this.loginForm.get('logoImageNameForVatTax')?.setValue(data.fileName);
      this.loginForm
        .get('LogoImageStorageFileNameForVatTax')
        ?.setValue(data.storageFileName);
      this.commercialName = null;
      this.commercialStorageFileNameForVatTax = data.fileName;
    }
  }


  initForm() {
    this.loginForm = this.fb.group(
      {
        commercialRegistrationNo: [null],
        vatRegistrationNumber: [null],
        logoImageNameForVat: [null,],
        logoImageNameForVatTax: [null,],
      },
      {
        validator: [, ConfirmEmailValidator.MatchemailConfirm],
      }
    );
  }

  save() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.spinner.show();

      this.completeProfileservice
        .completeProfile(this.loginForm.value)
        .subscribe({
          next: (next) => {
            this.spinner.hide();
            if (next.success) {

            } else {
              this.toastr.error(next.message);
            }
          },
          error: (error) => {
            this.spinner.hide();
            this.toastr.error(error.error.error.message);
          },
        });
    }
  }
  private modalService = inject(NgbModal);

  sendVerficaton(email: any) {
    const modalRef = this.modalService.open(SendCodeComponent);
    modalRef.componentInstance.email = email;
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
