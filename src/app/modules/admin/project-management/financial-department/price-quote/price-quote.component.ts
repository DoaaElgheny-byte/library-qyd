import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { IssuesService } from 'src/app/services/api/issues.service';
import { SimplifiedInvoicePdfComponent } from '../../pdfs/simplified-invoice-pdf/simplified-invoice-pdf.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PriceQuotePdfComponent } from '../../pdfs/price-quote-pdf/price-quote-pdf.component';
@Component({
  selector: 'app-price-quote',
  templateUrl: './price-quote.component.html',
  styleUrls: ['./price-quote.component.scss'],
  providers: [DatePipe]
})
export class PriceQuoteComponent implements OnInit {
  projectId: any;
  PriceToProjectDetails: any;
  serialNumber: string;
  startDate: any;
  endDate: any;
  clientName: string;
  totalTax: any;
  offerApproved: boolean = false;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private service = inject(IssuesService);
  private spinner = inject(NgxSpinnerService);
  private datePipe = inject(DatePipe);
  private cdr = inject(ChangeDetectorRef);
  private toastr = inject(ToastrService);
  private translate = inject(TranslateService);
  private modalService = inject(NgbModal);

  constructor() { }

  ngOnInit(): void {

    this.getRequestId();
    this.startDate = new Date();
    this.endDate = new Date();
  }

  getRequestId() {
    this.route.params.subscribe({
      next: (params) => {
        this.projectId = params['id'];
        this.getDataPriceOfProject();
      },
    });
  }

  getDataPriceOfProject() {
    this.spinner.show();
    this.service.getDataPriceToProjectDataQuery(this.projectId).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe(res => {
      this.PriceToProjectDetails = res.data;
      console.log(res.data)
      this.serialNumber = res.data.serialNumber;
      this.startDate = this.datePipe.transform(res.data.startDate, 'yyyy-MM-dd') || '';
      this.endDate = this.datePipe.transform(res.data.endDate, 'yyyy-MM-dd') || '';
      this.clientName = res.data.clientName;
      this.totalTax = res.data.totalTax;
      this.offerApproved = res.data.isApprovedOffer;
      this.cdr.detectChanges();
    })
  }

  updateDataOfPriceProject() {
    this.spinner.show();
    let obj = {
      ProjectId: this.projectId,
      IsApprovedOffer: this.offerApproved
    }
    this.service.EditIsApprovedPriceOfProject(obj).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe(res => {
      this.toastr.success(
        this.translate.instant('projectManagement.UpdatedSuccessFully')
      );
    })
  }

  paymentNoticeInvoice(id: any) {
    this.service.paymentNoticeInvoice(id).subscribe(res => {
      if (res.data != null) {
        this.toastr.success(this.translate.instant('projectManagement.AddedSdadaSuccessFully'));
      }
    })
  }

  viewSimplifiedInvoicePdf() {
    this.spinner.show();
    this.service.AddVatNumberForClient(this.PriceToProjectDetails.projectId).subscribe(res => {
      this.service.getDataPriceToProjectDataQuery(this.projectId).pipe(finalize(() => {
        this.spinner.hide();
      })).subscribe(res => {
        this.PriceToProjectDetails = res.data;
        const modalRef = this.modalService.open(SimplifiedInvoicePdfComponent, {
          size: 'lg',
          backdrop: 'static',
          centered: true,
        });
        modalRef.componentInstance.PriceToProjectDetails = this.PriceToProjectDetails;
        modalRef.result.finally(() => {
          this.paymentNoticeInvoice(this.PriceToProjectDetails.projectId);
          this.cdr.detectChanges();
        });
      })
    })
  }

  nextToPdf() {
    // this.launchConfetti();
    const modalRef = this.modalService.open(PriceQuotePdfComponent, {
      size: 'lg',
      backdrop: 'static',
      centered: true,
    });
    modalRef.componentInstance.projectDetails = this.PriceToProjectDetails;
    modalRef.componentInstance.isHide = true
  }

  editData() {
    this.router.navigate(['/admin/departments/project-management/add-edit-project/', this.projectId]);

  }
  ViewDetails() {
    this.router.navigate(['/admin/departments/project-management/details/', this.projectId]);

  }
}
