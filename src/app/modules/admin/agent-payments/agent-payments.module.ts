import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AgentPaymentsComponent } from './agent-payments/agent-payments.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDatepickerModule, NgbPaginationModule, NgbModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxIntlTelephoneInputModule } from 'ngx-intl-telephone-input';
import { WidgetsModule, ModalsModule, DropdownMenusModule } from 'src/app/_metronic/partials';
import { TranslationModule } from 'src/app/i18n';
import { BreadcrumbModule } from '../../SharedComponent/SharedComponent/breadcrumb/breadcrumb.module';
import { UploadFileModule } from '../../SharedComponent/upload-file/upload-file.module';
import { RejectionReasonComponent } from './rejection-reason/rejection-reason.component';
import { InvoicePaymentComponent } from './invoice-payment/invoice-payment.component';
import { ViewInvoiceComponent } from './view-invoice/view-invoice.component';
import { DateDifferencePipe } from '../../SharedComponent/SharedComponent/time_format_pipe';



@NgModule({
  declarations: [
    AgentPaymentsComponent,
    RejectionReasonComponent,
    InvoicePaymentComponent,
    ViewInvoiceComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: AgentPaymentsComponent,
      },
    ]),
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
    WidgetsModule,
    ModalsModule,
    DropdownMenusModule,
    NgbModule,
    NgbDropdownModule,
    DateDifferencePipe
  ],
  providers: [DatePipe],
})
export class AgentPaymentsModule { }
