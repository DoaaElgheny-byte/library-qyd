import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesComponent } from './services/services.component';
import { RouterModule } from '@angular/router';
import { TranslationModule } from 'src/app/i18n';
import { BreadcrumbModule } from '../../SharedComponent/SharedComponent/breadcrumb/breadcrumb.module';



@NgModule({
  declarations: [
    ServicesComponent
  ],
  imports: [
    CommonModule,
    TranslationModule,
    BreadcrumbModule,
    RouterModule.forChild([
      {
        path: '',
        component: ServicesComponent,
        data: { breadcrumb: 'services' },
        pathMatch: 'full'
      },
    ]),
  ]
})
export class ServicesModule { }
