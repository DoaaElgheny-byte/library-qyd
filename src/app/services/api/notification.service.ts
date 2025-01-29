import { Injectable } from '@angular/core';
import { WebApiService } from '../webApi.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private webApi: WebApiService) {}
  getNotification(body: any) {
    return this.webApi.get('api/app/manage-notification', body);
  }
  countNotification() {
    return this.webApi.get('api/app/manage-notification/un-read-notifications-count');
  }
  readNotification(id:any) {
    return this.webApi.post(`api/app/manage-notification/read-notification/${id}`);
  }
  resetCount() {
    return this.webApi.post('api/app/manage-notification/open-notification')
  }
  
}