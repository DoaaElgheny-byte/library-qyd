import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewClientComponent } from './view-client/view-client.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDatepickerModule, NgbPaginationModule, NgbModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxIntlTelephoneInputModule } from 'ngx-intl-telephone-input';
import { WidgetsModule, ModalsModule, DropdownMenusModule } from 'src/app/_metronic/partials';
import { TranslationModule } from 'src/app/i18n';
import { UploadFileModule } from 'src/app/modules/SharedComponent/upload-file/upload-file.module';
import { BreadcrumbModule } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.module';
import { NgxHijriGregorianDatepickerModule } from 'ngx-hijri-gregorian-datepicker';



@NgModule({
  declarations: [
    ViewClientComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      
      {
        path:'',
        component:ViewClientComponent,
        data: { breadcrumb: 'viewclient' }

      }
    ]),
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
    BreadcrumbModule,
    NgxHijriGregorianDatepickerModule
  ],
  exports: [NgbDropdownModule, DropdownMenusModule],

})
export class ViewClientModule { }
