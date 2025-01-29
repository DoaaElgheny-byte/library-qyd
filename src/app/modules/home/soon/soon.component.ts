import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationPattern } from '../../SharedComponent/helper/validator';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CompleteProfileService } from '../../auth/services/complete-profile.service';
import { TranslateService } from '@ngx-translate/core';
import { AccountTypes } from 'src/app/services/enums/accountType.enum';

@Component({
  selector: 'app-soon',
  templateUrl: './soon.component.html',
  styleUrls: ['./soon.component.scss']
})
export class SoonComponent implements OnInit {

  loginForm: FormGroup;
  accountTypes = AccountTypes;

  constructor(private fb: FormBuilder, private spinner: NgxSpinnerService,
    private toastr: ToastrService, private service: CompleteProfileService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,

  ) {
    localStorage.setItem('language', 'ar')
  }

  ngOnInit(): void {
    this.initForm();
    localStorage.setItem('language', 'ar')
  }

  initForm() {
    this.loginForm = this.fb.group({
      fullName: [null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(200),
        ]),],
      email: [
        null,
        Validators.compose([
          Validators.pattern(ValidationPattern.Email),
        ]),
      ],
      accountType: [
        null,

      ],
      phone: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(ValidationPattern.Mobile),
          Validators.maxLength(16),
          Validators.minLength(9)
        ]),
      ],

      reason: [null,]

    });
  }

  resetForm() {
    this.loginForm.get('fullName')?.setValue('');
    this.loginForm.get('email')?.setValue('');
    this.loginForm.get('phone')?.setValue('');
    this.loginForm.get('reason')?.setValue('');
    this.loginForm.get('accountType')?.setValue('');
  }


  getAccountTypeName(selection: number) {
    const accountTypeName = AccountTypes[selection];
    return accountTypeName;
  }

  submit() {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.valid) {
      this.spinner.show();

      this.service.sendWelcomeEmail(this.loginForm.value).subscribe({
        next: next => {
          this.spinner.hide();
          if (next.success) {
            this.toastr.success(
              this.translate.instant('register.addEmailSuccess')
            );
            this.cdr.detectChanges();
            this.resetForm();
          } else {
            this.toastr.error(next.message);

          }
        }, error: error => {
          this.spinner.hide();
          this.toastr.error(error.error.error.message);
        }
      })
    }
  }
}

