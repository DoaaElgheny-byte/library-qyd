import { Component, inject, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeactivateModalComponent } from './deactivate-modal/deactivate-modal.component';

@Component({
  selector: 'app-deactivate-account',
  templateUrl: './deactivate-account.component.html',
  styleUrls: ['./deactivate-account.component.scss']
})
export class DeactivateAccountComponent implements OnInit {

  constructor() { }
  private modalService = inject(NgbModal)

  openModal() {
    this.modalService.open(DeactivateModalComponent, {
      centered: true
    })
  }
  ngOnInit(): void {
  }

}
