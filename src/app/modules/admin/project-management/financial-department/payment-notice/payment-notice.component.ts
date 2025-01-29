import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreatePaymentNoticeModalComponent } from '../create-payment-notice-modal/create-payment-notice-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { IssuesService } from 'src/app/services/api/issues.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { PaymentNoticePdfComponent } from '../../pdfs/payment-notice-pdf/payment-notice-pdf.component';
import { SimplifiedInvoicePdfComponent } from '../../pdfs/simplified-invoice-pdf/simplified-invoice-pdf.component';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-payment-notice',
  templateUrl: './payment-notice.component.html',
  styleUrls: ['./payment-notice.component.scss']
})
export class PaymentNoticeComponent implements OnInit {

  constructor() { }

  projectId: any;
  paymentNotices: any;

  private modalService = inject(NgbModal);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private service = inject(IssuesService);
  private spinner = inject(NgxSpinnerService);
  private cdr = inject(ChangeDetectorRef);
  private toastr = inject(ToastrService);
  private translate = inject(TranslateService);

  ngOnInit(): void {
    this.getRequestId();
    this.getPaymentNoticeAllData();
  }

  viewNotice(row: any) {
    console.log('Viewing notice:', row);
  }

  editData(row: any) {
    console.log('Editing data:', row);

    const modalRef = this.modalService.open(CreatePaymentNoticeModalComponent, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
    });
    modalRef.componentInstance.id = row;
    modalRef.result.finally(() => {
      this.getPaymentNoticeAllData();
      this.cdr.detectChanges();
    });


  }

  addPaymentInvoice(row: any) {
    console.log('Adding payment invoice for:', row);
  }

  downloadQuote(row: any) {
    console.log('Downloading quote:', row);
  }

  getRequestId() {
    this.route.params.subscribe({
      next: (params) => {
        this.projectId = params['id'];
        // this.getDataPrePriceToProject();
      },
    });
  }

  viewPaymentNotice() {

    const modalRef = this.modalService.open(CreatePaymentNoticeModalComponent, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
    });
    modalRef.componentInstance.projectId = this.projectId;
    modalRef.result.finally(() => {
      this.getPaymentNoticeAllData();
      this.cdr.detectChanges();
    });

  }
  viewPaymentNoticePdf(item: any) {
    const modalRef = this.modalService.open(PaymentNoticePdfComponent, {
      size: 'lg',
      backdrop: 'static',
      centered: true,
    });
    modalRef.componentInstance.details = item

  }
  getPaymentNoticeAllData() {
    this.spinner.show();
    this.service.GetPaymentNoticeAllData(this.projectId).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe(res => {
      this.paymentNotices = res.data;
      this.cdr.detectChanges();
    })
  }


  paymentNoticeForSdad(id: any) {
    this.service.paymentNoticeForSdad(id).subscribe(res => {
      if (res.data != null) {
        this.toastr.success(this.translate.instant('projectManagement.AddedSdadaSuccessFully'));
      }
    })
  }


  viewSimplifiedInvoicePdf(item: any) {

    this.spinner.show();
    this.service.AddVatNumberForClient(this.projectId).subscribe(res => {
      const modalRef = this.modalService.open(SimplifiedInvoicePdfComponent, {
        size: 'lg',
        backdrop: 'static',
        centered: true,
      });
      this.spinner.hide();
      modalRef.componentInstance.PriceToProjectDetails = item;
      modalRef.result.finally(() => {
        this.paymentNoticeForSdad(item.id);
        this.cdr.detectChanges();
      });
    })
  }
}
