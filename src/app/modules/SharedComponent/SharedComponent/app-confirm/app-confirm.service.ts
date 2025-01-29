import { Injectable } from '@angular/core';
import { AppConfirmComponent } from './app-confirm.component';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AppConfirmService {

  constructor(
    private modalService: NgbModal,
    private translate: TranslateService
  ) {}

  public confirm(
    title: string,
    body:string | null =null,
    src: string,
    close=true,
    backUrl:string|null = null
  ): Promise<boolean> {
    const modalRef = this.modalService.open(AppConfirmComponent, {
      size: 'sm',
      centered: true,
    });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.body = body;
    modalRef.componentInstance.src = src;
    modalRef.componentInstance.close = close;
    modalRef.componentInstance.backUrl = backUrl;

    return modalRef.result;
  }
}