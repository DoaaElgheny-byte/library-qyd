
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private breadcrumbsSubject = new BehaviorSubject<{ label: string, url: string }[]>([]);
  breadcrumbs$ = this.breadcrumbsSubject.asObservable();

  private readonly STORAGE_KEY = 'breadcrumbs';

  constructor(private router: Router, 
    private translate: TranslateService,) {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.updateBreadcrumbs();
        }
      });
  
      this.translate.onLangChange.subscribe(() => {
        this.updateBreadcrumbs();
      });
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.updateBreadcrumbs();
        }
      });
  }
  
  private updateBreadcrumbs(): void {
    const root = this.router.routerState.snapshot.root;
    const breadcrumbs = this.createBreadcrumbs(root);
    this.saveBreadcrumbsToStorage(breadcrumbs);
   
    this.breadcrumbsSubject.next(breadcrumbs);
  }

  private createBreadcrumbs(route: ActivatedRouteSnapshot, url: string = '', breadcrumbs: { label: string, url: string }[] = []): { label: string, url: string }[] {
    const label = route.routeConfig?.data?.breadcrumb;
    const path = route.routeConfig ? route.routeConfig.path : '';

    const nextUrl = `${url}${path}/`;

    // Handle undefined or empty labels
  
    const breadcrumbLabel = label ? this.translate.instant(`breadcrumbs.${label}`) || label : '';
    const breadcrumb = breadcrumbLabel ? { label: breadcrumbLabel, url: nextUrl } : null;

    const newBreadcrumbs = breadcrumb ? [...breadcrumbs, breadcrumb] : [...breadcrumbs];

    if (route.firstChild) {
      return this.createBreadcrumbs(route.firstChild, nextUrl, newBreadcrumbs);
    }

    return newBreadcrumbs;
  }

  private saveBreadcrumbsToStorage(breadcrumbs: { label: string, url: string }[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(breadcrumbs));
  }

  restoreBreadcrumbsFromStorage(): void {
    const storedBreadcrumbs = localStorage.getItem(this.STORAGE_KEY);
    if (storedBreadcrumbs) {
      const parsedBreadcrumbs = JSON.parse(storedBreadcrumbs);
      this.breadcrumbsSubject.next(parsedBreadcrumbs);
    }else{
      this.updateBreadcrumbs();
    }
  }
}