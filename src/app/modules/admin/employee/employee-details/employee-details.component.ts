import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DateFormatterService, DateType } from 'ngx-hijri-gregorian-datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';
import { EmployeeManagementService } from 'src/app/services/api/employee-management.service';
import { ConditionType } from 'src/app/services/enums/payment-conditions.enum';
@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss'],
})
export class EmployeeDetailsComponent implements OnInit, OnDestroy {
  id: any;
  player: any;
  lang: string | null = localStorage.getItem('language');
  EmployeeManagment: any;
  startAuthorizationDate: any;
  endAuthorizationDate: any;
  constructor(
    private _employeeManagementService: EmployeeManagementService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private dateFormatter: DateFormatterService,
    private route: ActivatedRoute,
    private router: Router,
    private breadcrumbService: BreadcrumbService
  ) {
    this.getCondition();
  }

  ngOnInit(): void {
    this.breadcrumbService.restoreBreadcrumbsFromStorage();

    this.route.params.subscribe({
      next: (next) => {
        this.id = next['id'];
      },
    });
    this.getPlayerById();
  }
  getCondition() {
    let packageCondition = window.localStorage.getItem(
      'condtions-to-current-user'
    );

    let packageData: any = JSON.parse(packageCondition!);
    this.EmployeeManagment = packageData.getConditions.find(
      (i: any) => i.conditionType == ConditionType.EmployeeManagment
    );
  }
  getPlayerById() {
    this.spinner.show();
    this._employeeManagementService.getEmplyeeDetails(this.id).subscribe({
      next: (next) => {
        this.spinner.hide();
        this.player = next.data;
        //startDate
        if (next.data.startAuthorizationDate) {
          let currentDate = next.data.startAuthorizationDate.substring(0, 10);

          if (currentDate) {
            if (next.data.startDateType) {
              if (next.data.startDateType == DateType.Gregorian) {
                this.startAuthorizationDate =
                  this.dateFormatter.ToGregorianDateStruct(
                    currentDate,
                    'YYYY-MM-DD'
                  );
              } else {
                this.startAuthorizationDate =
                  this.dateFormatter.ToHijriDateStruct(
                    currentDate,
                    'YYYY-MM-DD'
                  );
              }
            }
          } else {
            this.startAuthorizationDate = null;
          }
        }

        //endDate
        if (next.data.endAuthorizationDate) {
          let endOfDate = next.data.endAuthorizationDate.substring(0, 10);

          if (endOfDate) {
            if (next.data.endDateType === DateType.Gregorian) {
              this.endAuthorizationDate =
                this.dateFormatter.ToGregorianDateStruct(
                  endOfDate,
                  'YYYY-MM-DD'
                );
            } else {
              this.endAuthorizationDate = this.dateFormatter.ToHijriDateStruct(
                endOfDate,
                'YYYY-MM-DD'
              );
            }
          } else {
            this.endAuthorizationDate = null;
          }
        }

        this.cdr.detectChanges();
      },
    });
  }

  format(date: NgbDateStruct): string {
    if (!date) {
      return '';
    }

    const day = this.isNumber(date.day) ? this.padNumber(date.day) : '';
    const month = this.isNumber(date.month) ? this.padNumber(date.month) : '';
    const year = date.year;

    return `${day}-${month}-${year}`;
  }

  isNumber(value: any): value is number {
    return !isNaN(value as number);
  }

  padNumber(value: number): string {
    return value.toString().padStart(2, '0');
  }
  getShortName(fullName: string) {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .join('');
  }
  private unsubscribe: Subscription[] = [];
  Back() {
    this.router.navigate(['/agent/departments/employee-managment']);
  }
  submit() {
    this.router.navigate([
      '/agent/departments/employee-managment/add-edit-employee',
      this.id,
    ]);
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
