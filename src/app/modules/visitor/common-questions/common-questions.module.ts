import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionsComponent } from './questions/questions.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslationModule } from 'src/app/i18n';
import { BreadcrumbModule } from '../../SharedComponent/SharedComponent/breadcrumb/breadcrumb.module';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    QuestionsComponent
  ],
  imports: [
    CommonModule,
    TranslationModule,
    BreadcrumbModule,
    RouterModule.forChild([
      {
        path: '',
        component: QuestionsComponent,
        data: { breadcrumb: 'question' }
      },
    ]),
    FormsModule,
    ReactiveFormsModule,
    NgbCollapseModule
  ]
})
export class CommonQuestionsModule { }
