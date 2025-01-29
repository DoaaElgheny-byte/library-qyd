import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { IssuesService } from 'src/app/services/api/issues.service';
import {
  LawsuitType,
  LawsuitState,
  FilesType,
  NationalType,
} from 'src/app/services/enums/lawsuit';
import {
  ContractState,
  ContractStatus,
} from 'src/app/services/enums/contractStatus.enum';
import { ContractService } from 'src/app/services/api/contract.service';
import { AppConfirmService } from 'src/app/modules/SharedComponent/SharedComponent/app-confirm/app-confirm.service';
import { DateFormatterService, DateType } from 'ngx-hijri-gregorian-datepicker';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/modules/auth';
import { Constants } from 'src/app/services/Constants/constants';
declare let gtag: Function;

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements OnInit {
  id: any;
  contractDetails: any = {};
  issueTypes = LawsuitType;
  issueState = LawsuitState;
  contractState = ContractState;
  @Output() bindValue: EventEmitter<any> = new EventEmitter<any>();
  lang: string | null = localStorage.getItem('language');
  contractStatus = ContractStatus;
  startDate: any;
  endDate: any;
  currentUser: any;

  constructor(
    public contractService: ContractService,
    private cdr: ChangeDetectorRef,
    public route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private router: Router,
    private appconfirmservice: AppConfirmService,
    private dateFormatter: DateFormatterService,
    public datepipe: DatePipe,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    localStorage.setItem('stepContract', '2');

    this.route.params.subscribe({
      next: (next) => {
        this.id = next['id'];
      },
    });
    if (this.id) {
      this.getIssueById();
    }
  }

  getIssueById() {
    debugger
    this.contractService.getContractDetails(this.id).subscribe({
      next: (next) => {
        this.contractDetails = next.data;
        console.log(next.data)
        //startDate
        if (next.data?.startDate) {
          let currentDate = next.data.startDate.substring(0, 10);

          if (currentDate) {
            if (next.data?.startDateType) {
              if (next.data.startDateType == DateType.Gregorian) {
                this.startDate =
                  this.dateFormatter.ToGregorianDateStruct(
                    currentDate,
                    'YYYY-MM-DD'
                  );
              } else {
                this.startDate =
                  this.dateFormatter.ToHijriDateStruct(
                    currentDate,
                    'YYYY-MM-DD'
                  );
              }
            }
          } else {
            this.startDate = null;
          }
        }

        //endDate
        if (next.data?.endDate) {
          let endOfDate = next.data.endDate.substring(0, 10);

          if (endOfDate) {
            if (next.data?.endDateType === DateType.Gregorian) {
              this.endDate =
                this.dateFormatter.ToGregorianDateStruct(
                  endOfDate,
                  'YYYY-MM-DD'
                );
            } else {
              this.endDate = this.dateFormatter.ToHijriDateStruct(
                endOfDate,
                'YYYY-MM-DD'
              );
            }
          } else {
            this.endDate = null;
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

  submit() {
    let date = this.datepipe.transform(new Date, 'yyyy-MM-dd');
    var isValidUserLoginToSendEvent: boolean;
    this.currentUser = this.authService.getCurrentUser();
    if (
      this.currentUser.roles[0] == Constants.AllRoles.qYDManager ||
      this.currentUser.roles[0] == Constants.AllRoles.employee) isValidUserLoginToSendEvent = true;

    this.spinner.show();
    if (this.contractDetails.isDraft) {
      this.contractService.changeToPublic(this.id).subscribe({
        next: (next) => {
          if (next.data) {
            alert('خلي بالك عدد العقود المسموح ليك قرب يخلص ')
          }
          this.spinner.hide();
          if (localStorage.getItem('addNewContractFromProject') == 'true') {
            this.router.navigate(['../../../project-management/add-edit-project'], { relativeTo: this.route });
            localStorage.removeItem('addNewContractFromProject')
          } else {
            this.appconfirmservice.confirm(
              this.translate.instant("AddEditcontract.contractAddSuccess"), '',
              '/assets/imgs/confirm/add.svg', true, '/agent/departments/contracts')
          }
          if (isValidUserLoginToSendEvent) {
            gtag('event', 'contract_management_used', {
              user_id: this.currentUser.id,
              feature_used: 'Adding New Contract',
              timestamp: date,
            });
          }
        },
        error: (error) => {
          this.spinner.hide();
          this.appconfirmservice.confirm(
            this.translate.instant(error.error.error.message), '',
            '/assets/imgs/confirm/warning.svg', false)
        },
      });
    } else {
      this.contractService.updateContract(this.id).subscribe({
        next: (next) => {
          this.spinner.hide();

          this.appconfirmservice.confirm(
            this.translate.instant("AddEditcontract.contractEditSuccess"), '',
            '/assets/imgs/confirm/add.svg', true, '/agent/departments/contracts')
          if (isValidUserLoginToSendEvent) {
            gtag('event', 'contract_management_used', {
              user_id: this.currentUser.id,
              feature_used: 'Updating Contract',
              timestamp: date,
            });
          }
        },
        error: (error) => {
          this.spinner.hide();
          this.appconfirmservice.confirm(
            this.translate.instant(error.error.error.message), '',
            '/assets/imgs/confirm/warning.svg', false)
        },
      });
    }
  }

  Back() {
    this.bindValue.emit({
      isBack: true,
    });
  }

  ngOnDestroy() {
    this.bindValue.emit({
      isAdd: false,
    });
  }
}
