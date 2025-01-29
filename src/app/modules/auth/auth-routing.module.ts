import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { ActivateSucEmployeeComponent } from './components/activate-suc-employee/activate-suc-employee.component';
import { ActivateSucComponent } from './components/activate-suc/activate-suc.component';
import { AfterRegisterationSucComponent } from './components/after-registeration-suc/after-registeration-suc.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { getChangedComponent } from './components/get-changed/get-changed.component';
import { LoginComponent } from './components/login/login.component';
import { OtpComponent } from './components/otp/otp.component';
import { RegisterationComponent } from './components/registeration/registeration.component';
import { SetNewPasswordComponent } from './components/set-new-password/set-new-password.component';
import { Step1LoginComponent } from './components/step1-login/step1-login.component';
import { Step2OtpComponent } from './components/step2-otp/step2-otp.component';
import { Step3SelectPackageComponent } from './components/step3-select-package/step3-select-package.component';
import { MainInfoComponent } from './components/registeration/register/main-info.component';
import { SecondInfoComponent } from './components/registeration/complete-info/second-info.component';
import { Step2Component } from './components/registeration/complete-info/step2/step2.component';
import { StepGuard } from './guards/step.guard';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: LoginComponent,
        data: { returnUrl: window.location.pathname },
      },
      {
        path: 'register',
        component: RegisterationComponent,
        children: [
          { path: '', component: Step1LoginComponent },
          { path: 'otp', component: Step2OtpComponent, canActivate: [StepGuard] },
          { path: 'select-package', component: Step3SelectPackageComponent, canActivate: [StepGuard] },
          { path: 'after-registerion', component: SecondInfoComponent },
          { path: 'step-2', component: Step2Component },
          {
            path: 'complete-info',
            component: MainInfoComponent,
          },
        ]
      },

      {
        path: 'after-register',
        component: AfterRegisterationSucComponent
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      },
      {
        path: 'set-new-password',
        component: SetNewPasswordComponent,
      },
      {
        path: 'otp/:email/:isPassword',
        component: OtpComponent,
      },
      {

        path: 'activate-suc',
        component: ActivateSucComponent,
      },
      {

        path: 'activate-suc-employee',
        component: ActivateSucEmployeeComponent,
      },
      {
        path: 'Changed/:email',
        component: getChangedComponent,
      },



      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '**', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule { }
