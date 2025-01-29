import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AddContractComponent } from './add-contract/add-contract.component';
import { ContractInfoComponent } from './contract-info/contract-info.component';
import { ReviewComponent } from './review/review.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TranslationModule } from 'src/app/i18n';
import { NgxIntlTelephoneInputModule } from 'ngx-intl-telephone-input';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { UploadFileModule } from 'src/app/modules/SharedComponent/upload-file/upload-file.module';
import { BreadcrumbModule } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.module';
import { NgxHijriGregorianDatepickerModule } from 'ngx-hijri-gregorian-datepicker';

@NgModule({
  declarations: [
    AddContractComponent,
    ContractInfoComponent,
    ReviewComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: ':id',
        component: AddContractComponent,
        data: { breadcrumb: 'editcontract' }
      },
      {
        path: '',
        component: AddContractComponent,
        data: { breadcrumb: 'addcontract' }
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
  exports:[NgxHijriGregorianDatepickerModule],
  providers: [DatePipe],
})
export class AddContractModule {}
