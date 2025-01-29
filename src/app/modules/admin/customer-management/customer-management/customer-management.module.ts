import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  DropdownMenusModule,
  ModalsModule,
  WidgetsModule,
} from 'src/app/_metronic/partials';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbDropdownModule,
  NgbModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslationModule } from 'src/app/i18n';
import { CustomerManagementComponent } from './customer-management.component';
import { BreadcrumbModule } from '../../../SharedComponent/SharedComponent/breadcrumb/breadcrumb.module';

@NgModule({
  declarations: [CustomerManagementComponent],
  imports: [
    CommonModule,
    InlineSVGModule,
    RouterModule.forChild([
      {
        path: '',
        component: CustomerManagementComponent,
      },
    ]),
    WidgetsModule,
    ModalsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    DropdownMenusModule,
    NgbModule,
    NgbDropdownModule,
    TranslationModule,
    BreadcrumbModule
  ],
  exports: [NgbDropdownModule, DropdownMenusModule],
})
export class CustomerManagementModule { }
