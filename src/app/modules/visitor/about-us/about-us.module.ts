import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutUsComponent } from './about-us/about-us.component';
import { RouterModule } from '@angular/router';
import { TranslationModule } from 'src/app/i18n';
import { BreadcrumbModule } from '../../SharedComponent/SharedComponent/breadcrumb/breadcrumb.module';



@NgModule({
  declarations: [
    AboutUsComponent
  ],
  imports: [
    CommonModule,
    TranslationModule,
    BreadcrumbModule,
    RouterModule.forChild([
      {
        path: '',
        component: AboutUsComponent,
        data: { breadcrumb: 'about' }
      },
    ]),
  ]
})
export class AboutUsModule { }
