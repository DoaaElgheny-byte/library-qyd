import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AddAttornyComponent } from './add-attorny/add-attorny.component';
import { AttchmentComponent } from './attchment/attchment.component';
import { AttornyInfoComponent } from './attorny-info/attorny-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxIntlTelephoneInputModule } from 'ngx-intl-telephone-input';
import { TranslationModule } from 'src/app/i18n';
import { BreadcrumbModule } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.module';
import { UploadFileModule } from 'src/app/modules/SharedComponent/upload-file/upload-file.module';
import { ReviewComponent } from './review/review.component';
import { NgxHijriGregorianDatepickerModule } from 'ngx-hijri-gregorian-datepicker';



@NgModule({
  declarations: [
    AddAttornyComponent,
    AttchmentComponent,
    AttornyInfoComponent,
    ReviewComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: ':id',
        component: AddAttornyComponent,
        data: { breadcrumb: 'editattorny' }
      },
      {
        path: '',
        component: AddAttornyComponent,
        data: { breadcrumb: 'addattorny' }
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
    NgxHijriGregorianDatepickerModule
  ],
  exports:[NgxHijriGregorianDatepickerModule],
  providers: [DatePipe],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AddAttornyModule { }
