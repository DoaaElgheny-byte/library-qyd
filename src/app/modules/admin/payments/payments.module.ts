import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaymentConfirmationComponent } from './payment-confirmation/payment-confirmation.component';
import { BreadcrumbModule } from '../../SharedComponent/SharedComponent/breadcrumb/breadcrumb.module';
import { TranslationModule } from 'src/app/i18n';



@NgModule({
  declarations: [
    PaymentConfirmationComponent
  ],
  imports: [
    CommonModule,
    BreadcrumbModule,
    TranslationModule,
    RouterModule.forChild([
      {
        path: '',
        component: PaymentConfirmationComponent,
        data: { breadcrumb: 'Confirm' }
      },
    ]),

  ]
})
export class PaymentsModule { }
