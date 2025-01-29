import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-terms-and-conditions-model-component',
  templateUrl: './terms-and-conditions-model-component.component.html',
  styleUrls: ['./terms-and-conditions-model-component.component.scss']
})
export class TermsAndConditionsModelComponentComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

}
