import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbPaginationModule, NgbModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxIntlTelephoneInputModule } from 'ngx-intl-telephone-input';
import { WidgetsModule, ModalsModule, DropdownMenusModule } from 'src/app/_metronic/partials';
import { TranslationModule } from 'src/app/i18n';
import { UploadFileModule } from '../../../upload-file/upload-file.module';
import { BreadcrumbModule } from '../../breadcrumb/breadcrumb.module';
import { PackageCardComponent } from './package-card/package-card.component';
@NgModule({
  declarations: [PackageCardComponent],
  imports: [
    CommonModule,
    FormsModule,
    BreadcrumbModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    TranslationModule,
    NgxIntlTelephoneInputModule,
    UploadFileModule,
    NgSelectModule,
    NgbDatepickerModule,
    NgbPaginationModule,
    NgbModule,
    NgbDropdownModule,
  ],exports:[
    PackageCardComponent
  ]
})
export class PackageCardModule { }
