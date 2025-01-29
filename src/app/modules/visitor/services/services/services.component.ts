import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth';
import { Constants } from 'src/app/services/Constants/constants';
import { Title } from '@angular/platform-browser';
declare let AOS: any;

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  currentUser: any;
  allRoles = Constants.AllRoles
  role: String;
  lang: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    AOS.init()

    this.lang = String(localStorage.getItem('language'));
    
    // Setting page title
    let title = "QYD | Services";
    if (this.lang === "ar"){
      title = "قيد | الخدمات";
    }
    this.titleService.setTitle(title);

    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser?.roles[0] === Constants.AllRoles.qydSuperAdmin) {
      this.role = Constants.AllRoles.qydSuperAdmin;
    } else if (this.currentUser?.roles[0] === Constants.AllRoles.employee) {
      this.role = Constants.AllRoles.employee;
    } else if (this.currentUser?.roles[0] === Constants.AllRoles.qydAgent) {
      this.role = Constants.AllRoles.qydAgent;
    }
  }
  goToRegister() {
    if (this.role === this.allRoles.qydAgent && this.currentUser) {
      this.router.navigate(['/agent/upgrade-package'])
    } else {
      this.router.navigate(['/auth/register'])

    }
  }
}
