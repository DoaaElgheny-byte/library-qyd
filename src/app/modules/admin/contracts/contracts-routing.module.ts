import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'view-contract/:id',
    loadChildren: () =>
      import('./view-contract/view-contract.module').then(
        (m) => m.ViewContractModule
      ), 
      
  },
  {
    path: 'add-edit-contract',
    loadChildren: () =>
      import('./add-contract/add-contract.module').then(
        (m) => m.AddContractModule
      )
  },
  {
    path: 'assigned-contract/:id',
    loadChildren: () =>
      import('./assigned-contract/assigned-contract.module').then(
        (m) => m.AssignedContractModule
      )
  },
  {
    path: '',
    loadChildren: () =>
      import('./contracts-maagement/contracts-maagement.module').then(
        (m) => m.ContractsMaagementModule)
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
export class ContractsRoutingModule { }
