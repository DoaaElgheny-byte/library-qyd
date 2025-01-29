import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';
import { UpgradePackageService } from 'src/app/services/api/upgrade-package.sevice';
import { DurationFreeTrialPackage, DurationPackage } from 'src/app/services/enums/upgrade-package.enum';
import { TranslateService } from '@ngx-translate/core';
import { PaymentsService } from 'src/app/services/api/payments.service';
import { finalize } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/modules/auth';
import { AccountTypes } from 'src/app/services/enums/accountType.enum';
import { AppConfirmService } from 'src/app/modules/SharedComponent/SharedComponent/app-confirm/app-confirm.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InvoicePaymentComponent } from '../invoice-payment/invoice-payment.component';
// declare let gtag: Function;

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss']
})
export class InvoiceDetailsComponent implements OnInit {
  id: any;
  countOfCustomer: number;
  invoiceDetail: any
  DurationPackage = DurationPackage;
  isShowCompletedForm: boolean;
  selectedInvoiceData: any;
  buyPackage: any;
  accountTypes = AccountTypes;
  subscriptionType: number;
  accountType: number;
  agentId: number;
  subscription_type: string;
  currentUser: any;
  accountTypeName: string;
  isShowButton: boolean = false;
  countCustomerselected: number;
  private modalService = inject(NgbModal);

  constructor(
    private breadcrumbService: BreadcrumbService,
    private _upgradeService: UpgradePackageService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private paymentService: PaymentsService,
    private router: Router,
    public datepipe: DatePipe,
    private authService: AuthService,
    private appconfirmservice: AppConfirmService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.isShowCompletedForm = JSON.parse(localStorage.getItem('isShowCompletedForm') || 'false');
    if (this.isShowCompletedForm) {
      this.breadcrumbService.restoreBreadcrumbsFromStorage();
      this.route.params.subscribe({
        next: next => {
          this.id = next['id']
        }
      })
      if (this.id) {
        this.spinner.show()
        this.generateInvoice()
      }
    }
  }

  showFinalStep() {
    this.router.navigate(['/auth/register/complete-info']);
  }

  generateInvoice() {
    debugger
    this.invoiceDetail = [];
    let count = Number(localStorage.getItem('userCount'));
    if (count == 0) {
      this.countCustomerselected = 1
    } else {
      this.countCustomerselected = count;
    }
    this._upgradeService.generateIvoice(this.id).subscribe({
      next: next => {
        this.invoiceDetail = next.data;
        this.isShowButton = JSON.parse(localStorage.getItem('showBuyPackageWithOutPaid') || 'false');
        if (next.data.durationFreeTrialPackage == DurationFreeTrialPackage.Always) {
          this.buyPackage = {
            id: this.id,
            rateAddedTax: next.data.rateAddedTax,
            isMain: true,
            isTakeBuyPackageForFree: false
          }
        }
        /// Calc Invoice Using Count Of Customers
        this.invoiceDetail.price = (this.invoiceDetail.price * this.countCustomerselected);
        this.invoiceDetail.disCountValue = (this.invoiceDetail.price) * (this.invoiceDetail.disCountRate / 100);
        this.invoiceDetail.orderCost = (this.invoiceDetail.price - this.invoiceDetail.disCountValue);
        this.invoiceDetail.valueAddedTax = (this.invoiceDetail.price * (15 / 100));
        this.invoiceDetail.totalPrice = (this.invoiceDetail.orderCost + this.invoiceDetail.valueAddedTax);

        this.subscriptionType = next.data.durationPackage;
        this.accountType = next.data.accountType;
        this.agentId = next.data.agentId;
        this.selectedInvoiceData = {
          packageId: this.id,
          countOfCustomers: count,
          amount: ((this.invoiceDetail.totalPrice) * 100),
          Currency: 'SAR',
          description: this.translate.instant('payments.paymentMoyasarDescrption'),
          success_url: `${environment.clientUrl}agent/agent-payment`,
        };
        localStorage.removeItem('showBuyPackageWithOutPaid');
        this.spinner.hide()
        this.cdr.detectChanges()
      }
    })
  }

  pay() {
    this.spinner.show();
    this.paymentService.paymentNewByMoyasr(this.selectedInvoiceData).pipe(
      finalize(() => {
        this.spinner.hide();
      })
    ).subscribe(res => {
      if (this.subscriptionType === DurationPackage.Month) {
        this.subscription_type = "Month"
      }
      if (this.subscriptionType === DurationPackage.Year) {
        this.subscription_type = "Year"
      }
      let date = this.datepipe.transform(new Date, 'yyyy-MM-dd');

      if (this.accountType == this.accountTypes.Advisor) this.accountTypeName = this.translate.instant('package.advisor');
      if (this.accountType == this.accountTypes.Traininglawyer) this.accountTypeName = this.translate.instant('register.Traininglawyer');
      if (this.accountType == this.accountTypes.Licensedlawyer) this.accountTypeName = this.translate.instant('register.Licensedlawyer');
      if (this.accountType == this.accountTypes.LegalAdministration) this.accountTypeName = this.translate.instant('register.LegalAdministration');
      if (this.accountType == this.accountTypes.LegalDepartment) this.accountTypeName = this.translate.instant('register.LegalDepartment');
      if (this.accountType == this.accountTypes.LawyerOffice) this.accountTypeName = this.translate.instant('package.lawyerOffice');
      if (this.accountType == this.accountTypes.RegularRepresentative) this.accountTypeName = this.translate.instant('package.regularRepresentative');
      if (this.accountType == this.accountTypes.All) this.accountTypeName = this.translate.instant('LogIn.qydAgent');

      // gtag('event', 'subscription_initiated', {
      //   subscription_type: this.subscription_type,
      //   payment_status: 'pending',
      //   account_type: this.accountTypeName,
      //   timestamp: date,
      //   subscription_id: this.agentId,
      // });
      window.location.href = res;
    })
  }

  PaymentByReceipts() {
    debugger
    let count = Number(localStorage.getItem('userCount'));
    if (count == 0) {
      this.countCustomerselected = 1
    } else {
      this.countCustomerselected = count;
    }
    if (this.invoiceDetail.isExistWaitingForApprovalInvoice) {
      this.appconfirmservice.confirm(
        this.translate.instant("upgradePackage.payMessage"), '',
        '/assets/imgs/qyd/attention.svg', false)
    } else {
      const modalRef = this.modalService.open(InvoicePaymentComponent, {
        size: 'sm',
        backdrop: 'static',
        centered: true,
      });
      modalRef.componentInstance.data = this.id;
      modalRef.componentInstance.countOfCustomers = this.countCustomerselected;
      modalRef.result.then().catch((result) => {
        if (result) {
        }
      })
    }
  }

  buyAlwaysPackage() {
    this.spinner.show();
    this.buyPackage.isTakeBuyPackageForFree = true;
    this.authService.selectPackage(this.buyPackage).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe(res => {
      this.appconfirmservice.confirm(
        this.translate.instant("upgradePackage.thanks"),
        this.translate.instant("upgradePackage.boughtpackageSuccess"),
        '/assets/imgs/qyd/payment.svg', true, '/admin/departments/dashboard-managment')
    })
  }
}