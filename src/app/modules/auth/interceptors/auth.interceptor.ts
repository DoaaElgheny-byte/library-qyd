import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService,
        private modalService: NgbModal,
        private spinner: NgxSpinnerService) { }

    private isTokenExpired(token: string): boolean {
        try {
            const expiry = JSON.parse(atob(token.split('.')[1])).exp;
            return Math.floor(new Date().getTime() / 1000) >= expiry;
        } catch (e) {
            return true;
        }
    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const auth = this.authService.getAuthFromLocalStorage();
        const token = auth?.access_token;
        if (token) {
            if (this.isTokenExpired(token)) {
                this.spinner.hide();
                this.modalService.dismissAll();
                this.authService.logout();
                return EMPTY;
            }

            const clonedRequest = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return next.handle(clonedRequest);
        }
        return next.handle(req);
    }
}
