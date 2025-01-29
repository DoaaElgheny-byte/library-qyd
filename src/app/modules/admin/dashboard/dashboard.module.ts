import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { TranslationModule } from 'src/app/i18n';
import { WidgetsModule } from 'src/app/_metronic/partials';



@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
       
      },
    ]),
    TranslationModule,
    WidgetsModule,
 

  ]
})
export class DashboardModule { }
