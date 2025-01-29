import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './modules/auth/services/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => m.HomeModule),
    data: { breadcrumb: 'home' },
  },
  {
    path: 'auth',
    canLoad: [AuthGuard],
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },

  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./_metronic/layout/layout.module').then((m) => m.LayoutModule),
    data: { breadcrumb: 'admin' },
  },

  {
    path: 'agent',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./_metronic/layout/layout.module').then((m) => m.LayoutModule),
    data: { breadcrumb: 'agent' },
  },

  {
    path: 'visitor',
    loadChildren: () =>
      import('../app/modules/visitor/visitor/visitor.module').then(
        (m) => m.VisitorModule
      ),
    data: { breadcrumb: 'agent' },
  },

  {
    path: 'error',
    loadChildren: () =>
      import('./modules/SharedComponent/errors/errors.module').then(
        (m) => m.ErrorsModule
      ),
  },
  { path: '**', redirectTo: 'error/404' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled'
    }),

  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }




let [x, y, z]: [number, number, string] = [10, 0, 'ahmed']
