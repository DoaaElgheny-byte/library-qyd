import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  NgbDate,
  NgbTimeStruct,
  NgbTimepickerConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subscription } from 'rxjs';
import { PageInfoService } from 'src/app/_metronic/layout';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';
import { ConfirmationDialogService } from 'src/app/modules/SharedComponent/SharedComponent/confirmation-dialog/confirmation-dialog.service';
import { AuthService } from 'src/app/modules/auth';
import { Constants } from 'src/app/services/Constants/constants';
import { IssuesService } from 'src/app/services/api/issues.service';
import { PackageManagementService } from 'src/app/services/api/package-management.service';
import { SittingManagementService } from 'src/app/services/api/sitting-management.service';
import { CourtType, EntityType, LawsuitType, LawsuitTypeEnum, MainCourtType } from 'src/app/services/enums/lawsuit';
import { SittingState, SittingStatus } from 'src/app/services/enums/sitting';
import { SittingType } from 'src/app/services/enums/sitting-type.enum';
const pad = (i: number): string => (i < 10 ? `0${i}` : `${i}`);

@Component({
  selector: 'app-manage-sitting',
  templateUrl: './manage-sitting.component.html',
  styleUrls: ['./manage-sitting.component.scss'],
})
export class ManageSittingComponent implements OnInit {
  courtTypeEnum = CourtType;
  sittingTypeEnum = SittingType;
  issueTypes = LawsuitTypeEnum;
  sittingStatusEnum = SittingStatus;
  sittingState = SittingState;
  sittingNumber = '';
  courtType = '';
  committeeId = '';
  LawsuitId = '';
  lawsuitType = '';
  searchText: string = '';
  sittingName: string = '';
  sittingNo: string = '';
  sittingStatus = '';
  sittingType = '';
  StartDate: string;
  court: string = '';
  dateText: any;
  startTime: NgbTimeStruct = { hour: 13, minute: 30, second: 0 };
  time = '';
  State: string = '';
  page: number = 1;
  pageSize: number = 10;
  allUsers: any[] = [];
  filterObj = this.initFilterObj();
  totalCount: number;
  lang: string | null = localStorage.getItem('language');
  fromSearchInput: boolean = false;
  mainCourt: any;
  isEmployee: boolean;
  currentUser: any;
  committee: any;
  showCourt: boolean = true;
  branches: any;
  isAgent: boolean;
  BranchId = '';
  lawaist: any;
  entityList: any
  entityType = EntityType;
  IsDraft: any = '';
  isShowsessions: boolean = false;

  constructor(
    private sittingservice: SittingManagementService,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private bradecrumbservice: PageInfoService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router,
    private translate: TranslateService,
    public datepipe: DatePipe,
    private config: NgbTimepickerConfig,
    private authService: AuthService,
    private breadcrumbService: BreadcrumbService,
    private issueservice: IssuesService,
    private managePackageService: PackageManagementService,
  ) {
    config.seconds = false;
    config.spinners = true;
  }

  ngOnInit(): void {
    this.spinner.show();
    this.managePackageService.getConditionsForAgent().pipe(finalize(() => { this.spinner.hide() })).subscribe(res => {
      let result = res.data;
      result.forEach((item: any) => {
        if (item.conditionId === 6) {
          this.isShowsessions = true;
        }
      });
      if (this.isShowsessions) {
        this.breadcrumbService.restoreBreadcrumbsFromStorage();
        this.currentUser = this.authService.getCurrentUser();
        if (this.currentUser.roles[0] == Constants.AllRoles.employee) {
          this.isEmployee = true;
        } else if (this.currentUser.roles[0] == Constants.AllRoles.qYDManager) {
          this.isEmployee = false;
        } else {
          this.isAgent = true;
          this.isEmployee = false;
        }
        this.getEntityList()
        this.getCommittee();
        this.getBranchList();
        this.getAllUsersData();
      } else {
        this.router.navigate(['/agent/error-package'], {
          queryParams: { key: 'Finish' },
        });
      }
    });


  }

