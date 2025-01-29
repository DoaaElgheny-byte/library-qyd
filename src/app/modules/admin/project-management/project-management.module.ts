
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { RouterModule } from '@angular/router';
import { ProjectListsComponent } from './project-lists/project-lists.component';
import { TranslationModule } from 'src/app/i18n';
import { BreadcrumbModule } from '../../SharedComponent/SharedComponent/breadcrumb/breadcrumb.module';
import { StepsProgressComponent } from './add-edit-project/steps-progress/steps-progress.component';
import { ProjectDetailsStep1Component } from './add-edit-project/project-details-step1/project-details-step1.component';
import { ConvertToOpportunityStep2Component } from './add-edit-project/convert-to-opportunity-step2/convert-to-opportunity-step2.component';
import { PriceOfferStep3Component } from './add-edit-project/price-offer-step3/price-offer-step3.component';
import { ReviewDetailsStep4Component } from './add-edit-project/review-details-step4/review-details-step4.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalsModule } from 'src/app/_metronic/partials';
import { DateFormatterService, NgxHijriGregorianDatepickerModule } from 'ngx-hijri-gregorian-datepicker';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ProjectAttachmentComponent } from './add-edit-project/project-attachment/project-attachment.component';
import { UploadFileModule } from '../../SharedComponent/upload-file/upload-file.module';
import { ViewFinancialComponent } from './financial-department/view-financial/view-financial.component';
import { PriceQuoteComponent } from './financial-department/price-quote/price-quote.component';
import { PaymentNoticeComponent } from './financial-department/payment-notice/payment-notice.component';
import { BillsComponent } from './financial-department/bills/bills.component';
import { CreatePaymentNoticeModalComponent } from './financial-department/create-payment-notice-modal/create-payment-notice-modal.component';
import { TaskListModalComponent } from './modals/task-list-modal/task-list-modal.component';
import { ContractListModalComponent } from './modals/contract-list-modal/contract-list-modal.component';
import { CaseManagementModalComponent } from './modals/case-management-modal/case-management-modal.component';
import { PriceQuotePdfComponent } from './pdfs/price-quote-pdf/price-quote-pdf.component';
import { PaymentNoticePdfComponent } from './pdfs/payment-notice-pdf/payment-notice-pdf.component';
import { SimplifiedInvoicePdfComponent } from './pdfs/simplified-invoice-pdf/simplified-invoice-pdf.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { NgxIntlTelephoneInputModule } from 'ngx-intl-telephone-input';



@NgModule({
  declarations: [
    ProjectListsComponent,
    StepsProgressComponent,
    ProjectDetailsStep1Component,
    ConvertToOpportunityStep2Component,
    PriceOfferStep3Component,
    ReviewDetailsStep4Component,
    ProjectAttachmentComponent,
    ViewFinancialComponent,
    PriceQuoteComponent,
    PaymentNoticeComponent,
    BillsComponent,
    CreatePaymentNoticeModalComponent,
    TaskListModalComponent,
    ContractListModalComponent,
    CaseManagementModalComponent,
    PriceQuotePdfComponent,
    PaymentNoticePdfComponent,
    SimplifiedInvoicePdfComponent,
    ProjectDetailsComponent
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
    NgxIntlTelephoneInputModule,
    NgxHijriGregorianDatepickerModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProjectListsComponent,
      },
      {
        path: 'details/:id',
        component: ProjectDetailsComponent,
      },
      {
        path: 'add-edit-project/:id',
        component: StepsProgressComponent,
        data: { breadcrumb: 'addProject' },
      },
      {
        path: 'add-edit-project',
        component: StepsProgressComponent,
        data: { breadcrumb: 'addProject' },
      },
      {
        path: 'financial-department/:id',
        component: ViewFinancialComponent,
        data: { breadcrumb: 'financialDepartment' },
      }
    ]),
  ],
  providers: [DateFormatterService, DatePipe]
})
export class ProjectManagementModule { }
