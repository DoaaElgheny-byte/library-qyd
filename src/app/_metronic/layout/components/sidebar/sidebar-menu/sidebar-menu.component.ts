import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from 'src/app/i18n';
import { AuthService, UserModel } from 'src/app/modules/auth';
import { Constants } from 'src/app/services/Constants/constants';
import { ConditionType } from 'src/app/services/enums/payment-conditions.enum';
import { CustomerType } from 'src/app/services/enums/contractStatus.enum';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
})
export class SidebarMenuComponent implements OnInit {
  currentUser: any;
  isAdmin: boolean;
  packageData: any;
  isEmployee: boolean;
  isShowBranch: boolean;
  isShowEmployee: boolean;
  user: UserModel;
  allRoles: any = Constants.AllRoles;
  CustomerTypes = CustomerType;
  constructor(private authService: AuthService, private router: Router, private translate: TranslationService,
  ) { }
  lang: string = String(localStorage.getItem('language'));
  isShowSideBar: boolean;

  ngOnInit() {
    this.isShowSideBar = JSON.parse(localStorage.getItem('isShowCompletedForm') || 'false');
    if (localStorage.getItem('condtions-to-current-user')) {

      let packageCondition = localStorage.getItem(
        'condtions-to-current-user'
      );
      let packageData = JSON.parse(packageCondition!);

      let rowBranch = packageData.getConditions.find((i: any) => i.conditionType == ConditionType.BranchManagment)
      let rowEmployee = packageData.getConditions.find((i: any) => i.conditionType == ConditionType.EmployeeManagment)

      if (packageData?.isMain || rowBranch?.originalValue == 0) {
        this.isShowBranch = false;
      } else {
        this.isShowBranch = true;

      }
      if (packageData?.isMain || rowEmployee?.originalValue == 0) {
        this.isShowEmployee = true;
      } else {
        this.isShowEmployee = true;
      }
    }
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser.roles[0] == Constants.AllRoles.qydSuperAdmin) {
      this.isAdmin = true;
      this.isShowSideBar = true;
    } else if (this.currentUser.roles[0] == Constants.AllRoles.employee) {
      this.isAdmin = false;
      this.isEmployee = true;
    } else {
      this.isAdmin = false;
      this.isEmployee = false;
    }
  }

  inValid() {
    let packageCondition = localStorage.getItem(
      'condtions-to-current-user'
    );
    let packageData = JSON.parse(packageCondition!);
    console.log(packageData);

    let rowBranch = packageData.getConditions.find((i: any) => i.conditionType == ConditionType.BranchManagment)
    console.log(rowBranch);

    if (packageData.isMain || rowBranch?.originalValue == 0) {
      this.isShowBranch = false;
      this.router.navigate(['/agent/error-package'], {
        queryParams: { key: 'inValid' },
      });
    } else {
      this.isShowBranch = true;
      this.router.navigate(['/agent/departments/branches']);
    }
  }
  logout() {
    this.authService.logout();
  }
  calculateMenuItemCssClass(url: string): string {
    return checkIsActive(this.router.url, url) ? 'activate' : '';
  }
}
const checkIsActive = (pathname: string, url: string) => {
  const current = getCurrentUrl(pathname);
  if (!current || !url) {
    return false;
  }

  if (current === url) {
    return true;
  }

  if (current.indexOf(url) > -1) {
    return true;
  }

  return false;
};
const getCurrentUrl = (pathname: string): string => {
  return pathname.split(/[?#]/)[0];
};
