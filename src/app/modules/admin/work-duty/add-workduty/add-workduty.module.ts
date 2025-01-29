import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AddWorkdutyComponent } from './add-workduty/add-workduty.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxIntlTelephoneInputModule } from 'ngx-intl-telephone-input';
import { TranslationModule } from 'src/app/i18n';
import { WorkDutyInfoComponent } from './work-duty-info/work-duty-info.component';
import { WorkDutyAssignedComponent } from './work-duty-assigned/work-duty-assigned.component';
import { WorkDutyAttachmentComponent } from './work-duty-attachment/work-duty-attachment.component';
import { WorkDtyReviewComponent } from './work-dty-review/work-dty-review.component';
import { ViewWorkdutyModule } from '../view-workduty/view-workduty.module';
import { WorkdutyDetailsComponent } from '../view-workduty/workduty-details/workduty-details.component';
import { UploadFileModule } from 'src/app/modules/SharedComponent/upload-file/upload-file.module';
import { BreadcrumbModule } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.module';
import { AddAllWorkdutyComponent } from './add-all-workduty/add-all-workduty.component';
import { NgxHijriGregorianDatepickerModule } from 'ngx-hijri-gregorian-datepicker';



@NgModule({
  declarations: [
    AddWorkdutyComponent,
    WorkDutyInfoComponent,
    WorkDutyAssignedComponent,
    WorkDutyAttachmentComponent,
    WorkDtyReviewComponent,
    AddAllWorkdutyComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: ':fromIssue/:issueNo',
        component: AddWorkdutyComponent,
        data: { breadcrumb: 'addworkduty' }

      },
      {
        path: ':id',
        component: AddWorkdutyComponent,
        data: { breadcrumb: 'editworkduty' }

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
    ViewWorkdutyModule,
    BreadcrumbModule,
    NgxHijriGregorianDatepickerModule
  ],
  exports:[NgxHijriGregorianDatepickerModule],
  providers: [DatePipe],
  
})
export class AddWorkdutyModule { }
