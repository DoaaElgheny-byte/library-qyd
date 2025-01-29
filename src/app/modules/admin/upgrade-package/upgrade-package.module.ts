import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UpgradePackageComponent } from './upgrade-package/upgrade-package.component';
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
import { InvoicePaymentComponent } from './invoice-payment/invoice-payment.component';
import { InvoiceDetailsComponent } from './invoice-details/invoice-details.component';
import { PackageCardModule } from '../../SharedComponent/SharedComponent/package-card/package-card/package-card.module';



@NgModule({
  declarations: [
    UpgradePackageComponent,
    InvoicePaymentComponent,
    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: UpgradePackageComponent,
       
      },
      {
        path: 'invoice-details',
        loadChildren: () =>
          import('./invoice-details/invoice-details.module').then(
            (m) => m.InvoiceDetailsModule
          ),
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
    PackageCardModule
  ],
 
  providers: [DatePipe],
})
export class UpgradePackageModule { }
