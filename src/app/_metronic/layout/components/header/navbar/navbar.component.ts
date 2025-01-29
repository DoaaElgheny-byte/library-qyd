import { registerLocaleData } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/modules/auth/models/user.model';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { CompleteProfileService } from 'src/app/modules/auth/services/complete-profile.service';
import { Constants } from 'src/app/services/Constants/constants';
import { BranchesService } from 'src/app/services/api/branches.service';
import { MessagingService } from 'src/app/services/api/messaging.service';
import { VisibilityService } from 'src/app/services/api/mimize-browser.service';
import { NotificationService } from 'src/app/services/api/notification.service';
import { AccountTypes } from 'src/app/services/enums/accountType.enum';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Input() appHeaderDefaulMenuDisplay: boolean;
  @Input() isRtl: boolean;

  itemClass: string = 'ms-1 ms-lg-3';
  btnClass: string =
    'btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px';
  userAvatarClass: string = 'symbol-35px symbol-md-40px';
  btnIconClass: string = 'svg-icon-1';
  currentUser: any;
  isNotifactionDisabled: boolean;

  user: UserModel;
  lang: string = String(localStorage.getItem('language'));
  profileData: any;
  messageNo: number;
  notActiveBranches: any;
  branches: any[] = [];
  showBranches: boolean;
  allRoles: any = Constants.AllRoles;
  accountTypes = AccountTypes;
  userType: string;
  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private branchesService: BranchesService,
    private messagingService: MessagingService,
    private completeProfileservice: CompleteProfileService,
    private notiicationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.isNotifactionDisabled = JSON.parse(localStorage.getItem('isShowCompletedForm') || 'false');
    this.authService.listen();
    this.authService.getCurrentUser();

    this.currentUser = this.authService.getCurrentUser();
    if (
      this.currentUser.roles[0] == Constants.AllRoles.qydSuperAdmin
    ) this.isNotifactionDisabled = true
    if (
      this.currentUser.roles[0] == Constants.AllRoles.qYDManager ||
      this.currentUser.roles[0] == Constants.AllRoles.employee
    ) {
      if (this.currentUser.roles[0] == Constants.AllRoles.qYDManager) this.userType = 'users.QYDManager'
      if (this.currentUser.roles[0] == Constants.AllRoles.employee) this.userType = 'users.QYDEmployee'

      this.showBranches = true;
      this.getBranches();
    }
    if (this.currentUser.roles[0] == Constants.AllRoles.qydAgent) {
      this.completeProfileservice.getDataOfCompleteInfo(0).subscribe({
        next: (next) => {
          this.profileData = next.data;
          if (this.profileData != null) {
            if (this.profileData.accountType == this.accountTypes.Advisor) this.userType = 'package.advisor';
            if (this.profileData.accountType == this.accountTypes.LawyerOffice) this.userType = 'package.lawyerOffice';
            if (this.profileData.accountType == this.accountTypes.LegalDepartment) this.userType = 'register.LegalDepartment';
            if (this.profileData.accountType == this.accountTypes.Traininglawyer) this.userType = 'register.Traininglawyer';
            if (this.profileData.accountType == this.accountTypes.Licensedlawyer) this.userType = 'register.Licensedlawyer';
            if (this.profileData.accountType == this.accountTypes.LegalAdministration) this.userType = 'register.LegalAdministration';
            if (this.profileData.accountType == this.accountTypes.RegularRepresentative) this.userType = 'register.RegularRepresentative';
            if (this.profileData.accountType == this.accountTypes.All) this.userType = 'LogIn.qydAgent';
          }
        },
      });

    }
    this.authService.getConditionsToCurrentUser()
    this.getNotificationCount();
    // this.visibilityService.visibilityChange$.subscribe((isVisible:any) => {
    //   if (isVisible) {
    //     this.authService.getcurrentUserApi().subscribe((res) => {
    //       this.authService.roleAndPermissions(res.data, false,true);
    //     });
    //   }
    // });
  }
  getBranches() {
    this.branchesService.activeBranches().subscribe({
      next: (next) => {
        this.branches = next.data;

        this.notActiveBranches = this.branches.find(
          (x: any) => x.isActive === true
        );
        this.cdr.detectChanges();
      },
    });
  }
  onItemSelect(item: any) {
    this.branchesService.setActiveBranch(item.id).subscribe({
      next: (next) => {
        this.getBranches();
        this.authService.getcurrentUserApi().subscribe((res) => {
          this.authService.roleAndPermissions(res.data, false, true);
          this.cdr.detectChanges();
        });
      },
    });
  }
  logout() {
    this.authService.logout();
  }
  getNotificationCount() {
    this.messagingService.getUnReadNotification();
    this.messagingService.messageNo$.subscribe((messageNo) => {
      this.messageNo = messageNo;
      this.cdr.detectChanges()
    });

  }
  resetCount() {
    if (this.messageNo > 0) {
      this.notiicationService.resetCount().subscribe({
        next: next => {
          this.getNotificationCount()
        }
      })
    }
  }

}
