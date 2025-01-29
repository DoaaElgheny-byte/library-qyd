import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewSittingComponent } from './view-sitting/view-sitting.component';
import { ViewHistoryComponent } from './view-history/view-history.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import {
  NgbDatepickerModule,
  NgbPaginationModule,
  NgbModule,
  NgbDropdownModule,
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
import { ViewDetailsComponent } from './view-details/view-details.component';
import { BreadcrumbModule } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.module';
import { DateDifferencePipe } from 'src/app/modules/SharedComponent/SharedComponent/time_format_pipe';
import { NgxHijriGregorianDatepickerModule } from 'ngx-hijri-gregorian-datepicker';

@NgModule({
  declarations: [
    ViewSittingComponent,
    ViewHistoryComponent,
    ViewDetailsComponent,
    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'history-details/:historyid',
        component: ViewDetailsComponent,
        data:{breadcrumb:'viewSittingHistory'}

      },
      {
        path: ':id/:tab',
        component: ViewSittingComponent,
        data:{breadcrumb:'viewSitting'}
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
    NgbDropdownModule,
    BreadcrumbModule,
    DateDifferencePipe,
    NgxHijriGregorianDatepickerModule
  ],
  exports: [NgbDropdownModule, DropdownMenusModule],
})
export class ViewSittingModule {}
