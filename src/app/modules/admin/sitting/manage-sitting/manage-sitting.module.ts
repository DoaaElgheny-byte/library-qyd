import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ManageSittingComponent } from './manage-sitting/manage-sitting.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  NgbDatepickerModule,
  NgbPaginationModule,
  NgbModule,
  NgbDropdownModule,
  NgbPopoverModule,
  NgbTimepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxIntlTelephoneInputModule } from 'ngx-intl-telephone-input';
import {
  WidgetsModule,
  ModalsModule,
  DropdownMenusModule,
} from 'src/app/_metronic/partials';
import { TranslationModule } from 'src/app/i18n';
import { UploadFileModule } from 'src/app/modules/SharedComponent/upload-file/upload-file.module';
import { BreadcrumbModule } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.module';

@NgModule({
  declarations: [ManageSittingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ManageSittingComponent,

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
    NgbPaginationModule,
    WidgetsModule,
    ModalsModule,
    DropdownMenusModule,
    NgbModule,
    NgbDropdownModule,
    NgbTimepickerModule,
    NgbPopoverModule,
    BreadcrumbModule
  ],
  exports: [NgbDropdownModule, DropdownMenusModule],
  providers: [DatePipe],
})
export class ManageSittingModule {}
