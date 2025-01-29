import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmEmailValidator } from 'src/app/modules/SharedComponent/helper/confirm-email.validator';
import { ConfirmPasswordValidator } from 'src/app/modules/SharedComponent/helper/confirm-password.validator';
import { ValidationPattern } from 'src/app/modules/SharedComponent/helper/validator';
import { AuthService } from 'src/app/modules/auth';
import { CompleteProfileService } from 'src/app/modules/auth/services/complete-profile.service';
import { SendCodeComponent } from '../send-code/send-code.component';

@Component({
  selector: 'app-profile-email',
  templateUrl: './profile-email.component.html',
  styleUrls: ['./profile-email.component.scss']
})
export class ProfileEmailComponent implements OnInit,OnDestroy {

  public newEmailForm: FormGroup;
  hasError: boolean;
  
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
    this.getCompletedData()
   
  }
  profileData:any
  getCompletedData(){
    this.completeProfileservice.getDataOfCompleteInfo(0).subscribe({
      next:next=>{
        this.profileData=next.data
        this.newEmailForm.patchValue({
          email:this.profileData.email,
          emailConfirm:this.profileData.email,
        })
        
       
      }
    })
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.newEmailForm.controls;
  }

  initForm() {
    this.newEmailForm = this.fb.group(
      {

        email: [
          null,
          Validators.compose([
            Validators.required,
            Validators.pattern(ValidationPattern.Email),
          ]),
        ],
        emailConfirm: [
          null,
          Validators.compose([
            Validators.required,
            Validators.pattern(ValidationPattern.Email),
          ]),
        ],
      },
      {
        validator: [, ConfirmEmailValidator.MatchemailConfirm],
      }
    );
  }

 
  save() {
    this.newEmailForm.markAllAsTouched()
    if(this.newEmailForm.valid){
      this.spinner.show();
      
      this.completeProfileservice.sendVerificationCode(this.newEmailForm.value.email).subscribe({
        next:next=>{
          this.spinner.hide();
          if(next.success){
            this.sendVerficaton(this.newEmailForm.value.email)
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
  private modalService = inject(NgbModal);

  sendVerficaton(email:any) {
		const modalRef = this.modalService.open(SendCodeComponent);
		modalRef.componentInstance.email = email;


	}

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}