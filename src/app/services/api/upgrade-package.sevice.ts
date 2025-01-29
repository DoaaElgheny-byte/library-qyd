import { Injectable } from '@angular/core';
import { WebApiService } from '../webApi.service';

@Injectable({
  providedIn: 'root',
})
export class UpgradePackageService {
  constructor(private webApi: WebApiService) { }
  getAllPackages(body?: any) {
    return this.webApi.get('api/app/manage-package/package-list', body);
  }

  getAllConditions() {
    return this.webApi.get('api/app/manage-package/conditions');
  }

  getAllPackagesForHomePage() {
    return this.webApi.get('api/app/manage-package/packages');
  }
  manageInvoice(body: any) {
    return this.webApi.post(`api/app/manage-invoice`, body);

  }
  generateIvoice(id: any) {
    return this.webApi.get(`api/app/manage-invoice/generate-invoice?packageid=${id}`);
  }

  uploadReceipt(body: any) {
    return this.webApi.put(`api/app/manage-invoice/upload-receipt`, body);
  }


}