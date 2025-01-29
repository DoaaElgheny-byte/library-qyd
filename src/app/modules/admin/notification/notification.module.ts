import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDatepickerModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslationModule } from 'src/app/i18n';
import { BreadcrumbService } from '../../SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';
import { BreadcrumbModule } from '../../SharedComponent/SharedComponent/breadcrumb/breadcrumb.module';



@NgModule({
  declarations: [
    NotificationComponent
  ],
  imports: [
    CommonModule,
    TranslationModule,
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    BreadcrumbModule,
    RouterModule.forChild([
      {
        path: '',
        component: NotificationComponent,
      },
    ]),
  ],
  providers: [DatePipe],
})
export class NotificationModule { }
