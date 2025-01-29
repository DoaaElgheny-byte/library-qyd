import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewComponent } from './review/review.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDatepickerModule, NgbPaginationModule, NgbModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxIntlTelephoneInputModule } from 'ngx-intl-telephone-input';
import { WidgetsModule, ModalsModule, DropdownMenusModule } from 'src/app/_metronic/partials';
import { TranslationModule } from 'src/app/i18n';
import { BreadcrumbModule } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.module';
import { UploadFileModule } from 'src/app/modules/SharedComponent/upload-file/upload-file.module';
import { AttornyDetailsComponent } from './attorny-details/attorny-details.component';
import { NgxHijriGregorianDatepickerModule } from 'ngx-hijri-gregorian-datepicker';



@NgModule({
  declarations: [
    ReviewComponent,
    AttornyDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      
      {
        path:'',
        component:ReviewComponent,
        data: { breadcrumb: 'viewattorny' }
      },
      
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
    NgxHijriGregorianDatepickerModule,
    NgbDropdownModule,
    BreadcrumbModule
  ]
})
export class AttornyReviewModule { }
