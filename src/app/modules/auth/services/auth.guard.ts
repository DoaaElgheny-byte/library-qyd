import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const authToken = localStorage.getItem('authLocalStorageTokenquid');
    if (authToken) {
      if (localStorage.getItem('access_token_quid')) {
        let isComplete = localStorage.getItem('isComplete');
        if (isComplete === 'true') {
          if (route.data['roles']) {
            return this.checkPermission(state.url, route.data['roles']);
          } else {
            return true;
          }
        } else {
          this.router.navigate(['/auth/register/complete-info']);
          return true;
        }

        // check Package
      } else {
        this.authService.logout();
        return false;
      }
    } else {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }

  checkPermission(route: any, data: any): boolean {
    let user = this.authService.getCurrentUser();

    if (data.includes(user.roles[0])) {
      return true;
    } else {
      this.router.navigate(['/agent/error-package'], {
        queryParams: { key: 'isValid' },
      });
      return true;
    }
  }

  canLoad(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('access_token_quid')) {
      this.goToFirsRoute();
    }
  }
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //
    let nextRoute = state.url.substring(1);
    let packageCondition = window.localStorage.getItem(
      'condtions-to-current-user'
    );
    let packageData: any = JSON.parse(packageCondition!);
    let getConditions = packageData.getConditions;

    let routeEsist = getConditions.find((i: any) => i.url === nextRoute);
    if (routeEsist) {
      return true;
    } else {
      this.router.navigate(['/agent/error-package'], {
        queryParams: { key: 'inValid' },
      });
      return false;
    }
  }
  goToFirsRoute() {
    const route = location.href;
  }
  adminRoles: [
    '/admin/user-managment',
    '/admin/departments/package-managment',
    '/admin/admin-payment'
  ];
  agentRoles: ['/admin/user-managment'];
  employeeRole: [''];
}