  getEntityList() {
    this.entityList = Object.keys(this.entityType)
      .filter(
        (key) =>
          !isNaN(Number(this.entityType[key as keyof typeof this.entityType]))
      )
      .map((key) => ({
        id: Number(this.entityType[key as keyof typeof this.entityType]),
        name: key,
      }));
  }
  isCourt: boolean = false
  isCommittee: boolean = false
  selectEntity(e: any) {
    if (e == this.entityType['addIssue.Committee']) {
      this.isCommittee = true;
      this.isCourt = false
    } else if (
      e == this.entityType['addIssue.AdministrativeCourt'] ||
      e == this.entityType['addIssue.GeneralCourt'] ||
      e == this.entityType['addIssue.MinistryOfHumanResources']
    ) {
      this.isCommittee = false;
      this.isCourt = true
      this.getCourt(e);
    } else {
      this.isCommittee = false;
      this.isCourt = false
    }
  }
  courts: any
  mainCourtEnum = MainCourtType
  //get main court
  getCourt(courtType: any) {
    if (courtType == this.entityType['addIssue.MinistryOfHumanResources']) {
      courtType = this.mainCourtEnum.MinistryOfHumanResources
    }
    this.issueservice.getCourtByType(courtType).subscribe({
      next: (next) => {
        if (next.success) {
          this.spinner.hide();
          this.courts = next.data;
          this.cdr.detectChanges();
        }
      },
    });
  }
  committeeList: any
  //get get Committee
  getCommittee() {
    this.issueservice.getCommittee().subscribe({
      next: (next) => {
        this.spinner.hide();
        this.committeeList = next.data;
      },
    });
  }

  //getPlace
  getPlace(id: any) {
    let entity = this.entityList.filter((key: any) =>
      key.id === id)
    return entity[0].name;
  }
  //get Lawait list
  getLawistList(e?: any) {

    this.LawsuitId = '';
    this.getAllUsersData();
    this.sittingservice.getLawsuitInBranch(this.BranchId).subscribe({
      next: (next) => {
        this.spinner.hide();
        this.lawaist = next.data;
        this.cdr.detectChanges();
      },
    });
  }
  //get main court
  getMainCourt() {
    this.sittingservice.getCourt().subscribe({
      next: (next) => {
        this.spinner.hide();
        this.mainCourt = next.data;
        this.cdr.detectChanges();
      },
    });
  }

