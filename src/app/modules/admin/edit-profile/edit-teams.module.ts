import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslationModule } from 'src/app/i18n';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxIntlTelephoneInputModule } from 'ngx-intl-telephone-input';
import { UploadFileModule } from '../../SharedComponent/upload-file/upload-file.module';
import { EditTeamsComponent } from './edit-teams.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProfilePasswordComponent } from './profile-password/profile-password.component';
import { BasicInfoComponent } from './basic-info/basic-info.component';
import { ProfileEmailComponent } from './profile-email/profile-email.component';
import { SendCodeComponent } from './send-code/send-code.component';
import { BreadcrumbModule } from '../../SharedComponent/SharedComponent/breadcrumb/breadcrumb.module';
import { AuthGuard } from '../../auth/services/auth.guard';
import { VatInfoComponent } from './vat-info/vat-info.component';
import { DeactivateAccountComponent } from './deactivate-account/deactivate-account.component';
import { DeactivateModalComponent } from './deactivate-account/deactivate-modal/deactivate-modal.component';

@NgModule({
  declarations: [
    EditTeamsComponent,
    ProfilePasswordComponent,
    BasicInfoComponent,
    ProfileEmailComponent,
    SendCodeComponent,
    VatInfoComponent,
    DeactivateAccountComponent,
    DeactivateModalComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        canActivate: [AuthGuard],
        component: EditTeamsComponent,
        data: { breadcrumb: 'editprofile', roles: ['QYDAgent'] },
      },
    ]),
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    TranslationModule,
    NgxIntlTelephoneInputModule,
    UploadFileModule,
    NgSelectModule,
    BreadcrumbModule,
  ],
})
export class EditTeamsModule { }
