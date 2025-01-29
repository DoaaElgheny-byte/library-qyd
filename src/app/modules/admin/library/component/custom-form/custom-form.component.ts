import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-custom-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './custom-form.component.html',
  styleUrls: ['./custom-form.component.scss'],
})
export class CustomFormComponent {
  @Input() form!: FormGroup; //form group
  @Input() title: string = 'Modal Title'; //modal title
  @Input() modalId: string = 'defaultModal'; //modal id
  @Input() btnTitle: string = 'Submit'; //button title
  @Input() hideSubmit: boolean = false;
  @Output() formSubmit = new EventEmitter<any>(); //form submit event

  openModal(): void {
    const modalElement = document.getElementById(this.modalId);
    if (modalElement) {
      const modal = new Modal(modalElement as HTMLElement);
      modal.show();
    } else {
      console.error('Modal not found:', this.modalId);
    }
  }
  

  submitForm(): void {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
