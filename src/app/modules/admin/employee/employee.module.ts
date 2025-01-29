import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ViewMoreBranchesComponent } from './view-more-branches/view-more-branches.component';
import { ModalsModule } from 'src/app/_metronic/partials';
import { TranslationModule } from 'src/app/i18n';
import { ViewCreateTeamComponent } from './view-create-team/view-create-team.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ViewMoreBranchesComponent,
    ViewCreateTeamComponent
  ],
  imports: [
    CommonModule,
    ModalsModule,
    ReactiveFormsModule,
    TranslationModule,
    NgMultiSelectDropDownModule.forRoot(), // Import ng-multiselect-dropdown module

    RouterModule.forChild([
      {
        path: '',
        loadChildren: () =>
          import('./employee-management/employee-managment.module').then(
            (m) => m.EmployeeManagmentModule
          ),
      },
      {
        path: 'add-edit-employee',
        loadChildren: () =>
          import('./add-edit-employee/add-edit-employee.module').then(
            (m) => m.AddEditEmployeeModule
          ),
      },
      {
        path: 'view-employee/:id',
        loadChildren: () =>
          import('./employee-details/employee-details.module').then(
            (m) => m.EmployeeDetailsModule
          ),
      },
    ]),
  ]
})
export class EmployeeModule { }
