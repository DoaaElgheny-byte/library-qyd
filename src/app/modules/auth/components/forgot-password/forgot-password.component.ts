import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslationService } from 'src/app/i18n';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ValidationPattern } from 'src/app/modules/SharedComponent/helper/validator';

enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  isLoading$: Observable<boolean>;
  selectedLanguage: any;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private translationService: TranslationService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    this.isLoading$ = this.authService.isLoading$;
    
  }

  ngOnInit(): void {
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }

  initForm() {
    this.forgotPasswordForm = this.fb.group({
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(ValidationPattern.Email)
        ]),
      ],
    });
  }

  selectLanguage() {
    this.selectedLanguage = this.translationService.getSelectedLanguage();
    if (this.selectedLanguage == 'ar') {
      this.translationService.setLanguage('en');
      this.selectedLanguage = 'en';
    } else {
      this.translationService.setLanguage('ar');
      this.selectedLanguage = 'ar';
    }
  }


  submit() {
    Object.keys(this.forgotPasswordForm.controls).forEach((field) => {
      // {1}
      const control = this.forgotPasswordForm.get(field); // {2}
      control?.markAsTouched({ onlySelf: true }); // {3}
    });

    if (this.forgotPasswordForm.valid) {
      this.errorState = ErrorStates.NotSubmitted;

      this.spinner.show();
      const forgotPasswordSubscr = this.authService
        .forgetPassword(this.f.email.value)
        .pipe(first())
        .subscribe({
          next: (res) => {
            this.spinner.hide();
            if(res.success){
              this.router.navigate([`auth/Changed/${this.f.email.value}`]);
            }else {
              this.toastr.error(res.message, '', { timeOut: 7000 });
            }
          },
          error: (err) => {
            this.spinner.hide();
            this.toastr.error(err.error.error.message, '', { timeOut: 7000 });
          },
        });
      this.unsubscribe.push(forgotPasswordSubscr);
    }
  }
}
