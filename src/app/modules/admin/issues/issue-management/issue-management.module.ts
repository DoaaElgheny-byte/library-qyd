import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssueManagementComponent } from './issue-management/issue-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDatepickerModule, NgbDropdownModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxIntlTelephoneInputModule } from 'ngx-intl-telephone-input';
import { TranslationModule } from 'src/app/i18n';
import { TeamViewComponent } from './team-view/team-view.component';
import { DropdownMenusModule, ModalsModule, WidgetsModule } from 'src/app/_metronic/partials';
import { UploadFileModule } from 'src/app/modules/SharedComponent/upload-file/upload-file.module';
import { BreadcrumbModule } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.module';



@NgModule({
  declarations: [
    IssueManagementComponent,
    TeamViewComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: IssueManagementComponent,

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
    NgbPaginationModule,
    WidgetsModule,
    ModalsModule,
    DropdownMenusModule,
    NgbModule,
    NgbDropdownModule,
    BreadcrumbModule
  ],
  exports: [NgbDropdownModule, DropdownMenusModule],

})
export class IssueManagementModule { }
