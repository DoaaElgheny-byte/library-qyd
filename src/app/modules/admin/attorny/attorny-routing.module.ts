import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../auth/services/auth.guard';

const routes: Routes = [
  
  {
    path: 'add-edit-attorny',
    loadChildren: () =>
      import('./add-attorny/add-attorny.module').then(
        (m) => m.AddAttornyModule
      )
  },
  {
    path: 'assigned-attorny/:id',
    loadChildren: () =>
      import('./assigned-attorny/assigned-attorny.module').then(
        (m) => m.AssignedAttornyModule
      )
  },
  {
    path: 'review-attorny/:id',
    loadChildren: () =>
      import('./attorny-review/attorny-review.module').then(
        (m) => m.AttornyReviewModule
      )
  },
  {
    path: '',
    canActivateChild: [AuthGuard],
    loadChildren: () =>
      import('./attorny-managment/attorny-managment.module').then(
        (m) => m.AttornyManagmentModule)
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
export class AttornyRoutingModule { }
