import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        loadChildren: () =>
          import('./branches/branches-manger.module').then(
            (m) => m.BranchesMangerModule
          ),
      },
      {
        path: 'add-edit-branch',
        loadChildren: () =>
          import('./branch-add-edit/branch-add-edit.module').then(
            (m) => m.BranchAddEditModule
          ),
      },
      {
        path: 'view-branch/:id',
        loadChildren: () =>
          import('./view-branch/view-branch.module').then(
            (m) => m.ViewBranchModule
          ),
      },
    ]),

  ],
})
export class BranchesModule { }
