import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorPackageComponent } from './error-package.component';
import { RouterModule } from '@angular/router';
import { TranslationModule } from 'src/app/i18n';
import { BreadcrumbComponent } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb/breadcrumb.component';
import { BreadcrumbModule } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.module';

@NgModule({
  declarations: [ErrorPackageComponent
  ],
  imports: [
    CommonModule,
    TranslationModule,
    BreadcrumbModule,
    RouterModule.forChild([
      {
        path: '',
        component: ErrorPackageComponent,
        data: { breadcrumb: 'ErrorPackageComponent' }

      },
      
    ]),
  ]
})
export class ErrorPackageModule { }
