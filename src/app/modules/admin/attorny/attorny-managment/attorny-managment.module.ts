import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AttorntManagmentComponent } from './attornt-managment/attornt-managment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDatepickerModule, NgbPaginationModule, NgbModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxIntlTelephoneInputModule } from 'ngx-intl-telephone-input';
import { WidgetsModule, ModalsModule, DropdownMenusModule } from 'src/app/_metronic/partials';
import { TranslationModule } from 'src/app/i18n';
import { BreadcrumbModule } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.module';
import { UploadFileModule } from 'src/app/modules/SharedComponent/upload-file/upload-file.module';
import { ContractManagementComponent } from '../../contracts/contracts-maagement/contract-management/contract-management.component';



@NgModule({
  declarations: [
    AttorntManagmentComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: AttorntManagmentComponent,
       
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

  ],
  providers: [DatePipe],

})
export class AttornyManagmentModule { }
