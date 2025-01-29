import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, first, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { AuthModel } from '../models/auth.model';

import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { WebApiService } from 'src/app/services/webApi.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Constants } from 'src/app/services/Constants/constants';
import { TranslationService } from 'src/app/i18n/translation.service';
import { getMessaging, onMessage } from 'firebase/messaging';
import { MessagingService } from 'src/app/services/api/messaging.service';
export type UserType = UserModel | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = [];
  private authLocalStorageToken = ``;
  public image: any;
  // public fields
  currentUser$: Observable<UserType>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserType>;
  isLoadingSubject: BehaviorSubject<boolean>;
  name: string;
  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserType) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private webApi: WebApiService,
    private spinner: NgxSpinnerService,
    private messagingService: MessagingService,
    private http: HttpClient,
    private router: Router,
    private translate: TranslationService,
    private toastr: ToastrService
  ) {
    this.checkIfneedToClearCache();
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);
  }

  singUp(body: any) {
    return this.webApi.post('api/app/manage-agent/register-agent', body);
  }

  resendEmail(email: string) {
    return this.webApi.post(
      `api/app/manage-service-provider/resend-confirmation-email?email=${email}`
    );
  }

  registration(body: any) {
    return this.webApi.post(
      'api/app/manage-agent/initiate-agent-registration',
      body
    );
  }

  resendCode(body: any) {
    return this.webApi.post(
      'api/app/manage-agent/resend-code-registration',
      body
    );
  }
  verificationCode(body: any) {
    return this.webApi.post(
      'api/app/manage-account/verify-verification-code-at-register',
      body
    );
  }

  verificationOtpCode(body: any) {
    return this.webApi.post(
      'api/app/manage-agent/registration-verification-code',
      body
    );
  }

  selectFreeTrialPackage(body: any) {
    return this.webApi.post(
      'api/app/manage-agent/select-free-trial-package-for-registerion',
      body
    );
  }

  selectPackage(body: any) {
    return this.webApi.post(
      'api/app/manage-agent/select-package',
      body
    );
  }

  manageIndustry() {
    return this.webApi.get('api/app/manage-industry');
  }
  getDataOfCurrentUser(body: string) {
    return this.webApi.get(
      `api/app/manage-account/data-of-user-log-in?email=${body}`
    );
  }

  ServiceProviderDeatiles(id: number) {
    return this.webApi.get(
      `api/app/manage-service-provider/${id}/service-provider-details`
    );
  }

  editServiceProviderDeatiles(body: any) {
    return this.webApi.post(
      'api/app/manage-service-provider/edit-service-provider',
      body
    );
  }

  checkPackageSelectedValid(id: any) {
    return this.webApi.get(`api/app/manage-package/${id}/check-if-package-selected-valid`);
  }

  changePassword(body: any) {
    return this.webApi.post('api/app/manage-account/change-password', body);
  }

  GetClinetById(id: any) {
    return this.webApi.get(`api/app/manage-client/${id}/client-by-id`);
  }
  getImage() {
    this.getcurrentUserApi().subscribe((res) => {
      this.image = res.imageUrl;
      return res.imageUrl;
    });
  }

  login(param: any) {
    sessionStorage.clear();
    // localStorage.clear();
    this.spinner.show();
    let body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('client_id', 'QYD_App');
    body.set('username', param.email);
    body.set('password', param.password);
    let headersConfig = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept-Language': this.translate.getSelectedLanguage(),
    };
    let options = {
      headers: new HttpHeaders(headersConfig),
    };
    this.http
      .post(`${environment.api_url}connect/token`, body.toString(), options)
      .subscribe({
        next: (auth: any) => {
          this.messagingService.requestPermission();
          this.listen();
          this.isLoadingSubject.next(auth);
          this.setAuthFromLocalStorage(auth);
          this.getcurrentUserApi()

            .pipe(
              finalize(() => {
                this.spinner.hide();

              })
            )
            .subscribe((res) => {
              this.name = res.data.name;
              this.roleAndPermissions(res.data);

              localStorage.setItem('cache-clear', '1');
            });
        },
        error: (mockError) => {
          setTimeout(() => {
            this.spinner.hide();
            this.toastr.error(mockError.error.error_description);
          }, 400);
        },
      });
  }
  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      setTimeout(() => {
        this.messagingService.getUnReadNotification();
      }, 1000);
      if (this.translate.getSelectedLanguage() === 'en') {
        this.toastr.info(payload?.notification?.body);
      } else {
        this.toastr.info(payload?.notification?.body);
      }

      if (
        payload.data?.NotificationType == '20' //BlockEmployee
      ) {
        this.logout();
      }
      if (
        payload.data?.NotificationType == '16' ||
        payload.data?.NotificationType == '17'
      ) {
        this.getConditionsToCurrentUser();
      }
      if (
        payload.data?.NotificationType == '10' ||
        payload.data?.NotificationType == '9'
      ) {
        setTimeout(() => {
          this.getcurrentUserApi().subscribe((res) => {
            this.name = res.data.name;
            this.roleAndPermissions(res.data, true);
          });
        }, 1000);
      }
    });
  }

  getConditionsToCurrentUser() {

    this.conditionsToCurrentUser().subscribe({
      next: (res) => {

        localStorage.setItem(
          'condtions-to-current-user',
          JSON.stringify(res.data)
        );
        this.translate.loadTranslations();
      },
      error: (err) => { },
    });
  }

  checkIfneedToClearCache() {
    if (!localStorage.getItem('cache-clear')) {
      this.authCache()
      //this.router.navigate(['/home']);
    }
  }

  authCache() {
    this.messagingService.deleteToken();
    localStorage.removeItem('access_token_quid');
    localStorage.removeItem('currentUserquid');
    localStorage.removeItem('firebaestokenQyd');
    localStorage.removeItem('authLocalStorageTokenquid');
    localStorage.removeItem('breadcrumbs');
    localStorage.removeItem('language)');
    localStorage.removeItem('lastInvoiceId');
    localStorage.removeItem('lastStatus');
    localStorage.removeItem('hasCalledService');
    localStorage.removeItem('isSubscription');
    localStorage.removeItem('statusOfToggleInUpgardePackage');
    localStorage.removeItem('isComplete');
    localStorage.removeItem('statusOfToggleLogin');
    localStorage.removeItem('isShowCompletedForm)');
    localStorage.removeItem('condtions-to-current-user');
    localStorage.removeItem(this.authLocalStorageToken);
  }

  logout() {
    this.authCache()
    this.router.navigate(['/auth/login']);
  }

  getUserByToken(): Observable<UserType> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.getcurrentUserApi().pipe(
      map((res) => {
        if (res.data.currentUser) {
          this.currentUserSubject.next(res.data?.currentUser);
          this.name = res.data.name;
        } else {
          this.logout();
        }
        return res.data?.currentUser;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  roleAndPermissions(
    data: any,
    isReload?: boolean,
    isFromChange?: boolean,
    noRedirect?: boolean
  ) {
    this.currentUserSubject.next(data['currentUser']);
    // admin
    if (
      data['currentUser']['roles'][0] === 'QYDEmployee' ||
      data['currentUser']['roles'][0] === 'QYDManager'
    ) {
      if (data['isManager'] == false) {
        data['currentUser']['roles'] = ['QYDEmployee'];
      } else {
        data['currentUser']['roles'] = ['QYDManager'];
      }
    }
    var currentUser = data['currentUser'];
    currentUser.customerType = data?.customerType;
    localStorage.setItem(
      'currentUserquid',
      JSON.stringify(currentUser)
    );
    this.getConditionsToCurrentUser();

    if (isReload) {
      window.location.reload();
    } else {
      // if (!noRedirect) {
      this.goToDefaultPage(data, isFromChange);
      // }
    }
  }

  goToDefaultPage(user: any, isFromChange?: boolean) {
    localStorage.setItem('isComplete', 'true');
    localStorage.setItem('isShowCompletedForm', user.isComplete);
    if (user.currentUser.roles[0] === Constants.AllRoles.qydSuperAdmin) {
      this.router.navigate(['/admin/user-managment']);
    } else if (
      user.isComplete &&
      user.currentUser.roles[0] === Constants.AllRoles.qydAgent
    ) {
      localStorage.setItem('isComplete', user.isComplete);
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/admin/departments/dashboard-managment']);
      });
    } else if (
      !user.isComplete &&
      user.currentUser.roles[0] === Constants.AllRoles.qydAgent
    ) {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/admin/departments/dashboard-managment']);
      });
    } else if (
      user.currentUser.roles[0] === Constants.AllRoles.employee ||
      user.currentUser.roles[0] === Constants.AllRoles.qYDManager
    ) {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/admin/departments/dashboard-managment']);
      });
    }
  }
  getcurrentUserApi() {
    return this.webApi.get('api/app/manage-account/current-user').pipe(
      catchError((err) => {
        if (err.message.includes('Http failure during parsing for')) {
          this.logout();
          this.router.navigate(['/auth/login']);
        }
        return of({});
      })
    );
  }
  getUserEmails() {
    return this.webApi.get('api/app/manage-account/user-emails-lookups');
  }
  // private methods
  private setAuthFromLocalStorage(auth: AuthModel): boolean {
    // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.access_token) {
      localStorage.setItem('authLocalStorageTokenquid', JSON.stringify(auth));
      localStorage.setItem('access_token_quid', `Bearer ${auth.access_token}`);
      return true;
    }
    return false;
  }

  getAuthFromLocalStorage(): AuthModel | undefined {
    try {
      const lsValue = localStorage.getItem('authLocalStorageTokenquid');
      if (!lsValue) {
        return undefined;
      }
      const authData = JSON.parse(lsValue);
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  getCurrentUser() {
    let currentUserObject = window.localStorage.getItem('currentUserquid');
    return JSON.parse(currentUserObject!);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  // Activate email api
  ActivateCode(ConfirmEmailTokenId: any) {
    return this.webApi.post(
      `api/app/manage-account/confirm-email/${ConfirmEmailTokenId}`
    );
  }

  // Forget password api
  forgetPassword(email: string) {
    return this.webApi.post(
      `api/app/manage-account/forget-password?email=${email}`
    );
  }

  // Reset passowrd api
  resetPassword(body: any, token: any) {
    return this.webApi.post(`api/app/manage-account/reset-password`, {
      email: body.email,
      password: body.password,
      resetPasswordToken: token,
    });
  }

  isUsedLinkReset(token: any) {
    return this.webApi.post(
      `api/app/manage-account/is-used-link-reset-password?resetPasswordToken=${token}`
    );
  }
  conditionsToCurrentUser() {
    return this.webApi.get(`api/app/manage-package/conditions-to-current-user`);
  }
}
