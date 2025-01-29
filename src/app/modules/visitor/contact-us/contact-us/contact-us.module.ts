import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactUsComponent } from './contact-us.component';
import { TranslationModule } from 'src/app/i18n';
import { BreadcrumbModule } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxCaptchaModule } from 'ngx-captcha';
@NgModule({
  declarations: [ContactUsComponent],
  imports: [
    CommonModule,
    TranslationModule,
    BreadcrumbModule,
    NgxCaptchaModule,
    RouterModule.forChild([
      {
        path: '',
        component: ContactUsComponent,
        data: { breadcrumb: 'contact' },
      },
    ]),
    FormsModule,
    ReactiveFormsModule,
  ],
  // providers: [
  //   {
  //     provide: RECAPTCHA_V3_SITE_KEY,
  //     useValue: '6LcVXH4pAAAAAH8eyL7Ah1NnXmxvPqS9mT1UxB3K',
  //   },
  // ],
})
export class ContactUsModule {}
