import {
  Component,
  OnInit,
  ChangeDetectorRef,
  EventEmitter,
  Output,
  Input,
  OnDestroy,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { finalize, Observable, Subscription } from 'rxjs';
import { TranslationService } from 'src/app/i18n';
import { AppConfirmService } from 'src/app/modules/SharedComponent/SharedComponent/app-confirm/app-confirm.service';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';
import { AuthService } from 'src/app/modules/auth';
import { LookupGuidDto } from 'src/app/modules/auth/models/agent-user.model';
import { Constants } from 'src/app/services/Constants/constants';
import { ContractService } from 'src/app/services/api/contract.service';
import { EmployeeManagementService } from 'src/app/services/api/employee-management.service';
import { IssuesService } from 'src/app/services/api/issues.service';
import { WorkDutyService } from 'src/app/services/api/work-duty.service';

@Component({
  selector: 'app-work-duty-assigned',
  templateUrl: './work-duty-assigned.component.html',
  styleUrls: ['./work-duty-assigned.component.scss'],
})
export class WorkDutyAssignedComponent implements OnInit, OnDestroy, OnChanges {
  infoForm: FormGroup;
  infoFormNotify: FormGroup;
  hasError: boolean;
  isLoading$: Observable<boolean>;
  private unsubscribe: Subscription[] = [];
  lang: string | null = localStorage.getItem('language');
  dateText1: any;
  branches: any;
  employees: any;
  @Input() branchId: any = null;
  employeeId: {
    id: number;
    name: string;
    email: string;
    branch: string;
  };
  newAssigned: {
    id: number;
    name: string;
    email: string;
    branch: string;
  }[] = [];
  newTeam: {
    id: number;
    name: string;
    teamId: number;
  }[] = [];

  fieldRequired = false;
  @Output() bindValue: EventEmitter<any> = new EventEmitter<any>();
  issueDetails: any;
  @Input() issueId: any;

  isTeam = false
  servicesForSearch = [] as LookupGuidDto[];
  resultEmployeeTeam: any;
  isEmployee: boolean;
  currentUser: any;

  number: any;
  assignTypeValue: any
  teamIdAssigned: any

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private toastr: ToastrService,
    private _contractManagementService: ContractService,
    private _workdutyService: WorkDutyService,
    public route: ActivatedRoute,
    private appconfirmservice: AppConfirmService,
    private authService: AuthService,
    private employeeManagementService: EmployeeManagementService,
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser.roles[0] == Constants.AllRoles.employee) {
      this.isEmployee = true;
    } else {
      this.isEmployee = false;
    }
    this.initForm();
    this.initNotify();
    this.getTeams();

    if (this.issueId) {
      this.getIssueById();
    }
    if (this.branchId) {
      this.getEmployee();
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['branchId'] && this.branchId) {
      this.getEmployee();
    }
  }
  ///get case details
  getIssueById() {
    this.spinner.show();
    this._workdutyService.getDutyDetails(this.issueId).subscribe({
      next: (next) => {
        this.issueDetails = next.data;
        if (next.data.branchId) {
          this.branchId = next.data.branchId;
          this.getEmployee();
        }
        this.getTeams();

        if (this.issueDetails?.employees?.length > 0) {
          this.newAssigned = next.data.employees;
        } else {
          this.newAssigned = [];
        }

        if (this.issueDetails?.teamEmployees?.length > 0) {
          this.newTeam = next.data.teamEmployees;
        } else {
          this.newTeam = [];
        }
        if (this.issueDetails.assignType) {
          this.infoForm.get('teamId')?.setValue(this.issueDetails.teamId);
          this.infoForm.get('assignType')?.setValue(this.issueDetails.assignType);
          this.isTeam = true
        } else {
          this.infoForm.get('teamId')?.setValue(null);
          this.infoForm.get('assignType')?.setValue(this.issueDetails.assignType);
          this.isTeam = false
        }

        this.infoFormNotify.get('number')?.setValue(next.data.noOfDays);
        this.cdr.detectChanges();
        this.spinner.hide();
      },
    });
  }
  //init form
  initForm() {
    this.infoForm = this.fb.group({
      employee: [null, Validators.compose([Validators.required])],
      teamId: [null],
      assignType: [false]

    });
    if (this.isEmployee) {
      this.infoForm.get('employee')?.disable();
      this.infoForm.get('employee')?.setValidators(null);
      this.infoForm.get('employee')?.updateValueAndValidity();
    } else {
      this.infoForm.get('employee')?.enable();
      this.infoForm.get('employee')?.setValidators([Validators.required]);
      this.infoForm.get('employee')?.updateValueAndValidity();
    }
  }
  initNotify() {
    this.infoFormNotify = this.fb.group({
      number: [
        1,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^-?(0|[1-9]\d*)?$/),
        ]),
      ],
    });
  }

  ///get employee base of branch
  getEmployee() {
    this._contractManagementService
      .getEmployeeInBranch(this.branchId)
      .subscribe({
        next: (next) => {
          this.spinner.hide();
          this.employees = next.data;
          console.log(next.data)
          this.cdr.detectChanges();
        },
      });
  }
  //add row of Employee
  addEmployee() {

    //this.infoForm.get('teamId')?.setValidators(null);
    if (this.infoForm.invalid) {
      Object.keys(this.infoForm.controls).forEach((field) => {
        // {1}
        const control = this.infoForm.get(field); // {2}
        control?.markAsTouched({ onlySelf: true }); // {3}
      });
      return;
    }
    const hasObject = this.newAssigned.some(
      (obj) => obj.id === this.infoForm.get('employee')?.value.id
    );
    if (hasObject) {
      this.appconfirmservice.confirm(
        this.translate.instant('addIssue.haveAssigned'),
        '',
        '/assets/imgs/confirm/warning.svg',
        false
      );
    } else {
      this.newAssigned.push({
        id: this.infoForm.get('employee')?.value.id,
        name: this.infoForm.get('employee')?.value.name,
        email: this.infoForm.get('employee')?.value.email,
        branch: this.infoForm.get('employee')?.value.branch,
      });
      this.infoForm.reset();
      this.fieldRequired = false;
    }
  }

  addTeam() {

    this.assignTypeValue = this.infoForm.get('assignType')?.value;
    this.teamIdAssigned = this.infoForm.get('teamId')?.value;

    this.resultEmployeeTeam.forEach((employee: any) => {
      this.newTeam.push({
        id: employee.id,
        name: employee.name,
        teamId: this.infoForm.get('teamId')?.value,
      });
    });
    this.infoForm.get('teamId')?.setValue(null);
  }

  deleteTeamEmployeeRow(row: { id: number; name: string; teamId: number }) {
    const index = this.newTeam.indexOf(row);
    if (index > -1) {
      this.newTeam.splice(index, 1);
    }
  }

  ///delete row
  deleteRow(row: { id: number; name: string; email: string; branch: string }) {
    const index = this.newAssigned.indexOf(row);
    if (index > -1) {
      this.newAssigned.splice(index, 1);
    }
  }
  teamId: number;
  ///save data
  submit() {

    if (this.newAssigned.length > 0) {
      this.teamId = this.infoForm.get('teamId')?.value
      if (this.issueId != 0) {
        this._workdutyService
          .editAssigned({
            id: +this.issueId,
            teamId: this.teamId,
            teamEmployees: this.newTeam,
            assignType: this.infoForm.get('assignType')?.value,
            employees: this.newAssigned,
            noOfDays: +this.infoFormNotify.get('number')?.value,
          })
          .subscribe({
            next: (next) => {
              this.spinner.hide();
              if (next.success) {
                this.bindValue.emit({
                  isSuccess: next.success,
                  isBack: false,
                });
              } else {
                this.spinner.hide();
                this.bindValue.emit({
                  isSuccess: next.success,
                  isBack: false,
                });
                this.toastr.info(next.message);
              }
            },
            error: (error) => {
              this.spinner.hide();

              this.toastr.error(error.error.error.message);
            },
          });
      }
    } else {
      this.fieldRequired = true;
    }
  }

  updateError() {
    this.fieldRequired = true;
  }
  //back to first step
  Back() {
    this.bindValue.emit({
      isBack: true,
    });
  }

  isTeamOrEmp(type: boolean) {
    this.isTeam = type
    if (!this.isTeam) {
      this.infoForm.get('teamId')?.setValue(null);
      this.newTeam = []
    } else {
      this.newAssigned = [];
    }
  }

  getTeams() {
    this.employeeManagementService.getTeamLookups().subscribe((res) => {
      this.servicesForSearch = res.data;
    })
  }

  onChangeTeamSelect() {
    let val = this.infoForm.get('teamId')?.value;
    if (val) {
      this.getEmployeesTeam(val)
    }
  }

  getEmployeesTeam(id: any) {

    this.spinner.show();
    this.employeeManagementService.getEmployeeTeamById(id).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe((res) => {
      this.resultEmployeeTeam = res.data.items;
      if (res.data.items.length <= 0) {
        this.toastr.warning(this.translate.instant('addIssue.NotFoundEmployees'));
        //this.infoForm.reset();
        this.infoForm.get('teamId')?.setValue(null);
        return;
      }
      this.cdr.detectChanges();
    })
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
