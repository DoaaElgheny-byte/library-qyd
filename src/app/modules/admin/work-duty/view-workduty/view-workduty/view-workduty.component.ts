import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-view-workduty',
  templateUrl: './view-workduty.component.html',
  styleUrls: ['./view-workduty.component.scss']
})
export class ViewWorkdutyComponent implements OnInit {

  constructor(private route: ActivatedRoute, private breadcrumbService: BreadcrumbService
  ) { }
  id: any
  ngOnInit(): void {
    this.breadcrumbService.restoreBreadcrumbsFromStorage();
    this.id = this.route.snapshot.paramMap.get('id');
  }

}
