import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ModalComponent } from './modal/modal.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    ModalComponent,
  ],
  imports: [CommonModule, InlineSVGModule, RouterModule, NgbModalModule],
  exports: [
    ModalComponent,
  ],
})
export class ModalsModule {}
