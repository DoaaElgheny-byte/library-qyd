import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentsService } from 'src/app/services/api/payments.service';
import { ZatcaQrService } from 'src/app/services/api/zatca-qr.service';
import { AccountTypes } from 'src/app/services/enums/accountType.enum';
import { DurationPackage } from 'src/app/services/enums/package.enum';

@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrls: ['./view-invoice.component.scss']
})
export class ViewInvoiceComponent implements OnInit {
  activeModal = inject(NgbActiveModal);
  invoiceDetail: any;
  @Input() data: any;
  @Input() type: boolean;
  DurationPackage = DurationPackage;
  qrImageUrl: string | null = null;
  isShowInvoice: boolean = true;

  constructor(
    private modalService: NgbModal,
    private paymentService: PaymentsService

  ) { }

  ngOnInit(): void {
    console.log(this.type);

    if (!this.type) this.getInvoiceDetails();
    if (this.type) this.getReceiptDetails();
  }

  getInvoiceDetails() {
    this.paymentService.getInvoiceMoyasarDetails(this.data).subscribe({
      next: next => {

        this.invoiceDetail = next.data;
        console.log(this.invoiceDetail);
        if (!this.invoiceDetail.isSubscribeOnVat) this.isShowInvoice = false;
        else this.isShowInvoice = true;
        this.paymentService.getInvoiceQRCode(next.data.id).subscribe({
          next: (response) => {

            console.log(response.data.qrCode);

            this.qrImageUrl = response.data.qrCode
            console.log(this.qrImageUrl);
          }
        })

      }
    })
  }

  getReceiptDetails() {

    this.paymentService.getReceiptDetailsInvoiceDetails(this.data).subscribe({
      next: next => {
        this.invoiceDetail = next.data;
        console.log(this.invoiceDetail);

        if (!this.invoiceDetail.isSubscribeOnVat) this.isShowInvoice = false;
        else this.isShowInvoice = true;
        this.paymentService.getReceiptQRCode(next.data.id).subscribe({
          next: (response) => {
            console.log(response.data.qrCode);
            this.qrImageUrl = response.data.qrCode
            console.log(this.qrImageUrl);
          }
        })
      }
    })
  }


  closeModal() {
    this.modalService.dismissAll('Cross click');
  }

}
