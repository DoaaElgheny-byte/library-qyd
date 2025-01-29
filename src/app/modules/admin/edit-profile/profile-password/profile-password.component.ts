import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription, first } from 'rxjs';
import { ConfirmPasswordValidator } from 'src/app/modules/SharedComponent/helper/confirm-password.validator';
import { ValidationPattern } from 'src/app/modules/SharedComponent/helper/validator';
import { AuthService } from 'src/app/modules/auth';
import { CompleteProfileService } from 'src/app/modules/auth/services/complete-profile.service';

@Component({
  selector: 'app-profile-password',
  templateUrl: './profile-password.component.html',
  styleUrls: ['./profile-password.component.scss']
})
export class ProfilePasswordComponent implements OnInit ,OnDestroy{

  public newPasswordForm: FormGroup;
  hasError: boolean;
  showPassword: boolean;
  showPasswordConfirm: boolean;
  showPassword1:boolean
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private completeProfileservice: CompleteProfileService,
    private authservice: AuthService,
    private router: Router,

    private cdr: ChangeDetectorRef,

    private translate: TranslateService,

    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.initForm();
   
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.newPasswordForm.controls;
  }

  initForm() {
    this.newPasswordForm = this.fb.group(
      {
        currentPassword: [
          null,
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(ValidationPattern.Password),
          ]),
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
  togglePasswordOldVisibilty() {
    this.showPassword1 = !this.showPassword1;
  }

  submit() {
    let data ={
      ...this.newPasswordForm.value,
      newPassword:this.newPasswordForm.value.password,
    }
    this.newPasswordForm.markAllAsTouched()
    if(this.newPasswordForm.valid){
      this.spinner.show();
      this.completeProfileservice.editPassword(data).subscribe({
        next:next=>{
          this.spinner.hide();
          if(next.success){
            this.toastr.success(
              this.translate.instant('editProfile.addPasswordSuccess')
            );
            this.cdr.detectChanges();
            this.authservice.logout()
          }else{
            this.toastr.error(next.message);
  
          }
          
        },error:error=>{
          this.spinner.hide();
          this.toastr.error(error.error.error.message);
        }
      })
    }
    
  }


  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}