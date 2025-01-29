import { Injectable } from '@angular/core';
import { WebApiService } from '../webApi.service';

@Injectable({
  providedIn: 'root',
})
export class PackageManagementService {
  constructor(private webApi: WebApiService) { }
  searchPackage(params: any) {
    return this.webApi.get(`api/app/manage-package/search-packages`, params);
  }
  changeState(body: any) {
    return this.webApi.put(
      `api/app/manage-package/change-package-state`, body
    );
  }
  getPackageDetails(id: any) {
    return this.webApi.get(`api/app/manage-package/${id}/package-by-id`);
  }
  addPackage(body: any) {
    return this.webApi.post(`api/app/manage-package`, body);
  }
  editPackage(body: any) {
    return this.webApi.put(`api/app/manage-package/edit`, body);
  }
  getConditions() {
    return this.webApi.get(`api/app/manage-package/conditions`);
  }

  getConditionsForAgent() {
    return this.webApi.get('api/app/manage-package/conditions-for-agent');
  }
}
