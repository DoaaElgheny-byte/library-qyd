import { Component,  ViewChild } from '@angular/core';
import { FormModelComponent } from '../shared/form-model/form-model.component';
import {  FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  form: FormGroup;
  form2: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email:[''],
    });

    this.form2 = this.fb.group({
      name2: ['', Validators.required],
      email:[''],
      phone:[null]
    });
  }

  openModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement as HTMLElement);
      modal.show();
    } else {
      console.error('Modal not found:', modalId);
    }
  }

  handleFormSubmit(data: any): void {
    console.log('Form Submitted:', data);
  }
}
