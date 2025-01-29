import { Injectable } from '@angular/core';
import { WebApiService } from '../webApi.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentsService {
  constructor(private webApi: WebApiService) { }
  searchInvoices(body: any) {
    return this.webApi.get('api/app/manage-invoice/search-invoice', body);
  }
  changeInvoiceState(body: any) {
    return this.webApi.put('api/app/manage-invoice/set-invoice-acceptance-state', body);
  }
  searchAgentPayment(body: any) {
    return this.webApi.get('api/app/manage-invoice/invoices-for-agent', body);
  }
  searchAgentForRecepitPayment(body: any) {
    return this.webApi.get('api/app/manage-invoice/invoices-recepit-for-agent', body);
  }
  getInvoiceDetails(id: any) {
    return this.webApi.get(`api/app/manage-invoice/invoice-details?packageid=${id}`);
  }

  getInvoiceMoyasarDetails(id: any) {
    return this.webApi.get(`api/app/manage-invoice/moyasar-invoice/${id}`);
  }

  getReceiptDetailsInvoiceDetails(id: any) {
    return this.webApi.get(`api/app/manage-invoice/recepit-details-invoice-details/${id}`);
  }

  getReceiptQRCode(id: any) {
    return this.webApi.get(`api/app/manage-invoice/generate-receipt-qRcode/${id}`);
  }
  getInvoiceQRCode(id: any) {
    return this.webApi.get(`api/app/manage-invoice/generate-invoice-qRcode/${id}`);
  }
  paymentByMoyasr(body: any) {
    return this.webApi.post('api/app/manage-invoice/invoice-moyasar', body);
  }
  callBackByMoyasr(invoiceId: any) {
    return this.webApi.post(`api/app/manage-invoice/call-back-moyasar-invoice/${invoiceId}`);
  }
  paymentNewByMoyasr(body: any) {
    return this.webApi.post('api/app/manage-invoice/new-invoice-moyasar', body);
  }

}