import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModalsModule } from 'src/app/_metronic/partials';
import { TranslationModule } from 'src/app/i18n';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
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
          import('./customer-management/customer-management.module').then(
            (m) => m.CustomerManagementModule
          ),
      },
      {
        path: 'add-edit-customer',
        loadChildren: () =>
          import('./add-edit-customer/add-edit-customer.module').then(
            (m) => m.AddEditCustomerModule
          ),
        data: { breadcrumb: 'addCustomerManagement' },

      },
      {
        path: 'view-customer/:id',
        loadChildren: () =>
          import('./customer-details/customer-details.module').then(
            (m) => m.CustomerDetailsModule
          ),
      },
    ]),
  ]
})
export class CustomerModule { }
