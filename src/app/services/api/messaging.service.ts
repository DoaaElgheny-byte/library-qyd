import { ChangeDetectorRef, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { getMessaging, getToken } from 'firebase/messaging';
import { WebApiService } from '../webApi.service';
@Injectable({ providedIn: 'root' })
export class MessagingService {
  currentLanguage: string;
  currentMessage = new BehaviorSubject(null);
  private messageNo = new BehaviorSubject<number>(0);
  messageNo$ = this.messageNo.asObservable();

  constructor(private webApi: WebApiService,

  ) { }

  requestPermission() {

    const messaging = getMessaging();

    getToken(messaging, {
      vapidKey:
        'BKdY5cNmzkdQWIADqNin9u3mgCp4bNAlZr-ANi6R-xaWkybjhtbhJ1yUv3gYwZcy0Dv3vsrfI3FgXz_2eztcRnw',
    })
      .then((currentToken) => {
        if (currentToken) {

          localStorage['firebaestokenQyd'] = currentToken;
          var obj = { deviceId: currentToken };
          this.webApi
            .post(`api/app/manage-token/token`, obj)
            .subscribe((re) => {

            });
        } else {
          localStorage['firebaestokenQyd'] = null;
        }
      })
      .catch((err) => {
      });
  }
  deleteToken() {
    //
    if (localStorage['firebaestokenQyd'] != null) {
      return this.webApi
        .delete(`api/app/manage-token?deviceId=${localStorage['firebaestokenQyd']}`)
        .subscribe((re) => {
          localStorage['firebaestokenQyd'] = null;
        });
    }

  }

  getUnReadNotification() {
    return this.webApi
      .get(`api/app/manage-notification/un-read-notifications-count`)
      .subscribe((re) => {

        this.messageNo.next(re.data);

      });
  }

  getReadNotifications(id: number) {
    return this.webApi
      .post(`api/app/manage-notification/read-notification/${id}`)

  }
}
