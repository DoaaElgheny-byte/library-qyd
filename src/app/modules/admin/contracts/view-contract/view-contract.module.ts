import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewContractComponent } from './view-contract/view-contract.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxIntlTelephoneInputModule } from 'ngx-intl-telephone-input';
import { TranslationModule } from 'src/app/i18n';
import { ContractDetailsComponent } from './contract-details/contract-details.component';
import { UploadFileModule } from 'src/app/modules/SharedComponent/upload-file/upload-file.module';
import { BreadcrumbModule } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.module';
import { NgxHijriGregorianDatepickerModule } from 'ngx-hijri-gregorian-datepicker';



@NgModule({
  declarations: [
    ViewContractComponent,ContractDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ViewContractComponent,
        data: { breadcrumb: 'viewcontract' }
      },
      
    ]),
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    TranslationModule,
    NgxIntlTelephoneInputModule,
    UploadFileModule,
    NgSelectModule,
    NgbDatepickerModule,
    BreadcrumbModule,
    NgxHijriGregorianDatepickerModule
  ],
  exports: [ContractDetailsComponent],
  
})
export class ViewContractModule { }
