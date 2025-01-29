import { Injectable } from '@angular/core';
import { WebApiService } from '../webApi.service';

@Injectable({
  providedIn: 'root',
})
export class ContactusService {
  constructor(private webApi: WebApiService) { }
  sendContactUsData(body: any) {
    return this.webApi.post('api/app/manage-contact-us/contact-us', body);
  }
  getContactUs(param?: any) {
    return this.webApi.get('api/app/manage-contact-us/contact-us', param);
  }
  getContactUsById(id?: any) {
    return this.webApi.get(`api/app/manage-contact-us/${id}/contact-us-by-id`);
  }
}