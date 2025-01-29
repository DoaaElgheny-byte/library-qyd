import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-get-changed',
  templateUrl: './get-changed.component.html',
  styleUrls: ['./get-changed.component.scss'],
})
export class getChangedComponent implements OnInit, OnDestroy {
  // KeenThemes mock, change it to:
  defaultAuth: any = {
    email: 'admin@demo.com',
    password: 'demo',
  };
  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  email: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.spinner.hide();
    this.activatedRoute.params.subscribe((params: any) => {
      this.email = params.email;
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  initForm() {}

  submit() {
    this.spinner.show();
    const forgotPasswordSubscr = this.authService
      .forgetPassword(this.email)
      .subscribe({
        next: (res) => {
          this.spinner.hide();
          this.toastr.success(
            this.translate.instant('forgetPassword.EmailSentSuccessfully')
          );
        },
        error: (err) => {
          this.spinner.hide();
          this.toastr.error(err.error.error.message);
        },
      });
    this.unsubscribe.push(forgotPasswordSubscr);

  }

  ngOnDestroy() {}
  dummyApiCall9() {}
  dummyApiCall() {}

  loginMyApp() {}

  redirectTo() {
    this.router.navigate(['/auth/login']);
  }
}
