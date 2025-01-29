import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TranslationService } from 'src/app/i18n';
import { ValidationPattern } from 'src/app/modules/SharedComponent/helper/validator';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  selectedLanguage: boolean = true;
  lang: string;
  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;
  showPassword: boolean;
  siteKey: string = '6LcVXH4pAAAAAH8eyL7Ah1NnXmxvPqS9mT1UxB3K';

  private unsubscribe: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private translationService: TranslationService,
    private titleService: Title
  ) {
    this.isLoading$ = this.authService.isLoading$;
    this.translationService.setLanguage('ar');
  }

  ngOnInit(): void {
    this.lang = String(localStorage.getItem('language'))
    const authToken = localStorage.getItem('authLocalStorageTokenquid');
    if (authToken) {
      this.router.navigate(['/admin/departments/dashboard-managment']);
    }

    this.initForm();
    const storedLanguage = localStorage.getItem('statusOfToggleLogin');

    if (storedLanguage === null) {
      this.selectedLanguage = true;
      this.translationService.setLanguage('ar');
    } else {
      this.selectedLanguage = JSON.parse(storedLanguage);
      this.translationService.setLanguage(this.selectedLanguage ? 'ar' : 'en');
    }

    // Setting page title
    let title = "QYD";
    if (this.lang === "ar") {
      title = "قيد";
    }
    this.titleService.setTitle(title);
  }


  initForm() {
    this.loginForm = this.fb.group({
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(ValidationPattern.Email),
        ]),
      ],
      password: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(ValidationPattern.Password),
        ]),
      ],
      recaptcha: [null, Validators.compose([
        Validators.required
      ])]
    });
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  submit() {
    this.loginForm.markAllAsTouched()
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value);
    }
  }
  selectLanguage() {

    if (this.selectedLanguage) {
      this.lang = 'ar'

      this.translationService.setLanguage('ar');
      localStorage.setItem('statusOfToggleLogin', 'true');
    } else {
      this.lang = 'en'

      this.translationService.setLanguage('en');
      localStorage.setItem('statusOfToggleLogin', 'false');
    }

    // Setting page title
    let title = "QYD";
    if (this.lang === "ar") {
      title = "قيد";
    }
    this.titleService.setTitle(title);
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
  goToHome() {
    this.router.navigate(['/home'])
  }
}
