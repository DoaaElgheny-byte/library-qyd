import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerDetailsComponent } from './customer-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbPaginationModule, NgbModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { WidgetsModule, ModalsModule, DropdownMenusModule } from 'src/app/_metronic/partials';
import { TranslationModule } from 'src/app/i18n';
import { BreadcrumbModule } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.module';
import { NgxHijriGregorianDatepickerModule } from 'ngx-hijri-gregorian-datepicker';



@NgModule({
  declarations: [CustomerDetailsComponent],
  imports: [
    CommonModule,
    InlineSVGModule,
    RouterModule.forChild([

      {
        path: '',
        component: CustomerDetailsComponent,
        data: { breadcrumb: 'viewemployee' }

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
    BreadcrumbModule,
    NgxHijriGregorianDatepickerModule
  ],
  exports: [NgbDropdownModule, DropdownMenusModule],
})
export class CustomerDetailsModule { }
