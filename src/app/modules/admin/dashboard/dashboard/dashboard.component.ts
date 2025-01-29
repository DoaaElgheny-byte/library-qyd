import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Chart, registerables } from 'node_modules/chart.js';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { CompleteProfileService } from 'src/app/modules/auth/services/complete-profile.service';
import { Constants } from 'src/app/services/Constants/constants';
import { DashboardService } from 'src/app/services/api/dashboard.service';
import { SittingManagementService } from 'src/app/services/api/sitting-management.service';
import { WorkDutyService } from 'src/app/services/api/work-duty.service';
import { AccountTypes } from 'src/app/services/enums/accountType.enum';
import { ClientType } from 'src/app/services/enums/client';
import { EntityType, LawsuitTypeEnum } from 'src/app/services/enums/lawsuit';
import { SittingStatus } from 'src/app/services/enums/sitting';
import { WorkDutyStatus } from 'src/app/services/enums/work-duty.enum';
import { Title } from '@angular/platform-browser';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  myChart: any = null;
  myChart2: any = null;
  myChart3: any = null;
  myChart4: any = null;
  progressValue = 40;
  clients: any;
  contracts: any;
  lawisute: any;
  sitting: any;
  branch: any;
  isSitting: boolean = false;
  filterObj = this.initFilterObj();
  allSitting: any;
  allWorkDuty: any;
  filterObjWorkduty = this.initFilterObjWorkDuty();
  sittingStatusEnum = SittingStatus;
  clientTypeEnum = ClientType;
  issueTypes = LawsuitTypeEnum;
  show: boolean;
  currentUser: any;
  allRoles: any = Constants.AllRoles;
  name: string;
  accountType: any;
  entity: EntityType;
  isShowCompletedForm: boolean | null = null;
  isLoading: boolean = true;  // Add a loading flag
  lang: string = ""
  constructor(
    private _dashboardService: DashboardService,
    private sittingService: SittingManagementService,
    private cdr: ChangeDetectorRef,
    private workDutyService: WorkDutyService,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private router: Router,
    private completeProfileService: CompleteProfileService,
    private titleService: Title,
    private route: ActivatedRoute,

  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.lang = String(localStorage.getItem('language')) || 'ar';
    // Setting page title
    let title = "QYD | The digital partner for your legal business";
    if (this.lang === "ar") {
      title = "قيد | الشريك الرقمي لإدارة أعمالك القانونية";
    }
    this.titleService.setTitle(title);
    debugger
    this.currentUser = this.authService.getCurrentUser();
    this.isShowCompletedForm = null;
    this.authService.getcurrentUserApi().pipe(finalize(() => {
      this.spinner.hide();
      this.isLoading = false;
    })).subscribe((res) => {
      this.accountType = res.data.accountType;

      if ((this.accountType == AccountTypes.LawyerOffice
        || this.accountType == AccountTypes.RegularRepresentative
        || this.accountType == AccountTypes.LegalDepartment
      ) && !res.data.isComplete) {
        localStorage.setItem('isShowCompletedForm', 'false')
        this.isShowCompletedForm = JSON.parse(localStorage.getItem('isShowCompletedForm') || 'false');
        if (this.currentUser.roles[0] == Constants.AllRoles.qydSuperAdmin) {
          this.isShowCompletedForm = true
          this.router.navigate(['/admin/departments/package-managment']);
        }
        else {
          this.name = this.authService.name;
          this.changeButton(this.isSitting);
          this.getEntityList();
          this.getAllData();
        }
      } else {
        localStorage.setItem('isShowCompletedForm', 'true');
        if (
          this.currentUser.roles[0] != Constants.AllRoles.qydSuperAdmin
          && this.currentUser.roles[0] != Constants.AllRoles.employee
          && this.currentUser.roles[0] != Constants.AllRoles.qYDManager
        ) {
          this.completeProfileService.getAgencyIsComplete(this.currentUser.id).subscribe(res => {
            if (!res) {
              this.completeProfileService.editAgencyIsComplete(this.currentUser.id).subscribe(res => {
                this.completeProfileService.sendFreeTrial().subscribe(res => {
                })
              })
            }
          })
        }

        this.isShowCompletedForm = JSON.parse(localStorage.getItem('isShowCompletedForm') || 'true');
        if (this.currentUser.roles[0] == Constants.AllRoles.qydSuperAdmin) {
          this.isShowCompletedForm = true
          this.router.navigate(['/admin/departments/package-managment']);
        }
        else {
          this.name = this.authService.name;
          this.changeButton(this.isSitting);
          this.getEntityList();
          this.getAllData();
        }
      }
    });
  }

  showFinalStep() {
    debugger
    //this.router.navigate(['/auth/after-register'])
    this.router.navigate(['/auth/register/after-registerion']);
    // this.router.navigate(['/auth/register/complete-info']);
  }
  precentage(precent: any) {
    return Math.round(precent * 10) / 10;
  }
  sittingDetails(item: any) {
    this.router.navigate([
      '/agent/departments/court-sessions/view-court-sessions',
      item.id,
      1,
    ]);
  }
  dutyDetails(item: any) {
    this.router.navigate([
      '/agent/departments/work-duty/view-workDuty',
      item.id,
      'view',
    ]);
  }

  getAllData() {
    this.spinner.show();
    if (
      this.currentUser.roles[0] !== this.allRoles.employee &&
      this.currentUser.roles[1] !== this.allRoles.employee &&
      this.currentUser.roles[0] !== this.allRoles.qYDManager &&
      this.currentUser.roles[1] !== this.allRoles.qYDManager
    ) {
      this._dashboardService.getBranch().subscribe({
        next: (next) => {
          let labelsBranch: any[] = [];
          let numberBranchesLabel: any[] = [];
          let colors = [
            '#b4384e',
            '#d899a4',
            '#E9C3C9',
            '#ACCFCF',
            '#F3C753',
            '#106F6E',
          ];
          this.branch = next.data;
          if (this.branch.branches.length > 0) {
            this.branch.branches.forEach((element: any) => {
              labelsBranch.push(
                element.numberOfBranches + ' ' + element.regionName
              );
              numberBranchesLabel.push(element.numberOfBranches);
            });
          }
          if (next.data.totalNo === 0) {
            this.myChart = new Chart('circlechart', {
              type: 'doughnut',
              data: {
                labels: [
                  this.branch?.branches[0]?.numberOfBranches +
                  ' ' +
                  this.branch?.branches[0]?.regionName,
                  this.branch?.branches[1]?.numberOfBranches +
                  ' ' +
                  this.branch?.branches[1]?.regionName,
                ],
                datasets: [
                  {
                    data: [50, 50],

                    backgroundColor: ['#CFCFCF', '#EFEFF8'],
                    borderRadius: 10,
                    borderWidth: 0,
                  },
                ],
              },
              options: {
                cutout: '70%',
                radius: 60,
                layout: {
                  padding: {
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                  },
                },
                plugins: {
                  tooltip: { enabled: false },
                  datalabels: {
                    labels: {
                      title: {
                        font: {
                          weight: 'bold',
                        },
                      },
                      value: {
                        color: 'green',
                      },
                    },
                  },
                },
                responsive: true,
                maintainAspectRatio: false,
              },
            });
            this.cdr.detectChanges();
          } else {
            this.myChart = new Chart('circlechart', {
              type: 'doughnut',
              data: {
                labels: labelsBranch,
                datasets: [
                  {
                    data: numberBranchesLabel,

                    backgroundColor: colors,
                    borderRadius: 10,
                    borderWidth: 0,
                  },
                ],
              },
              options: {
                cutout: '70%',
                radius: 60,
                layout: {
                  padding: {
                    top: 30,
                  },
                },
                plugins: {
                  datalabels: {
                    labels: {
                      title: {
                        font: {
                          weight: 'bold',
                        },
                      },
                      value: {
                        color: 'green',
                      },
                    },
                  },
                },
                responsive: true,
                maintainAspectRatio: false,
              },
            });
            this.cdr.detectChanges();
          }
        },
      });
    }
    this._dashboardService.getClient().subscribe({
      next: (next) => {
        this.clients = next.data;
        let individual = next.data.clients.filter(
          (key: any) => key.clientType === this.clientTypeEnum.Individual
        );
        let bussiness = next.data.clients.filter(
          (key: any) => key.clientType === this.clientTypeEnum.Special
        );
        this.myChart2 = new Chart('linechart', {
          type: 'bar',

          data: {
            labels: [

              individual[0]
                ? individual[0].numberOfClients +
                ' ' +
                this.translate.instant('addClient.Individual')
                : 0 + ' ' + this.translate.instant('addClient.Individual'),
              bussiness[0]
                ? bussiness[0].numberOfClients +
                ' ' +
                this.translate.instant('addClient.business')
                : 0 + ' ' + this.translate.instant('addClient.business'),
            ],
            datasets: [
              {
                data: [
                  individual[0] ? individual[0].numberOfClients : 0,
                  bussiness[0] ? bussiness[0].numberOfClients : 0,
                ],
                backgroundColor: ['#94A3B8', '#0D9488'],
                borderRadius: 10,
                borderWidth: 1,
              },

            ],
          },

          options: {
            layout: {
              padding: {
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,

              },

            },
            plugins: {
              legend: {
                display: false,
              },

            },
            scales: {
              x: {
                reverse: this.lang == 'ar' ? true : false,
              },
            },
            responsive: true,

            maintainAspectRatio: false,

          },
        });
        this.cdr.detectChanges();
      },
    });

    this._dashboardService.getContract().subscribe({
      next: (next) => {
        this.contracts = next.data;
        this.cdr.detectChanges();
      },
    });
    this._dashboardService.getLawsuit().subscribe({
      next: (next) => {
        this.lawisute = next.data;
        let Workers = next.data.lawsuitData.lawsuits.filter(
          (key: any) => key.courtType === this.entityList[0].id
        );
        let Criminal = next.data.lawsuitData.lawsuits.filter(
          (key: any) => key.courtType === this.entityList[1].id
        );
        let PersonalConditions = next.data.lawsuitData.lawsuits.filter(
          (key: any) => key.courtType === this.entityList[2].id
        );
        let Civilian = next.data.lawsuitData.lawsuits.filter(
          (key: any) => key.courtType === this.entityList[3].id
        );
        let Administrative = next.data.lawsuitData.lawsuits.filter(
          (key: any) => key.courtType === this.entityList[4].id
        );
        let Commercial = next.data.lawsuitData.lawsuits.filter(
          (key: any) => key.courtType === this.entityList[5].id
        );
        let Prisons = next.data.lawsuitData.lawsuits.filter(
          (key: any) => key.courtType === this.entityList[6].id
        );
        let Other = next.data.lawsuitData.lawsuits.filter(
          (key: any) => key.courtType === this.entityList[7].id
        );

        let labelsCases: any[] = [];
        this.entityList.forEach((element: any) => {
          labelsCases.push(this.translate.instant(element.name));
        });

        for (let i = 0; i < this.entityList.length; i++) {
          let la = next.data.lawsuitData.lawsuits.filter(
            (issue: any) => issue.courtType === this.entityList[i].id
          );
          if (la.length > 0) {
            labelsCases[i] = la[0].numberOfLawsuits + '  ' + labelsCases[i];
          } else {
            labelsCases[i] = 0 + '  ' + labelsCases[i];
          }
        }


        this.myChart = new Chart('piechart', {
          type: 'bar',

          data: {
            labels: labelsCases,
            datasets: [
              {
                label: '',
                data: [
                  Workers.length !== 0 ? Workers[0].numberOfLawsuits : 0,
                  Criminal.length !== 0 ? Criminal[0].numberOfLawsuits : 0,
                  PersonalConditions.length !== 0
                    ? PersonalConditions[0].numberOfLawsuits
                    : 0,
                  Civilian.length !== 0 ? Civilian[0].numberOfLawsuits : 0,
                  Administrative.length !== 0
                    ? Administrative[0].numberOfLawsuits
                    : 0,
                  Commercial.length !== 0 ? Commercial[0].numberOfLawsuits : 0,
                  Prisons.length !== 0 ? Prisons[0].numberOfLawsuits : 0,
                  Other.length !== 0 ? Other[0].numberOfLawsuits : 0,
                ],
                backgroundColor: [
                  '#A1A1AA',
                  '#A3E635',
                  '#CA8A04',
                  '#0D9488',
                  '#EA580C',
                  '#4F46E5',
                  '#7A95FF',
                  '#059669',
                ],

                borderWidth: 1,

              },
            ],
          },
          options: {
            plugins: {
              legend: {
                display: false,
              },

            },
            layout: {
              padding: {
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              },
            },
            scales: {
              x: {
                reverse: this.lang == 'ar' ? true : false,
              },
            },

            responsive: true,
            maintainAspectRatio: false,
          },
        });
        this.cdr.detectChanges();
      },
    });
    this._dashboardService.getSitting().subscribe({
      next: (next) => {
        this.sitting = next.data;
        this.cdr.detectChanges();
      },
    });
    this.show = true;
    this.spinner.hide();
  }
  changeButton(isSittingActive: any) {
    this.isSitting = isSittingActive;
    if (this.isSitting) {
      this.getSittingData();
    } else {
      this.getWorkDutyData();
    }
  }
  initFilterObj() {
    return {
      Sorting: 'id',
      SkipCount: 0,
      MaxResultCount: 3,
    };
  }

  getSittingData() {
    this.sittingService.searchSitting(this.filterObj).subscribe({
      next: (next) => {
        this.allSitting = next.data.items;

        this.cdr.detectChanges();
      },
    });
  }
  entityList: any;
  entityType = EntityType;
  // getEntityList() {
  //   this.entityList = Object.keys(this.entityType)
  //     .filter(
  //       (key) =>
  //         !isNaN(Number(this.entityType[key as keyof typeof this.entityType]))
  //     )
  //     .map((key) => ({
  //       id: Number(this.entityType[key as keyof typeof this.entityType]),
  //       name: key,
  //     }));
  // }
  getEntityList() {
    this.entityList = Object.keys(this.entityType)
      .filter((key) => !isNaN(Number(this.entityType[key as keyof typeof this.entityType])))
      .map((key) => ({
        id: Number(this.entityType[key as keyof typeof this.entityType]),
        name: key,
      }));
    return of(this.entityList); // Return as an observable
  }
  //getPlace
  getPlace(id: any) {
    let entity = this.entityList.filter((key: any) => key.id === id);
    return entity[0].name;
  }
  initFilterObjWorkDuty() {
    return {
      Sorting: 'id',
      SkipCount: 0,
      MaxResultCount: 3,
    };
  }
  workDutyStatus = WorkDutyStatus;
  getWorkDutyData() {
    this.workDutyService.getAllDutyList(this.filterObj).subscribe({
      next: (next) => {
        this.allWorkDuty = next.data.items;
        this.cdr.detectChanges();
      },
    });
  }
}
