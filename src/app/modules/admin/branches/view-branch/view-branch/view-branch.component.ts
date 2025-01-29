import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';
import { BranchesService } from 'src/app/services/api/branches.service';

@Component({
  selector: 'app-view-branch',
  templateUrl: './view-branch.component.html',
  styleUrls: ['./view-branch.component.scss']
})
export class ViewBranchComponent implements OnInit {
  branchDetails: any = {};
  
  id:any
  lang: string | null = localStorage.getItem('language');

  constructor(
    public branchService: BranchesService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router:Router,
    private breadcrumbService:BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.breadcrumbService.restoreBreadcrumbsFromStorage();
    const id = this.route.snapshot.paramMap.get('id');
    this.id = id
    if (id) {
      this.getBranchById(id);
    } 
  }
  getBranchById(id:any) {
    this.branchService.getBranchDetail(id).subscribe({
      next: (next) => {
        this.branchDetails = next.data;
        this.cdr.detectChanges();

      },
    });
  }
  Back(){
    this.router.navigate(['/agent/departments/branches'])
  }
  submit(){
    this.router.navigate(['/agent/departments/branches/add-edit-branch',this.id])
  }
}
