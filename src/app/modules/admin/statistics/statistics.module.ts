import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { StatisticsComponent } from './statistics/statistics.component';
import { RouterModule } from '@angular/router';
import { TranslationModule } from 'src/app/i18n';
import { WidgetsModule } from 'src/app/_metronic/partials';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    StatisticsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: StatisticsComponent,
       
      },
    ]),
    TranslationModule,
    WidgetsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
  ],
  providers: [DatePipe],
})
export class StatisticsModule { }
