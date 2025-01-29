import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AddIssueComponent } from './add-issue/add-issue.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TranslationModule } from 'src/app/i18n';
import { NgxIntlTelephoneInputModule } from 'ngx-intl-telephone-input';
import { NgSelectModule } from '@ng-select/ng-select';
import { IssueInfoComponent } from './issue-info/issue-info.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ClaimantComponent } from './claimant/claimant.component';
import { DefendantComponent } from './defendant/defendant.component';
import { AttachmentComponent } from './attachment/attachment.component';
import { ReviewRequestComponent } from './review-request/review-request.component';
import { AcceptEditComponent } from './accept-edit/accept-edit.component';
import { UploadFileModule } from 'src/app/modules/SharedComponent/upload-file/upload-file.module';
import { BreadcrumbModule } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.module';
import { IssueDetailsComponent } from '../view-issue/view-issue/issue-details/issue-details.component';
import { ViewIssueModule } from '../view-issue/view-issue.module';
import { DateFormatterService, NgxHijriGregorianDatepickerModule } from 'ngx-hijri-gregorian-datepicker';

@NgModule({
  declarations: [
    AddIssueComponent,
    IssueInfoComponent,
    ClaimantComponent,
    DefendantComponent,
    AttachmentComponent,
    ReviewRequestComponent,
    AcceptEditComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: AddIssueComponent,
        data: { breadcrumb: 'addcase' }
      },
      {
        path: ':id',
        component: AddIssueComponent,
        data: { breadcrumb: 'editcase' }
      },
    ]),
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    TranslationModule,
    NgxIntlTelephoneInputModule,
    UploadFileModule,
    NgSelectModule,
    NgbDatepickerModule,
    BreadcrumbModule,
    ViewIssueModule,
    NgxHijriGregorianDatepickerModule
  ],
  exports: [NgxHijriGregorianDatepickerModule],
  providers: [DatePipe, DateFormatterService],
})
export class AddIssueModule { }
