import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';
import { ValidationPattern } from 'src/app/modules/SharedComponent/helper/validator';
import { AuthService } from 'src/app/modules/auth';
import { Constants } from 'src/app/services/Constants/constants';
import { ContactusService } from 'src/app/services/api/contactus.service';
import { MessageType, UserType } from 'src/app/services/enums/contact.enum';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent implements OnInit {
  contactUsForm: FormGroup = new FormGroup({});
  messageType = MessageType;
  userType = UserType;
  lang: string | null = localStorage.getItem('language');
  currentUser: any;
  siteKey: string = '6LcVXH4pAAAAAH8eyL7Ah1NnXmxvPqS9mT1UxB3K';
  constructor(
    private breadcrumbService: BreadcrumbService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private contactUsService: ContactusService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private router: Router,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.lang = String(localStorage.getItem('language'));
    
    // Setting page title
    let title = "QYD | Contact Us";
    if (this.lang === "ar"){
      title = "قيد | تواصل معنا";
    }
    this.titleService.setTitle(title);

    this.breadcrumbService.restoreBreadcrumbsFromStorage();
    this.initForm();
    this.currentUser = this.authService.getCurrentUser();

    if (this.currentUser) {
      if (this.currentUser?.roles[0] === Constants.AllRoles.employee) {
        this.contactUsForm.get('userType')?.setValue(this.userType.Employee);
      } else if (this.currentUser?.roles[0] === Constants.AllRoles.qydAgent) {
        this.contactUsForm.get('userType')?.setValue(this.userType.Agent);
      }
      this.getData();
      this.contactUsForm.get('email')?.setValue(this.currentUser.email);
      this.contactUsForm.get('email')?.disable();
    } else {
      this.contactUsForm.get('userType')?.setValue(this.userType.Visitor);
    }
  }
  initForm() {
    this.contactUsForm = this.formBuilder.group({
      name: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(ValidationPattern.Email),
        ]),
      ],
      messageType: [null, Validators.compose([Validators.required])],
      userType: [null, Validators.compose([Validators.required])],

      message: [null, Validators.compose([Validators.required])],
      recaptcha: ['', Validators.required],
    });
  }
  getData() {
    this.authService.getcurrentUserApi().subscribe({
      next: (next) => {
        this.contactUsForm.get('name')?.setValue(next.data.name);
        this.contactUsForm.get('name')?.disable();
      },
    });
  }
  // submit
  submit() {
    Object.keys(this.contactUsForm.controls).forEach((field) => {
      // {1}
      const control = this.contactUsForm.get(field); // {2}
      control?.markAsTouched({ onlySelf: true }); // {3}
    });
    if (this.contactUsForm.valid) {
      this.spinner.show();

      this.contactUsService
        .sendContactUsData(this.contactUsForm.getRawValue())
        .subscribe({
          next: (value: any) => {
            this.spinner.hide();
            this.toastr.success(
              this.translate.instant('contactUs.SuccessfulMessage')
            );
            if (value.success) this.router.navigate(['/home']);
          },

          error: (err: any) => {
            this.spinner.hide();
            this.toastr.error(err.error?.error?.message);
          },
        });
    }
  }
}
