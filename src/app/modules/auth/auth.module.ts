import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TranslationModule } from 'src/app/i18n/translation.module';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { ActivateSucComponent } from './components/activate-suc/activate-suc.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { getChangedComponent } from './components/get-changed/get-changed.component';
import { LoginComponent } from './components/login/login.component';
import { OtpComponent } from './components/otp/otp.component';
import { SetNewPasswordComponent } from './components/set-new-password/set-new-password.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgxCaptchaModule } from 'ngx-captcha';
import { NgxIntlTelephoneInputModule } from 'ngx-intl-telephone-input';
import { BlockCopyPasteDirective } from 'src/app/modules/SharedComponent/block-copy-paste.directive';
import { UploadFileModule } from 'src/app/modules/SharedComponent/upload-file/upload-file.module';
import { ActivateSucEmployeeComponent } from './components/activate-suc-employee/activate-suc-employee.component';
import { AfterRegisterationSucComponent } from './components/after-registeration-suc/after-registeration-suc.component';
import { SecondInfoComponent } from './components/registeration/complete-info/second-info.component';
import { Step2Component } from './components/registeration/complete-info/step2/step2.component';
import { MainInfoComponent } from './components/registeration/register/main-info.component';
import { RegisterationComponent } from './components/registeration/registeration.component';
import { TermsAndConditionsModelComponentComponent } from './components/registeration/terms-and-conditions-model-component/terms-and-conditions-model-component.component';
import { Step1LoginComponent } from './components/step1-login/step1-login.component';
import { Step2OtpComponent } from './components/step2-otp/step2-otp.component';
import { Step3SelectPackageComponent } from './components/step3-select-package/step3-select-package.component';
import { PackageCardModule } from '../SharedComponent/SharedComponent/package-card/package-card/package-card.module';

@NgModule({
  declarations: [
    LoginComponent,
    OtpComponent,
    ForgotPasswordComponent,
    AuthComponent,
    SetNewPasswordComponent,
    ActivateSucComponent,
    getChangedComponent,

    AfterRegisterationSucComponent,
    BlockCopyPasteDirective,
    RegisterationComponent,
    MainInfoComponent,
    SecondInfoComponent,
    Step2Component,
    ActivateSucEmployeeComponent,
    TermsAndConditionsModelComponentComponent,
    Step1LoginComponent,
    Step2OtpComponent,
    Step3SelectPackageComponent,
  ],
  imports: [
    CommonModule,
    TranslationModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    NgbDatepickerModule,
    NgxIntlTelephoneInputModule,
    UploadFileModule,
    NgSelectModule,
    NgxCaptchaModule,
    PackageCardModule,

  ],
  exports: [NgxIntlTelephoneInputModule, UploadFileModule],
  providers: [DatePipe],
})
export class AuthModule { }
