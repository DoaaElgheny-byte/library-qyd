import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent implements OnInit {
  @Input() title: string;
  @Input() message: string;
  @Input() isDelete: boolean;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;
  @Input() data: string;
  @Input() attension: string;

  constructor(private activeModal: NgbActiveModal, private translate: TranslateService,) {}

  ngOnInit() {

  }

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    this.activeModal.close(true);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }
}