  getBranchList() {
    this.sittingservice.getBranch().subscribe({
      next: next => {
        this.branches = next.data
        this.cdr.detectChanges();
      }
    })
  }
  keyPressNumbers(event: any) {
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
  getShortName(fullName: string) {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .join('');
  }
  setBreadcrumb() {
    let bc = [
      { title: 'home', path: '/agent', isActive: true, isSeparator: true },
      {
        title: 'sitting',
        path: '/agent/court-sessions',
        isActive: false,
        isSeparator: false,
      },
    ];
    this.bradecrumbservice.setBreadcrumbs(bc);
  }

  initFilterObj() {
    return {
      Name: this.sittingName,
      SittingStatus: this.sittingStatus,
      SittingType: this.sittingType,
      CourtType: this.courtType,
      CourtId: this.court,
      CommitteeId: this.committeeId,
      StartDate: this.StartDate,
      StartTime: this.time,
      LawsuitId: this.LawsuitId,
      LawsuitType: this.lawsuitType,
      BranchId: this.BranchId,
      Sorting: 'id',
      SkipCount: 0,
      MaxResultCount: this.pageSize,
      IsDraft: this.IsDraft
    };
  }
  to: any;
  from: any;
  returnTime(time: any) {
    return `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`;
  }
  tConvert(time: any) {
    // Check correct time format and split into components
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;
    const matches = time.toString().match(timePattern);

    if (matches) {
      // If time format is correct
      const hours = parseInt(matches[1], 10);
      const minutes = parseInt(matches[2], 10);
      const period = hours < 12 ? 'AM' : 'PM';

      // Adjust hours to 12-hour format
      const adjustedHours = (hours % 12) || 12;

      // Format the time as "hh:mm tt"
      const formattedTime = `${adjustedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
      this.time = `${formattedTime}`;
      this.cdr.detectChanges();
    }
    this.cdr.detectChanges(); // return adjusted time or original string
  }
  getAllUsersData() {
    if (!this.fromSearchInput) {
      this.spinner.show();
    }
    if (this.courtType != '') {
      if (this.courtType == this.courtTypeEnum.Committee.toString()) {
        this.showCourt = false;
        this.court = '';
      } else {
        this.showCourt = true;
        this.committeeId = '';
      }
    } else {
      this.court = '';
      this.committeeId = '';
    }
    if (this.StartDate != null && this.StartDate != '') {
      this.to = this.StartDate;

      let myDate2 = this.to;
      const date2: NgbDate = new NgbDate(
        myDate2.year,
        myDate2.month,
        myDate2.day
      );
      const jsDate2 = new Date(date2.year, date2.month - 1, date2.day);
      this.to = this.datepipe.transform(jsDate2, 'yyyy-MM-dd');
    } else {
      this.to = '';
    }
    if (this.sittingStatus == '0') {
      this.sittingStatus = '';
      (this.filterObj.IsDraft = true)
    } else {
      if (this.sittingStatus) {
        if (this.sittingStatus == (this.sittingStatusEnum.All).toString()) {
          this.filterObj.IsDraft = ''
        } else {
          this.filterObj.IsDraft = false;
        }
      }
      else {
        this.filterObj.IsDraft = '';
      }
    }
    const startIndex = (this.page - 1) * this.pageSize;
    this.filterObj.SkipCount = startIndex;
    (this.filterObj.CourtId = this.court),
      (this.filterObj.MaxResultCount = this.pageSize);
    (this.filterObj.Name =
      this.sittingName !== undefined || this.sittingName != null
        ? this.sittingName
        : ''),

      (this.filterObj.SittingStatus = this.sittingStatus),
      (this.filterObj.StartDate = this.to),
      (this.filterObj.StartTime = this.time != '' ? this.time : ''),
      (this.filterObj.SittingType = this.sittingType),
      (this.filterObj.CourtType = this.courtType),
      (this.filterObj.LawsuitType = this.lawsuitType),
      (this.filterObj.LawsuitId = this.LawsuitId),
      (this.filterObj.CommitteeId = this.committeeId),
      (this.filterObj.BranchId = this.BranchId),
      this.sittingservice.searchSitting(this.filterObj).subscribe({
        next: (next) => {
          this.allUsers = next.data.items;
          this.totalCount = next.data.totalCount;

          this.spinner.hide();
          this.cdr.detectChanges();
        },
      });
  }
  addNew() {
    this.router.navigate([
      '/agent/departments/court-sessions/add-edit-court-sessions',
    ]);
  }
  edit(id: any) {
    this.router.navigate([
      '/agent/departments/court-sessions/add-edit-court-sessions', 0,
      id,
    ]);
  }
  view(id: any, tab: any) {
    this.router.navigate([
      '/agent/departments/court-sessions/view-court-sessions',
      id,
      tab,
    ]);
  }

  changAccountState(user: any) {
    let oldVal = user.state;
    user.state =
      user.state == this.sittingState.Active
        ? this.sittingState.Inactive
        : this.sittingState.Active;

    this.confirmationDialogService
      .confirm(
        this.translate.instant('sitting.confirmModalTitle'),
        this.translate.instant('sitting.activeMessage'),
        '',
        false
      )
      .then(
        (confirmed: any) => {
          this.spinner.show();
          let userstate = { id: user.id, state: user.state };
          if (confirmed) {
            this.sittingservice.changeStatus(userstate).subscribe(
              (data) => {
                this.spinner.hide();
                this.toastr.success(
                  this.translate.instant('sitting.changeAccountStatus')
                );
                this.getAllUsersData();
              },
              (err) => {
                this.spinner.hide();
                this.toastr.error(err.error.error.message);

              }
            );
          } else {
            user.state = oldVal;
            this.getAllUsersData();
            this.cdr.detectChanges();
          }
        },
        () => {
          user.state = oldVal;
          this.getAllUsersData();
          this.cdr.detectChanges();
        }
      );
  }
  private unsubscribe: Subscription[] = [];
  send(id: any) {
    this.spinner.show();
    this.sittingservice.sendReportToClient(id).subscribe({
      next: (next) => {
        this.spinner.hide();

        this.toastr.info(this.translate.instant('sitting.sendSuccess'));
      },
      error: (error) => {
        this.spinner.hide();
        this.toastr.error(error.error.error.message);
      },
    });
  }
  assigned(id: any) {
    this.router.navigate([
      '/agent/departments/court-sessions/assigned-case',
      id,
    ]);
  }
  report(id: any) {
    this.router.navigate([
      '/agent/departments/court-sessions/report',
      id,
    ]);
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
