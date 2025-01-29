import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-view-contract',
  templateUrl: './view-contract.component.html',
  styleUrls: ['./view-contract.component.scss']
})
export class ViewContractComponent implements OnInit {

  constructor(private route:ActivatedRoute,    private breadcrumbService: BreadcrumbService,
    ) { }
  id:any
  ngOnInit(): void {
     this.id = this.route.snapshot.paramMap.get('id');
     this.breadcrumbService.restoreBreadcrumbsFromStorage();

  }

}
