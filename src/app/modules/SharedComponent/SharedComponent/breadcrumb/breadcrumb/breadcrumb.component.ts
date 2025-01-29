import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreadcrumbService } from '../breadcrumb.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit,OnDestroy {

  breadcrumbs$ = this.breadcrumbService.breadcrumbs$;
  lang = localStorage.getItem('language')
  constructor(private breadcrumbService: BreadcrumbService,private router:Router) {
    

  }

  ngOnInit(): void {}
  navigateTo(url: string): void {
    this.router.navigateByUrl(url);
  }
  ngOnDestroy(): void {
    localStorage.setItem('breadcrumbs','')
  }
}
