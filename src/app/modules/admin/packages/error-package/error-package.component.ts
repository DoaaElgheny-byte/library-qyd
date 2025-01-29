import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/modules/auth';
import { Constants } from 'src/app/services/Constants/constants';

@Component({
  selector: 'app-error-package',
  templateUrl: './error-package.component.html',
  styleUrls: ['./error-package.component.scss']
})
export class ErrorPackageComponent implements OnInit {
  messageKey:String
  currentUser: any;
isValid:boolean
  isEmployee: boolean;

  constructor(private activatedRoute:ActivatedRoute,
    private authService: AuthService,

  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if ((this.currentUser.roles[0] == Constants.AllRoles.employee )|| (this.currentUser.roles[0] == Constants.AllRoles.qYDManager)) {
      this.isEmployee = true;
    } else {
      this.isEmployee = false;
    }
    this.activatedRoute.queryParams.subscribe(params => {
      this.messageKey=params['key']
  });
  }

}
