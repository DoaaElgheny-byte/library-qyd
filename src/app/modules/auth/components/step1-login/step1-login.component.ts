import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, Observable, Subscription } from 'rxjs';
import { TranslationService } from 'src/app/i18n';
import { ValidationPattern } from 'src/app/modules/SharedComponent/helper/validator';
import { AuthService } from '../../services/auth.service';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-telephone-input';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { StepsService } from '../../services/steps.service';

@Component({
  selector: 'app-step1-login',
  templateUrl: './step1-login.component.html',
  styleUrls: ['./step1-login.component.scss']
})
export class Step1LoginComponent implements OnInit, OnDestroy {

  selectedLanguage = true;
  lang: string;
  loginForm: FormGroup;
  hasError: boolean = false;
  returnUrl: string;
  isLoading$: Observable<boolean>;
  readonly siteKey = '6LcVXH4pAAAAAH8eyL7Ah1NnXmxvPqS9mT1UxB3K';
  public CountryISO: any;
  public PhoneNumberFormat: any;
  public SearchCountryField: any;
  public selectedCountryIso: any;
  public mobileNumber: any;
  public phoneOrEmail: boolean = true;

  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private translationService: TranslationService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private stepService: StepsService,

  ) {
    this.isLoading$ = this.authService.isLoading$;
    this.translationService.setLanguage('ar');
    this.CountryISO = CountryISO;
    this.PhoneNumberFormat = PhoneNumberFormat;
    this.SearchCountryField = SearchCountryField;
    if (localStorage.getItem('phoneOrEmail')) {
      this.phoneOrEmail = JSON.parse(localStorage.getItem('phoneOrEmail')!);
      console.log(this.phoneOrEmail);
    }


  }




  public isPhoneOrEmail(type: boolean) {
    this.phoneOrEmail = type
  }

  private initializeLanguage(): void {
    const storedLanguage = localStorage.getItem('statusOfToggleLogin');
    this.selectedLanguage = storedLanguage === null ? true : JSON.parse(storedLanguage);
    this.lang = this.selectedLanguage ? 'ar' : 'en';
    this.translationService.setLanguage(this.lang);
  }

  private redirectIfAuthenticated(): void {
    const authToken = localStorage.getItem('authLocalStorageTokenquid');
    if (authToken) {
      this.router.navigate(['/admin/departments/dashboard-managment']);
    }
  }

  public onInputChange(event: any) {
    console.log(event);

    if (event.isNumberValid) {
      this.loginForm.controls['mobileNumber'].setErrors(null); // Clear errors

      this.loginForm
        .get('mobileNumber')
        ?.setValue(
          event.phoneNumber.replace(/\s/g, '').split('+' + event.dialCode)[1]
        );
      // this.loginForm.get('countryCode')?.setValue(event.dialCode);
      // this.loginForm.get('countryCodeIso')?.setValue(event.iso2Code);
    } else {
      this.loginForm.get('mobileNumber')?.markAsTouched({ onlySelf: true });
      this.loginForm.get('mobileNumber')?.setErrors({ required: true });
    }
  }
  /**
   * Handle changes from intl-telephone-input
   */
  // onInputChange(event: any) {
  //   const mobileNumberControl = this.loginForm.controls['mobileNumber'];

  //   // Mark the control as touched
  //   mobileNumberControl.markAsTouched();
  //   mobileNumberControl.markAsDirty();
  //   if (event.isNumberValid) {
  //     this.loginForm.controls['mobileNumber'].setErrors(null); // Clear errors
  //   } else {
  //     this.loginForm.controls['mobileNumber'].setErrors({ invalidPhoneNumber: true });
  //   }
  // }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: [
        "",
        [
          Validators.required,
          Validators.pattern(ValidationPattern.Email)
        ],
      ],

      mobileNumber: [
        '',
        [
          Validators.required, // Field is required
          // this.validatePhoneNumber, // Custom validator for phone number
        ],
      ],
      countryCode: [966],
      countryCodeIso: 'sa',
      recaptcha: [
        null,
        [Validators.required]
      ]
    });
  }

  /**
   * Custom validator to check if the mobile number is numeric
   */
  validatePhoneNumber(control: any) {
    if (control && control.value && !control.value.number && control.touched) {
      return { invalidPhoneNumber: true };
    }
    return null;
  }
  getValues(): void {
    localStorage.setItem('email', this.loginForm.get('email')?.value);
    localStorage.setItem('mobileNumber', this.loginForm.get('mobileNumber')?.value);
    localStorage.setItem('countryCode', this.loginForm.get('countryCode')?.value);
    localStorage.setItem('phoneOrEmail', JSON.stringify(this.phoneOrEmail));
  }

  removeLocalStorage() {
    localStorage.removeItem('email');
    localStorage.removeItem('mobileNumber');
    localStorage.removeItem('countryCode');
    localStorage.removeItem('phoneOrEmail');
    localStorage.removeItem('userId');
  }

  submit(): void {
    debugger
    console.log(this.loginForm.value);

    this.getValues();
    const emailControl = this.loginForm.get('email');
    const mobileNumberControl = this.loginForm.get('mobileNumber');
    if (this.phoneOrEmail) {
      emailControl?.setValue(null);
      emailControl?.clearValidators();
      emailControl?.updateValueAndValidity();
    } else {
      mobileNumberControl?.setValue(null);
      mobileNumberControl?.clearValidators();
      mobileNumberControl?.updateValueAndValidity();
    }
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.spinner.show();
      this.authService.registration(this.loginForm.value).pipe(finalize(() => {
        this.spinner.hide();
      })).subscribe({
        next: next => {
          if (next.success) {
            localStorage.setItem('userId', next.data);
            this.goToOTP();
            this.completeStep()
          } else {
            this.spinner.hide();
            this.toastr.error(this.translate.instant('customerManagement.EmailOrPhoneIsExists'));
          }
        },
        error: (error) => {
          this.spinner.hide();
          this.toastr.error(error);
        },
      })
    }
  }
  selectLanguage(): void {
    this.lang = this.selectedLanguage ? 'ar' : 'en';
    this.translationService.setLanguage(this.lang);
    localStorage.setItem('statusOfToggleLogin', JSON.stringify(this.selectedLanguage));
  }

  goToOTP(): void {
    this.router.navigate(['otp'], { relativeTo: this.route });

  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }
  completeStep(): void {
    this.stepService.setStepData('step-one', this.loginForm.value);
    this.stepService.markStepAsComplete(1);
    this.router.navigate(['/auth/register/otp']);
  }
  ngOnInit(): void {
    this.initializeLanguage();
    this.redirectIfAuthenticated();
    this.initializeForm();
    this.removeLocalStorage();
    this.stepService.markStepAsComplete(0);
    const savedData = this.stepService.getStepData('step-one');
    if (savedData) {
      this.loginForm.patchValue(savedData);
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
