import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../auth/services/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [AuthGuard],
    loadChildren: () =>
      import('./work-duty-management/work-duty.module').then(
        (m) => m.WorkDutyModule
      ),
  },
  {
    path: 'add-edit-workduty',
    loadChildren: () =>
      import('./add-workduty/add-workduty.module').then(
        (m) => m.AddWorkdutyModule
      ),
  },
  {
    path: 'view-workDuty/:id',
    loadChildren: () =>
      import('./view-workduty/view-workduty.module').then(
        (m) => m.ViewWorkdutyModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkDutyRoutingModule { }
