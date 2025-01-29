import { ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ValidationPattern } from 'src/app/modules/SharedComponent/helper/validator';
import { AuthService } from 'src/app/modules/auth';
import { CompleteProfileService } from 'src/app/modules/auth/services/complete-profile.service';

@Component({
  selector: 'app-send-code',
  templateUrl: './send-code.component.html',
  styleUrls: ['./send-code.component.scss']
})
export class SendCodeComponent implements OnInit {
  activeModal = inject(NgbActiveModal);

  @Input() email: string;  
  public codeForm: FormGroup;

  constructor(
    private fb:FormBuilder,
    private completeprfileservice:CompleteProfileService,
    private cdr: ChangeDetectorRef,
    private authservice:AuthService,
    private translate: TranslateService,

    private toastr: ToastrService,
    private spinner: NgxSpinnerService){}
  ngOnInit(): void {
    this.initForm()
  }
  get f() {
    return this.codeForm.controls;
  }
  initForm() {
    this.codeForm = this.fb.group(
      {
        code: [
          null,
          Validators.compose([
            Validators.required,
            Validators.maxLength(4),
            Validators.minLength(4)
          ]),
        ],
      }
    )
  }
  submit(){
    this.codeForm.markAllAsTouched()
    if(this.codeForm.valid){
      let data={
        ...this.codeForm.value,
        email:this.email
      }
      this.completeprfileservice.checkValidationCode(data).subscribe({
        next:next=>{
          this.spinner.hide();
          if(next.data){
            this.editEmail()
            
            this.cdr.detectChanges();
          }else{
            this.toastr.error(
              this.translate.instant('editProfile.sendemailErrro')
              );
  
          }
          
        },error:error=>{
          this.spinner.hide();
          this.toastr.error(error.error.error.message);
        }
      })
    }
  }
  editEmail(){
    let data={
      email:this.email
    }
    this.completeprfileservice.editEmail(data).subscribe({
      next:next=>{
        this.spinner.hide();
        if(next.success){
          this.toastr.success(
            this.translate.instant('editProfile.sendemailSuccess')
          );
          this.cdr.detectChanges();
          this.activeModal.close()
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
