import { Component, Input, OnInit, inject } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BranchesService } from 'src/app/services/api/branches.service';
import { EmployeeManagementService } from 'src/app/services/api/employee-management.service';

@Component({
  selector: 'app-view-more-branches',
  templateUrl: './view-more-branches.component.html',
  styleUrls: ['./view-more-branches.component.scss']
})
export class ViewMoreBranchesComponent implements OnInit {
  activeModal = inject(NgbActiveModal);

  @Input() data:any;
  Branches:any
  constructor(private modalService: NgbModal,private employeeService:EmployeeManagementService
    ) { }

  ngOnInit(): void {
    this.employeeService.getMoreBranches(this.data).subscribe({
      next:next=>{
        this.Branches=next.data
      }
    })
  }
  closeModal() {
    this.modalService.dismissAll('Cross click');
  }
}
