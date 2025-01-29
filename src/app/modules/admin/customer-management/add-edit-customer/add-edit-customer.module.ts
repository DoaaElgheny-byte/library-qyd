import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AddEditCustomerComponent } from './add-edit-customer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbPaginationModule, NgbModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { WidgetsModule, ModalsModule, DropdownMenusModule } from 'src/app/_metronic/partials';
import { TranslationModule } from 'src/app/i18n';
import { BreadcrumbModule } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.module';
import { NgxIntlTelephoneInputModule } from 'ngx-intl-telephone-input';
import { UploadFileModule } from 'src/app/modules/SharedComponent/upload-file/upload-file.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxHijriGregorianDatepickerModule } from 'ngx-hijri-gregorian-datepicker';



@NgModule({
  declarations: [AddEditCustomerComponent],
  imports: [
    CommonModule,
    InlineSVGModule,
    RouterModule.forChild([
      {
        path: '',
        component: AddEditCustomerComponent,

      },
      {
        path: ':id',
        component: AddEditCustomerComponent,

      },
    ]),
    WidgetsModule,
    ModalsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    DropdownMenusModule,
    NgbModule,
    NgbDropdownModule,
    TranslationModule,
    BreadcrumbModule,
    NgxIntlTelephoneInputModule,
    UploadFileModule,
    NgSelectModule,

    NgxHijriGregorianDatepickerModule
  ],
  providers: [DatePipe],

  exports: [NgbDropdownModule, DropdownMenusModule, NgxHijriGregorianDatepickerModule],
})
export class AddEditCustomerModule { }
