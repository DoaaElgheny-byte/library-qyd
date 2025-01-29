import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-activate-suc',
  templateUrl: './activate-suc.component.html',
  styleUrls: ['./activate-suc.component.scss'],
})
export class ActivateSucComponent implements OnInit, OnDestroy {
  token: any;
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }
  msg: any
  ngOnInit(): void {
    this.spinner.show();
    debugger
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.token = params.get('userConfirmationEmailToken');
      this.authService.ActivateCode(this.token).subscribe({
        next: (user) => {
          this.msg = user
          if (user.success) {
            this.spinner.hide();
          } else {
            this.spinner.hide();
            this.toastr.error(user.message);
            // this.router.navigate(['/auth/login']);
          }

        },
        error: (err) => {
          this.spinner.hide();
          this.toastr.error(err.error.error.message);
          this.router.navigate(['/auth/login']);
        },
      });
    });
  }

  logIn() {
    this.router.navigate([`auth/login`]);
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => {
      sb.unsubscribe();
    });
  }
}
