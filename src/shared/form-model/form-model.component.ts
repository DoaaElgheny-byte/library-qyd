import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-model',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-model.component.html',
  styleUrls: ['./form-model.component.scss']
})
export class FormModelComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
