import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AddEditSittingComponent } from './add-edit-sitting/add-edit-sitting.component';
import { SittingInfoComponent } from './sitting-info/sitting-info.component';
import { AssignedSittingComponent } from './assigned-sitting/assigned-sitting.component';
import { AttachmentSittingComponent } from './attachment-sitting/attachment-sitting.component';
import { SittingRecordComponent } from './sitting-record/sitting-record.component';
import { ReviewSittingComponent } from './review-sitting/review-sitting.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  NgbDatepickerModule,
  NgbPopoverModule,
  NgbTimepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxIntlTelephoneInputModule } from 'ngx-intl-telephone-input';
import { TranslationModule } from 'src/app/i18n';
import { UploadFileModule } from 'src/app/modules/SharedComponent/upload-file/upload-file.module';
import { AppEditorModule } from 'src/app/modules/SharedComponent/SharedComponent/app-editor/app-editor.module';
import { AcceptEditComponent } from './accept-edit/accept-edit.component';
import { BreadcrumbModule } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.module';
import { NgxHijriGregorianDatepickerModule } from 'ngx-hijri-gregorian-datepicker';

@NgModule({
  declarations: [
    AddEditSittingComponent,
    SittingInfoComponent,
    AssignedSittingComponent,
    AttachmentSittingComponent,
    SittingRecordComponent,
    ReviewSittingComponent,
    AcceptEditComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: ':lawaistId',
        component: AddEditSittingComponent,
        data: { breadcrumb: 'addsitting' }

      },
      {
        path: ':lawaistId/:id',
        component: AddEditSittingComponent,
        data: { breadcrumb: 'editsitting' }

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
    NgbTimepickerModule,
    NgbPopoverModule,
    AppEditorModule,
    BreadcrumbModule,
    NgxHijriGregorianDatepickerModule
  ],
  providers: [DatePipe,NgxHijriGregorianDatepickerModule],
})
export class AddEditSittingModule {}
