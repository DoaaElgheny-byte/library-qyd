import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';
import { RejectionReasonComponent } from '../rejection-reason/rejection-reason.component';
import { InvoicePaymentComponent } from '../invoice-payment/invoice-payment.component';
import { PaymentsService } from 'src/app/services/api/payments.service';
import { PaymentAgentStatus } from 'src/app/services/enums/invoice-payment.enum';
import { ViewInvoiceComponent } from '../view-invoice/view-invoice.component';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable, of, tap } from 'rxjs';
import { DurationPackage } from 'src/app/services/enums/package.enum';
import { AccountTypes } from 'src/app/services/enums/accountType.enum';
import { TranslateService } from '@ngx-translate/core';
import { UpgradePackageService } from 'src/app/services/api/upgrade-package.sevice';
declare let gtag: Function;

@Component({
  selector: 'app-agent-payments',
  templateUrl: './agent-payments.component.html',
  styleUrls: ['./agent-payments.component.scss']
})
export class AgentPaymentsComponent implements OnInit {
  subscriptionType: number;
  accountType: number;
  agentId: number;
  page: number = 1;
  pageForRecitPayment: number = 1;
  pageSize: number = 10;
  pageSizeForRecitPayment: number = 10;
  allPayments: any[] = [];
  allPaymentsForRecit: any[] = [];
  combinedInvoices: any[] = [];
  cloneCombinedInvoices: any[] = [];

  filterObj = this.initFilterObj();
  subscription_type: string;
  currentUser: any;
  accountTypeName: string;
  totalCount: number;
  totalCountForRecit: number;
  paymentStatus = PaymentAgentStatus
  fromSearchInput: boolean = false;
  InvoiceNo: string = '';
  PaymentStatus: any = '';
  invoiceId: string;
  status: string | null = null;
  accountTypes = AccountTypes;
  isPaidInvoice: boolean = false;
  to: any;
  from: any;
  hasCalledService: boolean = false; // Flag to track if service has been called
  isShowMoyaserPayments: boolean = false
  constructor(
    private _paymentService: PaymentsService,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private breadcrumbService: BreadcrumbService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private _upgradeService: UpgradePackageService,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.spinner.show()
    this.breadcrumbService.restoreBreadcrumbsFromStorage();
    this.route.queryParams.subscribe(params => {
      const newInvoiceId = params['invoice_id'];
      const newStatus = params['status'];
      const lastInvoiceId = localStorage.getItem('lastInvoiceId');
      const lastStatus = localStorage.getItem('lastStatus');
      if (newInvoiceId) {
        if (newInvoiceId !== lastInvoiceId || newStatus !== lastStatus
        ) {
          this.invoiceId = newInvoiceId;
          this.status = newStatus;
          localStorage.setItem('lastInvoiceId', this.invoiceId || '');
          localStorage.setItem('lastStatus', this.status || '');

          this._paymentService
            .callBackByMoyasr(this.invoiceId)
            .subscribe({
              next: (res) => {
                this._upgradeService.generateIvoice(res).subscribe({
                  next: next => {
                    this.subscriptionType = next.data.durationPackage;
                    this.accountType = next.data.accountType;
                    this.agentId = next.data.agentId;
                    let date = this.datepipe.transform(new Date, 'yyyy-MM-dd');

                    if (this.accountType == this.accountTypes.Advisor) this.accountTypeName = this.translate.instant('package.advisor');
                    if (this.accountType == this.accountTypes.LawyerOffice) this.accountTypeName = this.translate.instant('package.lawyerOffice');
                    if (this.accountType == this.accountTypes.LegalDepartment) this.accountTypeName = this.translate.instant('register.LegalDepartment');
                    if (this.accountType == this.accountTypes.Traininglawyer) this.accountTypeName = this.translate.instant('register.Traininglawyer');
                    if (this.accountType == this.accountTypes.Licensedlawyer) this.accountTypeName = this.translate.instant('register.Licensedlawyer');
                    if (this.accountType == this.accountTypes.LegalAdministration) this.accountTypeName = this.translate.instant('register.LegalAdministration');
                    if (this.accountType == this.accountTypes.RegularRepresentative) this.accountTypeName = this.translate.instant('package.regularRepresentative');
                    if (this.accountType == this.accountTypes.All) this.accountTypeName = this.translate.instant('LogIn.qydAgent');

                    if (this.status !== 'paid' && !this.hasCalledService) {
                      localStorage.setItem('hasCalledService', 'true' || 'false');

                      let amountInvoice = next.data.totalPrice;
                      gtag('event', 'payment_failed', {
                        payment_status: 'failure',
                        payment_method: 'credit card',
                        account_type: this.accountTypeName,
                        timestamp: date,
                        amount: amountInvoice,
                      });
                    } else if (this.status === 'paid' && !this.hasCalledService) {
                      localStorage.setItem('hasCalledService', "true" || 'false');

                      if (this.subscriptionType === DurationPackage.Month) {
                        this.subscription_type = "Month"
                      }
                      if (this.subscriptionType === DurationPackage.Year) {
                        this.subscription_type = "Year"
                      }
                      gtag('event', 'subscription_confirmed', {
                        subscription_type: this.subscription_type,
                        payment_status: 'confirmed',
                        account_type: this.accountTypeName,
                        timestamp: date,
                        subscription_id: this.agentId,
                      });
                    }
                  }
                })
                setTimeout(() => {
                  this.getCustomizedData()
                }, 7000);
              },
              error: (error) => {
                this.spinner.hide();
                this.toastr.error(error);
              },
            });
        }
        else this.getCustomizedData()
      } else this.getCustomizedData()
    });
  }

