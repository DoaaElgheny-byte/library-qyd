import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StepsService } from '../services/steps.service';

@Injectable({
  providedIn: 'root'
})
export class StepGuard implements CanActivate {
  constructor(private stepService: StepsService, private router: Router) { }

  canActivate(route: any): boolean {
    const url = route.routeConfig.path;
    console.log(url);

    if (url === 'otp' && !this.stepService.isStepCompleted(1)) {
      this.router.navigate(['/auth/register']);
      return false;
    }

    if (url === 'select-package' && !this.stepService.isStepCompleted(2)) {
      this.router.navigate(['/auth/register/otp']);
      return false;
    }

    return true;
  }

}
