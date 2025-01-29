import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/services/auth.guard';
import { LibraryLayoutComponent } from './library/library-layout/library-layout.component';

const AdminRouting: Routes = [
  //user management
  {
    path: 'user-managment',
    canActivate: [AuthGuard],
    data: { roles: ['QYDSuperAdmin'] },
    loadChildren: () =>
      import('./user/users.module').then((m) => m.UsersModule),

  },

  {
    path: 'departments/project-management',
    canActivate: [AuthGuard],
    // data: { roles: ['QYDSuperAdmin'] },
    loadChildren: () =>
      import('./project-management/project-management.module').then((m) => m.ProjectManagementModule),
    data: { breadcrumb: 'projects' },
  },

  {
    path: 'library',
    canActivate: [AuthGuard],
    component: LibraryLayoutComponent,
    data: { breadcrumb: 'library' },
  },

  {
    path: 'departments/accounting-summary',
    canActivate: [AuthGuard],
    // data: { roles: ['QYDSuperAdmin'] },
    loadChildren: () =>
      import('./accounting-summary/accounting-summary.module').then((m) => m.AccountingSummaryModule),
    data: { breadcrumb: 'accountingSummary' },
  },

  {
    path: 'error-package',
    loadChildren: () =>
      import('./packages/error-package/error-package.module').then(
        (m) => m.ErrorPackageModule
      ),
    data: { breadcrumb: 'usermanagement' },
  },

  {
    path: 'departments/employee-managment',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./employee/employee.module').then((m) => m.EmployeeModule),
    data: {
      breadcrumb: 'employeemanagement',
      roles: ['QYDAgent', 'QYDManager']
    },
  },

  {
    path: 'departments/dashboard-managment',
    canActivate: [AuthGuard],
    data: { role: [''] },
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },

  {
    path: 'departments/statistics-managment',
    loadChildren: () =>
      import('./statistics/statistics.module').then((m) => m.StatisticsModule),
  },
  //branch
  {
    path: 'departments/branches',
    loadChildren: () =>
      import('./branches/branches.module').then((m) => m.BranchesModule),
    data: { breadcrumb: 'branchmanagement' },
  },

  {
    path: 'edit-profile',
    loadChildren: () =>
      import('./edit-profile/edit-teams.module').then((m) => m.EditTeamsModule),
  },

  /**contract */
  {
    path: 'departments/contracts',
    loadChildren: () =>
      import('./contracts/contracts.module').then((m) => m.ContractsModule),
    data: { breadcrumb: 'contractmanagement' },
  },

  /*** cases */
  {
    path: 'departments/cases',
    loadChildren: () =>
      import('./issues/cases.module').then((m) => m.CasesModule),
    data: { breadcrumb: 'casemanagement' },
  },

  /**client */
  {
    path: 'departments/clients',
    loadChildren: () =>
      import('./client/clients.module').then((m) => m.ClientsModule),
    data: { breadcrumb: 'clientmanagement' },
  },

  //work duty
  {
    path: 'departments/work-duty',

    loadChildren: () =>
      import('./work-duty/work-duty.module').then((m) => m.WorkDutyModule),
    data: { breadcrumb: 'workdutymanagement' },
  },

  //sitting
  {
    path: 'departments/court-sessions',
    loadChildren: () =>
      import('./sitting/sitting.module').then((m) => m.SittingModule),
    data: { breadcrumb: 'sittingmanagement' },
  },

  //attorny
  {
    path: 'departments/attorny',
    loadChildren: () =>
      import('./attorny/attorny.module').then((m) => m.AttornyModule),
    data: { breadcrumb: 'attornymanagement' },
  },

  //agent-payment
  {
    path: 'agent-payment',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./agent-payments/agent-payments.module').then(
        (m) => m.AgentPaymentsModule
      ),
    data: { breadcrumb: 'payment', roles: ['QYDAgent'] },
  },
  //admin-payment

  {
    path: 'payment-confirmation',
    loadChildren: () =>
      import('./payments/payments.module').then(
        (m) => m.PaymentsModule
      ),
    canActivate: [AuthGuard],
    // data: { breadcrumb: 'payments' },
  },
  //upgrade-package
  {
    path: 'upgrade-package',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./upgrade-package/upgrade-package.module').then(
        (m) => m.UpgradePackageModule
      ),
    data: { breadcrumb: 'upgradePackage', roles: ['QYDAgent'] },
  },
  {
    path: 'departments/customer-management',

    loadChildren: () =>
      import('./customer-management/customer-management.module').then((m) => m.CustomerModule),
    data: { breadcrumb: 'customerManagement' },

  },
  {
    path: 'notification',
    loadChildren: () =>
      import('./notification/notification.module').then(
        (m) => m.NotificationModule
      ),
    data: { breadcrumb: 'notification' },
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { AdminRouting };
