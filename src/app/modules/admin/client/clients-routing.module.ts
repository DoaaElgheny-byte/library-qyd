import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./client-management/client-management.module').then(
        (m) => m.ClientManagementModule
      ),
  },
  {
    path: 'add-edit-client',
    loadChildren: () =>
      import('./add-edit-client/add-edit-client.module').then(
        (m) => m.AddEditClientModule
      ),
  },
  {
    path: 'view-client/:id',
    loadChildren: () =>
      import('./view-client/view-client.module').then(
        (m) => m.ViewClientModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
