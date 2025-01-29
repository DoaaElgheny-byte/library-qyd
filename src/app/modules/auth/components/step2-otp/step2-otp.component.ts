import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationPattern } from 'src/app/modules/SharedComponent/helper/validator';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { StepsService } from '../../services/steps.service';

@Component({
  selector: 'app-step2-otp',
  templateUrl: './step2-otp.component.html',
  styleUrls: ['./step2-otp.component.scss']
})
export class Step2OtpComponent implements OnInit {

  otp: string[] = ['', '', '', ''];
  timer: number = 30; // Countdown timer in seconds
  interval: any;
  phoneOrEmail: string | null;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private stepService: StepsService
  ) { }

  ngOnInit(): void {
    this.startTimer();
    this.phoneOrEmail = localStorage.getItem('phoneOrEmail');
    // const savedData = this.stepService.getStepData('step-two');
    // console.log("savedData=>", savedData);

    // if (savedData) {
    //   this.otp = savedData
    // }

  }

  startTimer(): void {

    this.timer = 60; // Reset timer
    this.interval = setInterval(() => {

      if (this.timer > 0) {

        this.timer--;
        this.cdr.detectChanges(); // Manually trigger change detection


      } else {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  moveToNext(event: any, index: number): void {
    const value = event.target.value;
    if (value && index < this.otp.length - 1) {
      document.querySelectorAll<HTMLInputElement>('.otp-inputs input')[index + 1].focus();
    }
  }

  resendCode(): void {
    this.startTimer();

    let email = localStorage.getItem('email');
    email = email === "null" || email === null ? "" : email;
    let mobile = localStorage.getItem('mobileNumber');
    mobile = mobile === "null" || mobile === null ? "" : mobile;
    let countryCode = localStorage.getItem('countryCode');
    countryCode = countryCode === "null" || countryCode === null ? "" : countryCode;

    let obj = {
      mobileNumber: mobile,
      countryCode: countryCode,
      countryCodeIso: 'sa',
      email: email
    }
    this.authService.resendCode(obj).subscribe({
      next: next => {
        if (next.success) {
          this.toastr.success(this.translate.instant('LogIn.CodeResendSuccess'));
        }
        else {
          this.toastr.error(this.translate.instant('errorPage.ERROR_TITLE'));
        }
      }
      ,
      error: (error) => {
        this.spinner.hide();
        this.toastr.error(error);
      },
    })
  }

  isOtpComplete(): boolean {
    return this.otp.every(digit => digit !== '');
  }

  confirmOtp(): void {
    let code = this.otp.join('');
    if (code.length >= 4) {
      const email = localStorage.getItem('email') === 'null' || localStorage.getItem('email') === null ? '' : localStorage.getItem('email')!;
      const mobileNumber = localStorage.getItem('mobileNumber') === 'null' || localStorage.getItem('mobileNumber') === null ? '' : localStorage.getItem('mobileNumber')!;
      const countryCode = localStorage.getItem('countryCode') === 'null' || localStorage.getItem('countryCode') === null ? '' : localStorage.getItem('countryCode')!;
      let obj = {
        Code: +(code),
        email: email,
        mobileNumber: mobileNumber,
        countryCode: countryCode
      };
      this.spinner.show();
      this.authService.verificationOtpCode(obj).pipe(finalize(() => {
        this.spinner.hide();
      })).subscribe({
        next: next => {
          if (next.data) {
            if (this.isOtpComplete()) {
              const otpCode = this.otp.join('');
              this.router.navigate(['../select-package'], { relativeTo: this.route });
              this.completeStep()
            } else {
              this.spinner.hide();
              this.toastr.error(this.translate.instant('LogIn.CodeYouEnteredIncorrect'));
            }
          }
          else {
            this.spinner.hide();
            this.toastr.error(this.translate.instant('LogIn.CodeYouEnteredIncorrect'));
          }
        }
      })
    }

  }

  editPhoneNumber(): void {
    this.router.navigate(['/auth/register']);
  }
  completeStep(): void {
    // this.stepService.setStepData('step-two', this.otp);
    this.stepService.markStepAsComplete(2);
    this.router.navigate(['/auth/register/select-package']);
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

}
