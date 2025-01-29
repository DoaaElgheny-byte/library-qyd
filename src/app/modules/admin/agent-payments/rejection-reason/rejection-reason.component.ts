import { Component, Input, OnInit, inject } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-rejection-reason',
  templateUrl: './rejection-reason.component.html',
  styleUrls: ['./rejection-reason.component.scss']
})
export class RejectionReasonComponent implements OnInit {
  activeModal = inject(NgbActiveModal);

  @Input() data: any;
  constructor(private modalService: NgbModal,) { }

  ngOnInit(): void {
  }
  closeModal() {
    this.modalService.dismissAll('Cross click');
  }
}
