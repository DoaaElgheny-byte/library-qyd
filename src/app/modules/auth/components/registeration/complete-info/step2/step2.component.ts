import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription, forkJoin } from 'rxjs';
import { ValidationPattern } from 'src/app/modules/SharedComponent/helper/validator';
import { SectorModel } from 'src/app/modules/auth/models/sector.model';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { CompleteProfileService } from 'src/app/modules/auth/services/complete-profile.service';
import { AccountTypes } from 'src/app/services/enums/accountType.enum';
declare let gtag: Function;

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss']
})
export class Step2Component implements OnInit, OnDestroy {
  loginForm: FormGroup;
  hasError: boolean;
  private unsubscribe: Subscription[] = [];
  accountTypes = AccountTypes;
  lang: string | null = localStorage.getItem('language');
  regions: SectorModel[]
  city: SectorModel[]
  sectors: SectorModel[]
  currency: any
  employeeNo: { id: number, size: string }[]
  accountType: any;

  constructor(
    private fb: FormBuilder,
    private completeProfileservice: CompleteProfileService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    public datepipe: DatePipe,
    private authService: AuthService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getData()
  }
  getData() {
    forkJoin([
      this.completeProfileservice.getRegion(),
      this.completeProfileservice.getCurrancy()
    ]).subscribe({
      next: ([Regions, Currency]) => {
        this.regions = Regions.data;
        this.currency = Currency.data
        this.spinner.hide();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.spinner.hide();
      },
    });
  }
  getCity(id: any) {
    this.completeProfileservice.getCity({ regionId: id.target.value }).subscribe({
      next: next => {
        this.city = next.data
        this.cdr.detectChanges();
      }
    })
  }
  initForm() {
    this.loginForm = this.fb.group({
      countryId: [
        null,
        Validators.compose([
          Validators.required,
        ]),
      ],
      regionId: [
        null,
      ],
      cityId: [
        null,
        Validators.compose([
          Validators.required,
        ]),
      ],
      currencyId: [
        2
      ],
      agentAddress: [
        null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(200)
        ]),
      ],
      language: [
        null,
        Validators.compose([
          Validators.required,
        ]),
      ],

    });
  }
  submit() {
    debugger
    this.loginForm.markAllAsTouched()
    if (this.loginForm.valid) {
      this.spinner.show()
      this.completeProfileservice.Step2completeProfile(this.loginForm.value).subscribe({
        next: next => {
          this.spinner.hide();
          if (next.success) {
            debugger
            localStorage.setItem('isComplete', 'true')
            localStorage.setItem('isShowCompletedForm', 'true')
            this.router.navigate(['/admin/departments/dashboard-managment'])
            this.authService.getcurrentUserApi().subscribe(data => {
              this.accountType = data.data.accountType
              if ((this.accountType == AccountTypes.LawyerOffice
                || this.accountType == AccountTypes.RegularRepresentative
                || this.accountType == AccountTypes.LegalDepartment
              ))
                this.completeProfileservice.sendFreeTrial().subscribe(res => {
                })
            })

            this.cdr.detectChanges();
            this.completeProfileservice.getDataOfforgA4().subscribe(res => {
              let userName = res.name;
              let accountType = res.accountType;
              let email = res.email;
              let vatregistered = res.isSubscribeOnVat;
              let employeecount = res.agentSize;
              let mobileNumber = '+' + res.countryCode + res.mobileNumber;
              let date = this.datepipe.transform(new Date, 'yyyy-MM-dd');

              if (res.accountType == this.accountTypes.Advisor) accountType = this.translate.instant('package.advisor');
              if (res.accountType == this.accountTypes.Traininglawyer) accountType = this.translate.instant('register.Traininglawyer');
              if (res.accountType == this.accountTypes.Licensedlawyer) accountType = this.translate.instant('register.Licensedlawyer');
              if (res.accountType == this.accountTypes.LegalAdministration) accountType = this.translate.instant('register.LegalAdministration');
              if (res.accountType == this.accountTypes.LawyerOffice) accountType = this.translate.instant('package.lawyerOffice');
              if (res.accountType == this.accountTypes.LegalDepartment) accountType = this.translate.instant('register.LegalDepartment');

              if (res.accountType == this.accountTypes.RegularRepresentative) accountType = this.translate.instant('package.regularRepresentative');
              if (res.accountType == this.accountTypes.All) accountType = this.translate.instant('LogIn.qydAgent');

              gtag('event', 'sign_up_success', {
                user_name: userName,
                account_type: accountType,
                email: email,
                vat_registered: vatregistered,
                employee_count: employeecount,
                mobile_number: mobileNumber,
                timestamp: date,
                signup_method: 'signup with Email'
              });
            })

          } else {
            this.toastr.error(next.message);
          }

        }, error: error => {
          this.spinner.hide();
          this.toastr.error(error.error.error.message);
        }
      })
    }
  }

  commercialName: string | null
  commercialStorageFileName: string | null
  uploadImg(data: any) {
    this.loginForm
      .get('logoImageName')
      ?.setValue(data.fileName);
    this.loginForm
      .get('logoImageStorageFileName')
      ?.setValue(data.storageFileName);
    this.commercialName = null;
    this.commercialStorageFileName = data.fileName;
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}

