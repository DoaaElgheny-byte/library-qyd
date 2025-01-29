import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../auth/services/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [AuthGuard],
    loadChildren: () =>
      import('./manage-sitting/manage-sitting.module').then(
        (m) => m.ManageSittingModule
      ),
  },
  {
    path: 'add-edit-court-sessions',

    loadChildren: () =>
      import('./add-edit-sitting/add-edit-sitting.module').then(
        (m) => m.AddEditSittingModule
      ),
  },
  {
    path: 'view-court-sessions',

    loadChildren: () =>
      import('./view-sitting/view-sitting.module').then(
        (m) => m.ViewSittingModule
      ),
  },
  {
    path: 'assigned-case/:id',
    loadChildren: () =>
      import('./assigned-issue/assigned-issue.module').then(
        (m) => m.AssignedIssueModule
      ),
  }, 
  {
    path: 'report/:id',
    loadChildren: () =>
      import('./report/report').then(
        (m) => m.ReportModule
      ),
  }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SittingRoutingModule { }
