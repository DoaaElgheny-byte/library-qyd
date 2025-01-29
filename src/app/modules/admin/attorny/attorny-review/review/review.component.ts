import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  constructor(private route:ActivatedRoute,    private breadcrumbService: BreadcrumbService,
  ) { }
  id:any
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.breadcrumbService.restoreBreadcrumbsFromStorage();

  }
}
