import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-edit-teams',
  templateUrl: './edit-teams.component.html',
  styleUrls: ['./edit-teams.component.scss'],
})
export class EditTeamsComponent implements OnInit  {
  constructor(private breadcrumbService:BreadcrumbService){

  }
  ngOnInit(): void {
    this.breadcrumbService.restoreBreadcrumbsFromStorage();
    
  }
}