import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ViewSummaryComponent } from './view-summary/view-summary.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxHijriGregorianDatepickerModule } from 'ngx-hijri-gregorian-datepicker';
import { ModalsModule } from 'src/app/_metronic/partials';
import { TranslationModule } from 'src/app/i18n';
import { BreadcrumbModule } from '../../SharedComponent/SharedComponent/breadcrumb/breadcrumb.module';
import { UploadFileModule } from '../../SharedComponent/upload-file/upload-file.module';
import { AccountStatementComponent } from './account-statement/account-statement.component';
import { PaymentTableComponent } from './payment-table/payment-table.component';
import { TrialBalanceComponent } from './trial-balance/trial-balance.component';



@NgModule({
  declarations: [
    ViewSummaryComponent,
    AccountStatementComponent,
    PaymentTableComponent,
    TrialBalanceComponent
  ],
  imports: [
    CommonModule,
    BreadcrumbModule,
    TranslationModule,
    NgSelectModule,
    ReactiveFormsModule,
    ModalsModule,
    FormsModule,
    NgbDropdownModule,
    NgbPaginationModule,
    UploadFileModule,
    NgbDatepickerModule,
    NgxHijriGregorianDatepickerModule,
    RouterModule.forChild([
      {
        path: '',
        component: ViewSummaryComponent,
      },
    ]),
  ],
  providers: [DatePipe],

})
export class AccountingSummaryModule { }
