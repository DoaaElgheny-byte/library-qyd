import { Injectable } from '@angular/core';
import { WebApiService } from '../webApi.service';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  constructor(private webApi: WebApiService) { }
  getAllUsers(param?: any) {
    return this.webApi.get('api/app/manage-user/users', param);
  }
  changeStatus(body: any) {
    return this.webApi.post('api/app/manage-user/set-user-account-state', body);
  }
  deactivateAccount() {
    return this.webApi.post('api/app/manage-user/deactivate-account');
  }
  resendEmail(email: string) {
    return this.webApi.post(
      `api/app/manage-user/resend-confirmation-email?email=${email}`
    );
  }
  getMacAddress() {
    return this.webApi.get(
      'api/app/manage-user/mac-address-for-pc'
    );
  }

  createCandley(body: any) {
    return this.webApi.post('/api/app/manage-user/mac-address-for-pc', body);
  }
  playerDetailsApi(id: any) {
    return this.webApi.get(`api/app/manage-agent/${id}/agent-details`);
  }
  EditUser(body: any) {
    return this.webApi.post(
      `api/app/manage-player/edit-player-by-admin`,
      body
    );
  }
}
