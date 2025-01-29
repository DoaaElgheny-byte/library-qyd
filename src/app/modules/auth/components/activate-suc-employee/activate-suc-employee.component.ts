import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-activate-suc-employee',
  templateUrl: './activate-suc-employee.component.html',
  styleUrls: ['./activate-suc-employee.component.scss']
})
export class ActivateSucEmployeeComponent implements OnInit, OnDestroy {

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
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.token = params.get('userConfirmationEmailToken');
      debugger
      this.authService.ActivateCode(this.token).subscribe({
        next: (user) => {
          this.msg = user
          if (user.success) {
            this.spinner.hide();
          } else {
            this.spinner.hide();
            this.toastr.error(user.message);
          }

        },
        error: (err) => {
          this.spinner.hide();
          this.toastr.error(err.error.error.message);
          this.router.navigate(['/auth/forgot-password']);
        },
      });
    });
  }

  logIn() {
    this.router.navigate([`auth/forgot-password`]);
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => {
      sb.unsubscribe();
    });
  }
}
