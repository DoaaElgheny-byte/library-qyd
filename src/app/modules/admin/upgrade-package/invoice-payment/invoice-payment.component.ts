import { Component, Input, OnInit, inject } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AppConfirmService } from 'src/app/modules/SharedComponent/SharedComponent/app-confirm/app-confirm.service';
import { UpgradePackageService } from 'src/app/services/api/upgrade-package.sevice';

@Component({
  selector: 'app-invoice-payment',
  templateUrl: './invoice-payment.component.html',
  styleUrls: ['./invoice-payment.component.scss']
})
export class InvoicePaymentComponent implements OnInit {

  activeModal = inject(NgbActiveModal);
  ibanNo: string = ''
  @Input() data: any;
  @Input() countOfCustomers: any;

  invoiceId: any
  constructor(private modalService: NgbModal,
    private _ugradeService: UpgradePackageService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private appconfirmservice: AppConfirmService) { }

  ngOnInit(): void {
    this.manageInvoice()
  }
  closeModal() {
    this.modalService.dismissAll('Cross click');
  }
  manageInvoice() {
    debugger
    let obj = {
      packageId: this.data,
      countOfCustomers: this.countOfCustomers
    }
    this._ugradeService.manageInvoice(obj).subscribe({
      next: next => {
        if (next.success) {
          this.invoiceId = next.data
        }
      }
    })
  }
  receiptFiletName: string | null
  receiptFileStorageName: string | null
  uploadImg(data: any) {

    this.receiptFileStorageName = data.storageFileName;
    this.receiptFiletName = data.fileName;
  }
  submit() {
    debugger
    if (this.receiptFileStorageName) {
      let paylod = {
        id: this.invoiceId,
        receiptFiletName: this.receiptFiletName,
        receiptFileStorageName: this.receiptFileStorageName,
      }
      this._ugradeService.uploadReceipt(paylod).subscribe({
        next: next => {
          if (next.success) {
            this.activeModal.dismiss('Cross click')
            this.appconfirmservice.confirm(
              this.translate.instant("upgradePackage.thanks"),
              this.translate.instant("upgradePackage.paymentSend"),
              '/assets/imgs/qyd/payment.svg', true, '/agent/agent-payment')
          }
        }
      })
    } else {
      this.toastr.info(
        this.translate.instant('upgradePackage.uploadFileFirst')
      );
    }

  }

  copySuccess: boolean = false;
  copyAccountNumber(accountNumber: string) {
    navigator.clipboard.writeText(accountNumber)
      .then(() => {
        this.copySuccess = true;
        setTimeout(() => this.copySuccess = false, 2000); // Hide success message after 2 seconds
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  }


}