  searchIncombinedInvoices() {
    if (this.PaymentStatus == PaymentAgentStatus.All || this.PaymentStatus == "")
      this.combinedInvoices = this.cloneCombinedInvoices;
    if (this.PaymentStatus == PaymentAgentStatus.Cancelled)
      this.combinedInvoices = this.cloneCombinedInvoices.filter((item: any) => item.paymentStatus === PaymentAgentStatus.Cancelled);
    if (this.PaymentStatus == PaymentAgentStatus.NotPaied)
      this.combinedInvoices = this.cloneCombinedInvoices.filter((item: any) => item.paymentStatus === PaymentAgentStatus.NotPaied);
    if (this.PaymentStatus == PaymentAgentStatus.Paied) {
      this.combinedInvoices = this.cloneCombinedInvoices.filter((item: any) => (item.paymentStatus === PaymentAgentStatus.Paied) || (item.status === 'paid'));
    }
    if (this.PaymentStatus == PaymentAgentStatus.Rejected)
      this.combinedInvoices = this.cloneCombinedInvoices.filter((item: any) => item.paymentStatus === PaymentAgentStatus.Rejected);
    if (this.PaymentStatus == PaymentAgentStatus.WaitingForApproval)
      this.combinedInvoices = this.cloneCombinedInvoices.filter((item: any) => item.paymentStatus === PaymentAgentStatus.WaitingForApproval);
  }

  keyPressNumbers(event: any) {
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  initFilterObj() {
    return {
      InvoiceNo: this.InvoiceNo,
      PaymentStatus: this.PaymentStatus,
      Sorting: 'id',
      SkipCount: 0,
      MaxResultCount: this.pageSize,
    };
  }

  getCustomizedData() {
    forkJoin({
      forReceipt: this.getForReciphtAllPayments(),
      allPayments: this.getAllPayments()
    }).subscribe({
      next: (results) => {
        const forReceiptData = results.forReceipt.data.items;
        const allPaymentsData = results.allPayments.data.items;

        this.combinedInvoices = [
          ...forReceiptData.map((item: any) => ({ ...item, type: 0 })),
          ...allPaymentsData.map((item: any) => ({ ...item, type: 1 }))
        ];
        this.cloneCombinedInvoices = this.combinedInvoices;
        this.cloneCombinedInvoices = this.combinedInvoices.sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        this.cdr.detectChanges();
        this.totalCountForRecit = this.cloneCombinedInvoices.length;
      },
      error: (err) => {
        this.spinner.hide();
      }
    });
  }

  getAllPayments(): Observable<any> {
    if (!this.fromSearchInput) {
      this.spinner.show();
    }

    const startIndex = (this.page - 1) * this.pageSize;
    this.filterObj.SkipCount = startIndex;
    this.filterObj.InvoiceNo = this.InvoiceNo;
    this.filterObj.PaymentStatus = this.PaymentStatus;
    this.filterObj.MaxResultCount = this.pageSize;

    return this._paymentService.searchAgentPayment(this.filterObj).pipe(
      tap({
        next: (response) => {
          if (response.success) {
            this.allPayments = response.data.items; // Assign data here
            console.log(this.allPayments)
            this.totalCount = response.data.totalCount;
          } else {
            this.toastr.error(response.message);
          }
          this.spinner.hide();
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.spinner.hide();
          this.toastr.error(error);
        }
      })
    );
  }

  getForReciphtAllPayments(): Observable<any> {
    if (!this.fromSearchInput) {
      this.spinner.show();
    }
    const startIndex = (this.pageForRecitPayment - 1) * this.pageSizeForRecitPayment;
    this.filterObj.SkipCount = startIndex;
    this.filterObj.InvoiceNo = this.InvoiceNo;
    this.filterObj.PaymentStatus = this.PaymentStatus;
    this.filterObj.MaxResultCount = this.pageSize;

    return this._paymentService.searchAgentForRecepitPayment(this.filterObj).pipe(
      tap({
        next: (response) => {
          if (response.success) {
            this.allPaymentsForRecit = response.data.items;
            // Assign data here
          } else {
            this.toastr.error(response.message);
          }
          this.spinner.hide();
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.spinner.hide();
          this.toastr.error(error);
        }
      })
    );
  }

  private modalService = inject(NgbModal);
  rejection(reasons: any) {
    const modalRef = this.modalService.open(RejectionReasonComponent, {
      size: 'sm',
      backdrop: 'static',
      centered: true,
    });
    modalRef.componentInstance.data = reasons;
  }

  sendReceipt(id: any) {
    const modalRef = this.modalService.open(InvoicePaymentComponent, {
      size: 'sm',
      backdrop: 'static',
      centered: true,
    });
    modalRef.componentInstance.data = id;
    modalRef.result.then().catch((result) => {
      if (result) {
        this.getAllPayments()
      }
    })

  }

  view(id: any) {
    const modalRef = this.modalService.open(ViewInvoiceComponent, {
      size: 'sm',
      backdrop: 'static',
      centered: true,
    });
    modalRef.componentInstance.data = id;
    modalRef.componentInstance.type = false;

    modalRef.result.then().catch((result) => {
      if (result) {
      }
    })
  }

  viewRecepit(id: any) {
    const modalRef = this.modalService.open(ViewInvoiceComponent, {
      size: 'sm',
      backdrop: 'static',
      centered: true,
    });
    modalRef.componentInstance.data = id;
    modalRef.componentInstance.type = true;

    modalRef.result.then().catch((result) => {
      if (result) {
      }
    })
  }

  downloadReceipt(url: any) {
    debugger
    this.http.get(url, { responseType: 'blob' })
      .subscribe((response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'receipt.png'; // or any other file name
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      });
  }

  showPaymentReceipts() {
    this.isShowMoyaserPayments = false
  }

  showPaymentMoyasserReceipts() {
    this.isShowMoyaserPayments = true
  }
}
