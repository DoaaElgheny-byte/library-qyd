import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { IssuesService } from 'src/app/services/api/issues.service';
import { SimplifiedInvoicePdfComponent } from '../../pdfs/simplified-invoice-pdf/simplified-invoice-pdf.component';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss']
})
export class BillsComponent implements OnInit {
  projectId: any;
  invoiceData: any;

  private issueService = inject(IssuesService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private spinner = inject(NgxSpinnerService);
  private modalService = inject(NgbModal);

  constructor() { }

  ngOnInit(): void {
    this.getRequestId();
  }

  getRequestId() {
    this.route.params.subscribe({
      next: (params) => {
        this.projectId = params['id'];
        this.getData();
      },
    });
  }

  getData() {
    this.spinner.show();
    this.issueService.getAllInvoicesInPayments(this.projectId).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe(res => {
      console.log({ res });
      this.invoiceData = res.data;
      this.cdr.detectChanges();
    })
  }


  viewSimplifiedInvoicePdf(index: any) {

    this.spinner.show();
    this.issueService.AddVatNumberForClient(this.projectId).subscribe(res => {
      const modalRef = this.modalService.open(SimplifiedInvoicePdfComponent, {
        size: 'lg',
        backdrop: 'static',
        centered: true,
      });
      this.spinner.hide();
      modalRef.componentInstance.PriceToProjectDetails = this.invoiceData[index]
    })
  }
}
