import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmPasswordValidator } from 'src/app/modules/SharedComponent/helper/confirm-password.validator';
import { ValidationPattern } from 'src/app/modules/SharedComponent/helper/validator';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-set-new-password',
  templateUrl: './set-new-password.component.html',
  styleUrls: ['./set-new-password.component.scss'],
})
export class SetNewPasswordComponent implements OnInit, OnDestroy {
  public newPasswordForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;
  email: any;
  token: any;
  showPassword: boolean;
  showPasswordConfirm: boolean;
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private translate: TranslateService,

  ) {}

  ngOnInit(): void {
    this.initForm();
    this.activatedRoute.queryParamMap.subscribe({
      next: (params) => {
        let param = params.get('ResetPasswordToken');
        let index = param?.indexOf('?');
        this.token = param?.slice(0, index);
        this.email = param?.slice(Number(index) + 7);
       
        this.newPasswordForm!.get('email')!.setValue(this.email);
      },
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.newPasswordForm.controls;
  }

  initForm() {
    this.newPasswordForm = this.fb.group(
      {
        email: [
          null,
        ],

        password: [
          null,
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(ValidationPattern.Password),
          ]),
        ],
        passwordConfirm: [
          null,
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(ValidationPattern.Password),
          ]),
        ],
      },
      {
        validator: [, ConfirmPasswordValidator.MatchPassword],
      }
    );
  }

  togglePasswordVisibilty() {
    this.showPassword = !this.showPassword;
  }

  togglePasswordConfirmVisibilty() {
    this.showPasswordConfirm = !this.showPasswordConfirm;
  }

  submit() {
    this.hasError = false;
    this.spinner.show();
    const loginSubscr = this.authService
      .resetPassword(this.newPasswordForm.value, this.token)
      .pipe(first())
      .subscribe({
        next: (user) => {
          this.spinner.hide();
          this.hasError = false;
          this.toastr.success(
            this.translate.instant('forgetPassword.resetSuccess')
          );
          this.router.navigate([`auth/login`]);
        },
        error: (err) => {
          this.spinner.hide();
          this.hasError = true;
          this.toastr.error(err.error.error.message);
        },
      });
    this.unsubscribe.push(loginSubscr);
  }

  redirectTo() {
    this.router.navigate(['/home']);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
