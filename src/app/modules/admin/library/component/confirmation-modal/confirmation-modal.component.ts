import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent  {
 @Input() subTitle: string ='Sub title'; //Sub title
  @Input() title: string = 'Modal Title'; //modal title
  @Input() modalId: string = 'defaultModal'; //modal id
  @Input() btnTitle: string = 'Submit'; //button title
  @Input() hideSubmit: boolean = false;
  @Output() submitEvent = new EventEmitter<boolean>(); // submit event

  openModal(): void {
    const modalElement = document.getElementById(this.modalId);
    if (modalElement) {
      const modal = new Modal(modalElement as HTMLElement);
      modal.show();
    } else {
      console.error('Modal not found:', this.modalId);
    }
  }


  submit(): void {
      this.submitEvent.emit(true);

  }
}

