import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslationModule } from 'src/app/i18n';
import { BreadcrumbModule } from '../../SharedComponent/SharedComponent/breadcrumb/breadcrumb.module';
import { TermsAndConditionsComponent } from '../terms/terms-and-conditions/terms-and-conditions.component';
import { CancellationPolicyComponent } from '../cancellation/cancellation-policy/cancellation-policy.component';
import { SLPComponent } from './slp/slp.component';

@NgModule({
  declarations: [
    PrivacyPolicyComponent,
    TermsAndConditionsComponent,
    CancellationPolicyComponent,
    SLPComponent,
  ],
  imports: [
    CommonModule,
    TranslationModule,
    BreadcrumbModule,
    RouterModule.forChild([
      {
        path: '',
        component: PrivacyPolicyComponent,
        data: { breadcrumb: 'privacy' },
        pathMatch: 'full'

      },
      {
        path: 'slp',
        component: SLPComponent,
        data: { breadcrumb: 'SLP' },
        pathMatch: 'full'

      },
    ]),
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class PrivacyPolicyModule { }
