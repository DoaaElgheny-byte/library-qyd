import { Component,  ViewChild } from '@angular/core';
import { FormModelComponent } from '../shared/form-model/form-model.component';
import {  FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'library-qyd';
  @ViewChild(FormModelComponent) FormModelComponent!: FormModelComponent;
  formData: any;
  form = this.fb.group({
      name: ['',Validators.required],
      email: ['']
  });
  constructor(private fb: FormBuilder) {

  }

  openSharedModal(): void {
      if (this.form) {
        this.FormModelComponent.openModal();
      } else {
        console.error('Form is not initialized');
      }

  }
  handleFormData(data: any): void {
    this.formData = data;
    console.log('Form data', this.formData);
  }
}
