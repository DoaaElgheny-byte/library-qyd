import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-telephone-input';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { catchError, EMPTY, finalize, Observable, Subscription, throwError } from 'rxjs';
import { TranslationService } from 'src/app/i18n';
import { ValidationPattern } from 'src/app/modules/SharedComponent/helper/validator';
import { AccountTypes } from 'src/app/services/enums/accountType.enum';
import { AuthService } from '../../../services/auth.service';
import { CompleteProfileService } from '../../../services/complete-profile.service';
import { TermsAndConditionsModelComponentComponent } from '../terms-and-conditions-model-component/terms-and-conditions-model-component.component';
declare let gtag: Function;

@Component({
  selector: 'app-main-info',
  templateUrl: './main-info.component.html',
  styleUrls: ['./main-info.component.scss']
})
export class MainInfoComponent implements OnInit, OnDestroy {

  selectedLanguage: boolean = true;
  siteKey: string = '6LcVXH4pAAAAAH8eyL7Ah1NnXmxvPqS9mT1UxB3K';

  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;
  showPassword: boolean;
  accountTypes = AccountTypes;
  private unsubscribe: Subscription[] = [];
  public lang: string;
  public CountryISO: any;
  public PhoneNumberFormat: any;
  public SearchCountryField: any;
  public selectedCountryIso: any;
  mobileNumber: any;
  modalRef?: NgbModalRef;
  isModalOpen = false;
  isShowEmail: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private translationService: TranslationService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    public datepipe: DatePipe,
    private completeProfileservice: CompleteProfileService,

  ) {
    this.isLoading$ = this.authService.isLoading$;
    this.CountryISO = CountryISO;
    this.PhoneNumberFormat = PhoneNumberFormat;
    this.SearchCountryField = SearchCountryField;
  }

  ngOnInit(): void {
    this.lang = String(localStorage.getItem('language'))
    this.initForm();
    const authToken = localStorage.getItem('authLocalStorageTokenquid');
    if (authToken) {
      this.router.navigate(['/admin/departments/dashboard-managment']);
    }
    const storedLanguage = localStorage.getItem('statusOfToggleLogin');

    if (storedLanguage === null) {
      this.selectedLanguage = true;
      this.translationService.setLanguage('ar');
    } else {
      this.selectedLanguage = JSON.parse(storedLanguage);
      this.translationService.setLanguage(this.selectedLanguage ? 'ar' : 'en');
    }
    debugger
    let email = localStorage.getItem('email');
    if (email && email !== "null" && email !== "") {
      this.isShowEmail = false;
      this.loginForm.get('email')?.setValue(email);
    }
    let mobileNumber = localStorage.getItem('mobileNumber');
    if (mobileNumber && mobileNumber !== "null" && mobileNumber !== "") {
      this.isShowEmail = true;
      let mobileNumber = localStorage.getItem('mobileNumber');
      let countryCode = localStorage.getItem('countryCode');

      this.loginForm.get('mobileNumber')?.setValue(mobileNumber);
      this.loginForm.get('countryCode')?.setValue(countryCode);
    }
    window.addEventListener('popstate', this.handleNavigation);
  }

  initForm() {
    this.loginForm = this.fb.group({
      name: [null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(200),
        ]),],
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(ValidationPattern.Email),
        ]),

      ],
      recaptcha: [null, Validators.compose([
        Validators.required
      ])],
      mobileNumber: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(ValidationPattern.Mobile),
          Validators.maxLength(16),
          Validators.minLength(9)
        ]),
      ],
      countryCode: [966],
      countryCodeIso: 'sa',
      accountType: [
        null,
        Validators.compose([
          Validators.required,
        ])
      ],
      agree: [null, [this.requiredTrueValidator]],
    });
  }

  requiredTrueValidator(control: AbstractControl) {
    return control.value === true ? null : { required: true };
  }

  view() {
    this.isModalOpen = true;
    this.modalRef = this.modalService.open(TermsAndConditionsModelComponentComponent, {
      size: 'xl',
      backdrop: 'static',
    });

    this.modalRef.result.finally(() => {
      this.isModalOpen = false;
    });
  }

  public onInputChange(event: any) {
    if (event.isNumberValid) {
      this.loginForm
        .get('mobileNumber')
        ?.setValue(
          event.phoneNumber.replace(/\s/g, '').split('+' + event.dialCode)[1]
        );
      this.loginForm.get('countryCode')?.setValue(event.dialCode);
      this.loginForm.get('countryCodeIso')?.setValue(event.iso2Code);
    } else {
      this.loginForm.get('mobileNumber')?.markAsTouched({ onlySelf: true });
      this.loginForm.get('mobileNumber')?.setErrors({ required: true });
    }
  }

  togglePasswordVisibilty() {
    this.showPassword = !this.showPassword;
  }

  submit() {
    debugger
    this.loginForm.markAllAsTouched()
    this.loginForm.get
    let data = {
      ...this.loginForm.value,
      accountType: +this.loginForm.value.accountType,
      appUserId: localStorage.getItem('userId')
    }
    if (this.loginForm.valid) {
      this.spinner.show();
      this.authService.singUp(data)
        .pipe(
          finalize(() => {
            this.spinner.hide();
          }),
          catchError((err) => {
            // Check for network error
            if (!navigator.onLine) {
              this.toastr.error(this.translate.instant('errorPage.SERVER_ERROR_MESSAGE'));
            } else {
              this.toastr.error(this.translate.instant('errorPage.SERVER_ERROR_MESSAGE'));
            }
            // Rethrow the error to stop the observable if needed
            return EMPTY;
          })
        ).subscribe({
          next: next => {
            this.spinner.hide();
            if (next.success) {
              this.toastr.success(
                this.translate.instant('register.addSuccess')
              );
              this.router.navigate(['/auth/after-register'])
              this.cdr.detectChanges();
              // GA4 (google Analytics)
              let userName = this.loginForm.get('name')?.value;
              let accountType = this.loginForm.get('accountType')?.value;
              let email = this.loginForm.get('email')?.value;
              let date = this.datepipe.transform(new Date, 'yyyy-MM-dd');
              let mobileNumber = this.loginForm.get('countryCode')?.value + this.loginForm.get('mobileNumber')?.value;

              if (data.accountType == this.accountTypes.Advisor) accountType = this.translate.instant('package.advisor');
              if (data.accountType == this.accountTypes.LegalDepartment) accountType = this.translate.instant('register.LegalDepartment');
              if (data.accountType == this.accountTypes.Traininglawyer) accountType = this.translate.instant('register.Traininglawyer');
              if (data.accountType == this.accountTypes.Licensedlawyer) accountType = this.translate.instant('register.Licensedlawyer');
              if (data.accountType == this.accountTypes.LegalAdministration) accountType = this.translate.instant('register.LegalAdministration');
              if (data.accountType == this.accountTypes.LawyerOffice) accountType = this.translate.instant('package.lawyerOffice');
              if (data.accountType == this.accountTypes.LegalDepartment) accountType = this.translate.instant('register.LegalDepartment');
              if (data.accountType == this.accountTypes.RegularRepresentative) accountType = this.translate.instant('package.regularRepresentative');
              if (data.accountType == this.accountTypes.All) accountType = this.translate.instant('LogIn.qydAgent');

              gtag('event', 'registration_pre_data_completion', {
                user_name: userName,
                account_type: accountType,
                email: email,
                timestamp: date,
                mobile_number: mobileNumber,
                signup_method: 'signup with Email'
              });
            } else {
              this.toastr.error(next.message);
            }

          }, error: error => {
            this.spinner.hide();
            this.toastr.error(error.error.message);
          }
        })
    }
  }

  selectLanguage() {

    if (this.selectedLanguage) {
      this.translationService.setLanguage('ar');
      this.lang = 'ar'
      localStorage.setItem('statusOfToggleLogin', 'true');
    } else {
      this.translationService.setLanguage('en');
      this.lang = 'en'

      localStorage.setItem('statusOfToggleLogin', 'false');
    }
  }

  handleNavigation = (event: PopStateEvent) => {
    if (this.isModalOpen) {
      this.modalRef?.close();
      this.isModalOpen = false;
      history.pushState(null, document.title, location.href);
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    window.removeEventListener('popstate', this.handleNavigation);
  }
}
