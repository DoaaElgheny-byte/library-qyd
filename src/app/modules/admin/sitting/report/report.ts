import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDatepickerModule, NgbPopoverModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxIntlTelephoneInputModule } from 'ngx-intl-telephone-input';
import { TranslationModule } from 'src/app/i18n';
import { BreadcrumbModule } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.module';
import { UploadFileModule } from 'src/app/modules/SharedComponent/upload-file/upload-file.module';
import { ReportComponent } from './report/report';
import { AppEditorModule } from 'src/app/modules/SharedComponent/SharedComponent/app-editor/app-editor.module';



@NgModule({
  declarations: [ReportComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ReportComponent,
        data: { breadcrumb: 'report' }
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
    NgbTimepickerModule,
    NgbPopoverModule,
    AppEditorModule,
  ],
  providers: [DatePipe],
})
export class ReportModule { }
