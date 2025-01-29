import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { tap, mergeMap } from 'rxjs/operators';
import { Observable, from } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { TranslationService } from '../i18n/translation.service';


@Injectable({
  providedIn: 'root',
})
export class WebApiService {
  constructor(
    private http: HttpClient,
    private translate: TranslationService,
    private router: Router
  ) { }

  public async setHeaders(file = false): Promise<HttpHeaders> {
    let headersConfig;
    if (file) {
      headersConfig = {};

    } else {
      headersConfig = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': this.translate.getSelectedLanguage(),
        Authorization: `${localStorage.getItem('access_token_quid')}`,
      };
    }
    return new HttpHeaders(headersConfig);
  }

  private logError(path: string, error: any) {
    if (error.status == 400) {
      // this.router.navigate(['/error/404']);
    }
    if (error.status == 500) {
      this.router.navigate(['/error/500']);
    }
  }

  private log(path: string, res: any) {

  }

  get(path: string, params?: HttpParams) {
    return from(this.setHeaders()).pipe(
      mergeMap((headers: HttpHeaders) =>
        this.http
          .get(`${environment.api_url}${path}`, { headers: headers, params })
          .pipe(
            tap({
              next: (res: any) => this.log(path, res),
              error: (error) => this.logError(path, error),
            })
          )
      )
    );
  }

  post(path: string, body: Object = {}) {
    return from(this.setHeaders()).pipe(
      mergeMap((headers: HttpHeaders) =>
        this.http
          .post(`${environment.api_url}${path}`, body, { headers: headers })
          .pipe(
            tap({
              next: (res: any) => this.log(path, res),
              error: (error) => this.logError(path, error),
            })
          )
      )
    );
  }

  put(path: string, body: Object = {}) {
    return from(this.setHeaders()).pipe(
      mergeMap((headers: HttpHeaders) =>
        this.http
          .put(`${environment.api_url}${path}`, body, {
            headers: headers,
          })
          .pipe(
            tap({
              next: (res: any) => this.log(path, res),
              error: (error) => this.logError(path, error),
            })
          )
      )
    );
  }

  delete(path: string, params?: HttpParams) {
    return from(this.setHeaders()).pipe(
      mergeMap((headers: HttpHeaders) =>
        this.http
          .delete(`${environment.api_url}${path}`, {
            headers: headers,
            params,
          })
          .pipe(
            tap({
              next: (res: any) => this.log(path, res),
              error: (error) => this.logError(path, error),
            })
          )
      )
    );
  }

  postFile(path: string, body: Object = {}): Observable<ResultViewModel> {
    return from(this.setHeaders(true)).pipe(
      mergeMap((headers: HttpHeaders) =>
        this.http
          .post<ResultViewModel>(`${environment.api_url}${path}`, body, {
            headers: headers,
          })
          .pipe(
            tap({
              next: (res: any) => this.log(path, res),
              error: (error) => this.logError(path, error),
            })
          )
      )
    );
  }
}

export interface ResultViewModel { }
