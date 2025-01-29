import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CancellationPolicyComponent } from './cancellation-policy/cancellation-policy.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: CancellationPolicyComponent,
        data: { breadcrumb: 'Cancel' }
      },
    ]),
  ]
})
export class CancellationModule { }
