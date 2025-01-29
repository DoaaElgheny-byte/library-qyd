import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../auth/services/auth.guard';

const routes: Routes = [
  {
    path: 'add-issue',
    loadChildren: () =>
      import('./add-issue/add-issue.module').then(
        (m) => m.AddIssueModule
      ),
  },
  {
    path: 'view-issue',
    
    loadChildren: () =>
      import('./view-issue/view-issue.module').then(
        (m) => m.ViewIssueModule
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
    path: '',
    canActivateChild: [AuthGuard],
    loadChildren: () =>
      import('./issue-management/issue-management.module').then(
        (m) => m.IssueManagementModule
      ),
  }, 
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CasesRoutingModule { }
