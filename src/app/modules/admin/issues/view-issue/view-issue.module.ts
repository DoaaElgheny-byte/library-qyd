import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewIssueComponent } from './view-issue/view-issue.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDatepickerModule, NgbDropdownModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxIntlTelephoneInputModule } from 'ngx-intl-telephone-input';
import { TranslationModule } from 'src/app/i18n';
import { AddIssueComponent } from '../add-issue/add-issue/add-issue.component';
import { IssueDetailsComponent } from './view-issue/issue-details/issue-details.component';
import { IssueLogComponent } from './view-issue/issue-log/issue-log.component';
import { WidgetsModule, ModalsModule, DropdownMenusModule } from 'src/app/_metronic/partials';
import { UploadFileModule } from 'src/app/modules/SharedComponent/upload-file/upload-file.module';
import { IssueSessionComponent } from './view-issue/issue-session/issue-session.component';
import { IssueWorkdutyComponent } from './view-issue/issue-workduty/issue-workduty.component';
import { BreadcrumbModule } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.module';
import { DateDifferencePipeIssue } from 'src/app/modules/SharedComponent/SharedComponent/time_format_pipe_issue';
import { NgxHijriGregorianDatepickerModule } from 'ngx-hijri-gregorian-datepicker';

@NgModule({
  declarations: [DateDifferencePipeIssue,ViewIssueComponent, IssueDetailsComponent, IssueLogComponent, IssueSessionComponent, IssueWorkdutyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      
      {
        path:'history-details/:historyid',
        component:IssueDetailsComponent,
        data: { breadcrumb: 'logcase' }
      },
      {
        path: ':id/:tab',
        component: ViewIssueComponent,
        data: { breadcrumb: 'viewcase' }

      },
    ]),
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
    NgxHijriGregorianDatepickerModule,
    NgbDropdownModule,
    BreadcrumbModule
  ],
  exports: [NgbDropdownModule, DropdownMenusModule,IssueDetailsComponent],
})
export class ViewIssueModule {}
