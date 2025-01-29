import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BranchAddEditComponent } from './branch-add-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxIntlTelephoneInputModule } from 'ngx-intl-telephone-input';
import { TranslationModule } from 'src/app/i18n';
import { BreadcrumbModule } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.module';
import { UploadFileModule } from 'src/app/modules/SharedComponent/upload-file/upload-file.module';



@NgModule({
  declarations: [BranchAddEditComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component:BranchAddEditComponent,
        data: { breadcrumb: 'addbranch' }

      },
      {
        path: ':id',
        component: BranchAddEditComponent,
        data: { breadcrumb: 'editbranch' }

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
    BreadcrumbModule
  ],
  providers: [DatePipe],
  
})
export class BranchAddEditModule { }
