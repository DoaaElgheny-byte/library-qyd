import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Chart, registerables } from 'chart.js';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardService } from 'src/app/services/api/dashboard.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { AuthService } from 'src/app/modules/auth';
import { SittingManagementService } from 'src/app/services/api/sitting-management.service';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/app/services/Constants/constants';
import { ClientService } from 'src/app/services/api/client.service';
Chart.register(...registerables);
@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {
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
  duty: any;
  show: boolean;
  currentUser: any;
  branches: any;
  isAgent: boolean;
  BranchId = '';
  StartDate: string;
  endDate: string;
  dateText: any;
  fromSearchInput: boolean = false;
  filterObj = this.initFilterObj();
  clientName = '';
  AppUserId = '';
  ClientId = '';
  clientList: any;
  agency: any;
  allRoles: any = Constants.AllRoles;
  employee: any;
  name: string;
  isEmployee: boolean;
  constructor(
    private _dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private sittingservice: SittingManagementService,
    public datepipe: DatePipe,
    private _clientService: ClientService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser.roles[0] == Constants.AllRoles.employee) {
      this.isEmployee = true;
    } else {
      this.isEmployee = false;
    }
    this.AppUserId = this.currentUser.id;
    this.name = this.authService.name;
    this.getBranchList();
    this.getAllData();
  }
  precentage(precent: any) {
    return Math.round(precent * 10) / 10;
  }
  //get client list
  getClientList(e?: any) {

    this._clientService.getClientListByBranch(e).subscribe({
      next: (next) => {
        this.spinner.hide();
        this.clientList = next.data;
        this.cdr.detectChanges();
      },
    });
  }
  getBranchList() {
    this.sittingservice.getBranch().subscribe({
      next: (next) => {
        this.branches = next.data;
        this.cdr.detectChanges();
      },
    });
  }
  to: any;
  from: any;
  getAllData() {
    var existingChart = Chart.getChart('circlechart');
    var existingChart2 = Chart.getChart('employeeChart');
    var existingChart3 = Chart.getChart('agencyChart');
    existingChart?.destroy();
    existingChart2?.destroy();
    existingChart3?.destroy();
    this.spinner.show();
    if (this.StartDate != null && this.StartDate != '') {
      this.from = this.StartDate;

      let myDate2 = this.from;
      const date2: NgbDate = new NgbDate(
        myDate2.year,
        myDate2.month,
        myDate2.day
      );
      const jsDate2 = new Date(date2.year, date2.month - 1, date2.day);
      this.from = this.datepipe.transform(jsDate2, 'yyyy-MM-dd');
    } else {
      this.from = '';
    }

    this.filterObj.From = this.from;
    if (this.endDate != null && this.endDate != '') {
      this.to = this.endDate;

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

    this.filterObj.To = this.to;
    this.filterObj.Client = this.clientName;
    this.filterObj.BranchId = this.BranchId;
    this.filterObj.ClientId = this.ClientId;
    if (
      this.currentUser.roles[0] !== this.allRoles.employee &&
      this.currentUser.roles[1] !== this.allRoles.employee &&
      this.currentUser.roles[0] !== this.allRoles.qYDManager &&
      this.currentUser.roles[1] !== this.allRoles.qYDManager
    ) {
      this._dashboardService.getBranch(this.filterObj).subscribe({
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

          if (next.data.totalNo === 0 && next.data.branches.length !== 0) {
            this.myChart = new Chart('circlechart', {
              type: 'doughnut',
              data: {

                labels: [
                  this.branch?.branches[0].numberOfBranches +
                  ' ' +
                  this.branch.branches[0].regionName,
                  this.branch.branches[1].numberOfBranches +
                  ' ' +
                  this.branch.branches[1].regionName,
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

    if (this.currentUser.roles[0] !== this.allRoles.employee) {
      this._dashboardService.getEmployee(this.filterObj).subscribe({
        next: (nextempl) => {
          this.employee = nextempl.data;
          if (nextempl.data.totalNo === 0) {
            this.myChart3 = new Chart('employeeChart', {
              type: 'doughnut',
              data: {
                labels: [
                  this.employee.totalActive +
                  ' ' +
                  this.translate.instant('employeeManagement.active'),
                  this.employee.totalInactive +
                  ' ' +
                  this.translate.instant('employeeManagement.inActive'),
                  ,
                  '',
                ],
                datasets: [
                  {
                    data: [50, 50],

                    backgroundColor: ['#CFCFCF', '#EFEFF8', ''],
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
            this.myChart3 = new Chart('employeeChart', {
              type: 'doughnut',
              data: {
                labels: [
                  this.precentage(this.employee.totalActive) + '%' +
                  ' ' +
                  this.translate.instant('employeeManagement.active'),
                  this.precentage(this.employee.totalInactive) + '%' +
                  ' ' +
                  this.translate.instant('employeeManagement.inActive'),
                  ,
                ],
                datasets: [
                  {
                    data: [
                      this.employee.totalActive,
                      this.employee.totalInactive,
                    ],

                    backgroundColor: ['#106F6E', '#DCA617'],
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
    this._dashboardService.getContract(this.filterObj).subscribe({
      next: (next) => {
        this.contracts = next.data;
        this.cdr.detectChanges();
      },
    });

    this._dashboardService.getLawsuit(this.filterObj).subscribe({
      next: (next1) => {
        this.lawisute = next1.data;
        this._dashboardService.getSitting(this.filterObj).subscribe({
          next: (next2) => {
            this.sitting = next2.data;
            this.cdr.detectChanges();
          },
        });
      },
    });
    this._dashboardService.getDuty(this.filterObj).subscribe({
      next: (next3) => {
        this.duty = next3.data;

        this._dashboardService.getAgency(this.filterObj).subscribe({
          next: (next4) => {
            this.agency = next4.data;
            if (this.agency.totalNo === 0) {
              this.myChart2 = new Chart('agencyChart', {
                type: 'doughnut',
                data: {
                  labels: [
                    this.precentage(this.agency.totalCompleted) +
                    ' ' +
                    this.translate.instant('attorny.Finished'),
                    this.precentage(this.agency.totalInprocess) +
                    ' ' +
                    this.translate.instant('attorny.Active'),
                    this.precentage(this.agency.totalCanceled) +
                    ' ' +
                    this.translate.instant('attorny.Canceled'),
                  ],
                  datasets: [
                    {
                      data: [50, 50, 0],

                      backgroundColor: ['#CFCFCF', '#EFEFF8', '#EFEFF8'],
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
              this.myChart2 = new Chart('agencyChart', {
                type: 'doughnut',
                data: {
                  labels: [
                    this.precentage(this.agency.totalCompleted) + '%' +
                    ' ' +
                    this.translate.instant('attorny.Finished'),
                    this.precentage(this.agency.totalInprocess) + '%' +
                    ' ' +
                    this.translate.instant('attorny.Active'),
                    this.precentage(this.agency.totalCanceled) + '%' +
                    ' ' +
                    this.translate.instant('attorny.Canceled'),
                  ],
                  datasets: [
                    {
                      data: [
                        this.agency.totalCompleted,
                        this.agency.totalInprocess,
                        this.agency.totalCanceled,
                      ],

                      backgroundColor: ['#B3344A', '#F3C753', '#ACCFCF'],
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
            this.show = true;
            this.cdr.detectChanges();
            this.spinner.hide();
          },
        });
      },
    });
  }
  initFilterObj() {
    return {
      To: this.endDate,
      From: this.StartDate,
      Client: this.clientName,
      BranchId: this.BranchId,
      ClientId: this.ClientId,
    };
  }
  export(type: any) {
    let obj = { ...this.filterObj, AppUserId: this.AppUserId };
    if (this.StartDate != null && this.StartDate != '') {
      this.from = this.StartDate;

      let myDate2 = this.from;
      const date2: NgbDate = new NgbDate(
        myDate2.year,
        myDate2.month,
        myDate2.day
      );
      const jsDate2 = new Date(date2.year, date2.month - 1, date2.day);
      this.from = this.datepipe.transform(jsDate2, 'yyyy-MM-dd');
    } else {
      this.from = '';
    }

    this.filterObj.From = this.from;
    if (this.endDate != null && this.endDate != '') {
      this.to = this.endDate;

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

    if (type === 'branch') {
      window.open(
        `${environment.api_url}api/app/manage-statistics/export-shee-branchs?AppUserId=${this.AppUserId}&BranchId=${this.BranchId}&ClientId=${this.ClientId}&From=${this.from}&To=${this.to}`
      );
    } else if (type === 'issue') {
      window.open(
        `${environment.api_url}api/app/manage-statistics/export-sheet-lawsuit?AppUserId=${this.AppUserId}&BranchId=${this.BranchId}&ClientId=${this.ClientId}&From=${this.from}&To=${this.to}`
      );
    } else if (type === 'contract') {

      window.open(
        `${environment.api_url}api/app/manage-statistics/export-sheet-contract?AppUserId=${this.AppUserId}&BranchId=${this.BranchId}&ClientId=${this.ClientId}&From=${this.from}&To=${this.to}`
      );
    } else if (type === 'sitting') {
      window.open(
        `${environment.api_url}api/app/manage-statistics/export-sheet-sitting?AppUserId=${this.AppUserId}&BranchId=${this.BranchId}&ClientId=${this.ClientId}&From=${this.from}&To=${this.to}`
      );
    } else if (type === 'duty') {
      window.open(
        `${environment.api_url}api/app/manage-statistics/export-sheet-duty?AppUserId=${this.AppUserId}&BranchId=${this.BranchId}&ClientId=${this.ClientId}&From=${this.from}&To=${this.to}`
      );
    } else if (type === 'employee') {
      window.open(
        `${environment.api_url}api/app/manage-statistics/export-sheet-employees?AppUserId=${this.AppUserId}&BranchId=${this.BranchId}&ClientId=${this.ClientId}&From=${this.from}&To=${this.to}`
      );
    } else if (type === 'agency') {
      window.open(
        `${environment.api_url}api/app/manage-statistics/export-sheet-agency?AppUserId=${this.AppUserId}&BranchId=${this.BranchId}&ClientId=${this.ClientId}&From=${this.from}&To=${this.to}`
      );
    }
  }
}
