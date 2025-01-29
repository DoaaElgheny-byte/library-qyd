import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-after-registeration-suc',
  templateUrl: './after-registeration-suc.component.html',
  styleUrls: ['./after-registeration-suc.component.scss'],
})
export class AfterRegisterationSucComponent implements OnInit {
  constructor(
    public router: Router
  ) {}

  ngOnInit(): void {}

  public dismiss() {}

  public redirectTo() {
    this.router.navigate(['/auth/login']);
  }
}
