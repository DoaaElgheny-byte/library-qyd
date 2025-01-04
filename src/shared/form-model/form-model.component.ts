import { Component, EventEmitter, Input,Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-model',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-model.component.html',
  styleUrls: ['./form-model.component.scss']
})
export class FormModelComponent  {

  @Input() form!: FormGroup; // from
  @Input() title = 'Form Model'; //  title
  @Output() formSubmit = new EventEmitter<any>();

  openModal(): void {
    if (this.form) {
      const modalElement = document.getElementById('exampleModal');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement as HTMLElement);
        modal.show();
      }
    } else {
      console.error('Form is undefined in open');
    }
  }
  saveModal(): void {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }



}
