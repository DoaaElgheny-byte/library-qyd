import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CasesRoutingModule } from './cases-routing.module';
import { TeamViewComponent } from './issue-management/team-view/team-view.component';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbModule } from '../../SharedComponent/SharedComponent/breadcrumb/breadcrumb.module';



@NgModule({
  declarations: [ 
  ],
  imports: [
    CommonModule,
    CasesRoutingModule,
    TranslateModule,
    BreadcrumbModule
  ]
})
export class CasesModule { }
