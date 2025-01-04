import { Component, EventEmitter, Input,Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-model',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './form-model.component.html',
  styleUrls: ['./form-model.component.scss']
})
export class FormModelComponent  {
  @Input() form!: FormGroup;
  @Input() title = 'Modal Title';
  @Input() modalId = 'defaultModal';

  @Output() formSubmit = new EventEmitter<any>();

  openModal(): void {
    const modalElement = document.getElementById(this.modalId);
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement as HTMLElement);
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
