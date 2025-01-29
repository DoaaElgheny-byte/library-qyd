import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ContractService } from 'src/app/services/api/contract.service';
import { ContractStatus } from 'src/app/services/enums/contractStatus.enum';

@Component({
  selector: 'app-contract-list-modal',
  templateUrl: './contract-list-modal.component.html',
  styleUrls: ['./contract-list-modal.component.scss']
})
export class ContractListModalComponent implements OnInit {

  @Input() contractId: any;
  contractDetails: any;

  constructor(public activeModal: NgbActiveModal, private _contractManagementService: ContractService,
    private spinner: NgxSpinnerService,
    private router: Router

  ) { }

  close() {
    this.activeModal.close();
  }

  ngOnInit(): void {
    if (this.contractId) {
      this.getContractById();
    }
  }

  contracts = [
    {
      title: 'عقد ملكية',
      status: 'active',
      branch: 'الرياض',
      creationDate: '2024-06-05',
      endDate: '2025-06-05',
      projectAssociated: 'Proj-00001',
      client: 'يدي',
      activation: true,
    },
    {
      title: 'عقد شراء اصول',
      status: 'inactive',
      branch: 'جدة',
      creationDate: '2024-06-05',
      endDate: '2029-06-05',
      projectAssociated: '',
      client: 'خالد',
      activation: false,
    },
  ];

  viewContract() {
    this.activeModal.close();

    this.router.navigate([`/agent/departments/contracts/view-contract/${this.contractId}`])
  }


  editContractData() {
    this.activeModal.close();
    this.router.navigate([`/agent/departments/contracts/add-edit-contract/${this.contractId}`])
  }

  viewAssignedMembers(contract: any) {
    console.log('Viewing assigned members for:', contract);
  }
  contractStatus = ContractStatus;


  getContractById() {
    this.spinner.show();
    this._contractManagementService
      .getContractDetails(this.contractId)
      .subscribe({
        next: (next) => {

          this.contractDetails = next.data;
          console.log(next.data)
          if (this.contractDetails.branchId) {
            // this.getClientList(this.contractDetails.branchId);
          }
          if (next.data.startDate) {
            let currentDate = next.data.startDate.substring(0, 10);
          }

          if (next.data.endDate) {
            let endOfDate = next.data.endDate.substring(0, 10);

          }


          this.spinner.hide();
        },
      });
  }
}
