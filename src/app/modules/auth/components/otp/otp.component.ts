import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
})
export class OtpComponent implements OnInit, OnDestroy {
  codeCharactersForm: FormGroup;
  hasError: boolean;
  isPassword: boolean;
  returnUrl: string;

  isLoading$: Observable<boolean>;
  private unsubscribe: Subscription[] = [];

  constructor(
    private formbuilder: FormBuilder,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.initForm();
    this.activatedRoute.params.subscribe((params: any) => {
      this.isPassword = params.isPassword
      this.codeCharactersForm!.get('email')!.setValue(params.email);
    });

  }

  initForm() {
    this.codeCharactersForm = this.formbuilder.group({
      email: [null, Validators.required],
      char1: [null, Validators.required],
      char2: [null, Validators.required],
      char3: [null, Validators.required],
      char4: [null, Validators.required],
    });
  }

  movetoNext(e: any) {
    if (e.srcElement.value != '') {
      e.preventDefault();
      let nextControl: any = e.srcElement.nextElementSibling;
      // Searching for next similar control to set it focus
      while (true) {
        if (nextControl) {
          if (nextControl.type === e.srcElement.type) {
            nextControl.focus();
            return;
          } else {
            nextControl = nextControl.nextElementSibling;
          }
        } else {
          return;
        }
      }
    }
  }

  submit() {
    const formValue = this.codeCharactersForm.value;
    const { char1, char2, char3, char4 } = formValue;
    let enteredCode = char1 + char2 + char3 + char4;
    this.hasError = false;
    const loginSubscr = this.authService
      .verificationCode({ code: enteredCode, email: this.codeCharactersForm.value.email })
      .pipe(first())
      .subscribe((user) => {

        if (this.isPassword) {
          this.router.navigate([`auth/set-new-password/${this.codeCharactersForm.value.email}`]);
        }
        else {
          this.router.navigate(['auth/login']);
        }


      });
    this.unsubscribe.push(loginSubscr);
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
