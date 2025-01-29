import { Component, Input, OnInit, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-team-view',
  templateUrl: './team-view.component.html',
  styleUrls: ['./team-view.component.scss']
})
export class TeamViewComponent implements OnInit {
  activeModal = inject(NgbActiveModal);
  @Input() employees:any;
  color=["yellow-circle",
    "green-circle",
    "blue-circle",
    "grey-circle"]
  constructor() { }

  ngOnInit(): void {
  }
  getShortName(fullName:string) {
    return fullName.split(' ').map(n => n[0]).join('');
    }
}
