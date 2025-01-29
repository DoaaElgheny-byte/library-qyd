import {
  Component,
  OnInit,
  ChangeDetectorRef,
  EventEmitter,
  Output,
  Input,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { TranslationService } from 'src/app/i18n';
import { AppConfirmService } from 'src/app/modules/SharedComponent/SharedComponent/app-confirm/app-confirm.service';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';
import { ContractService } from 'src/app/services/api/contract.service';
import { IssuesService } from 'src/app/services/api/issues.service';

@Component({
  selector: 'app-assigned',
  templateUrl: './assigned.component.html',
  styleUrls: ['./assigned.component.scss'],
})
export class AssignedComponent implements OnInit {
  infoForm: FormGroup;
  infoFormNotify: FormGroup;
  hasError: boolean;
  isLoading$: Observable<boolean>;
  private unsubscribe: Subscription[] = [];
  lang: string | null = localStorage.getItem('language');
  dateText1: any;
  branches: any;
  employees: any;
  branchId: any = null;
  loadingSave: boolean
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
  fieldRequired = false;
  @Output() bindValue: EventEmitter<any> = new EventEmitter<any>();
  issueDetails: any;
  issueId: any;
  number: any;
  constructor(
    private fb: FormBuilder,
    private translationService: TranslationService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private toastr: ToastrService,
    private _contractManagementService: ContractService,
    private router: Router,
    public route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private appconfirmservice: AppConfirmService

  ) { }

  ngOnInit(): void {
    this.breadcrumbService.restoreBreadcrumbsFromStorage();
    this.initForm();
    this.initNotify();
    this.route.params.subscribe({
      next: (next) => {
        this.issueId = next['id'];
      },
    });
    if (this.issueId != 0) {
      this.getIssueById();
    }
  }
  ///get case details
  getIssueById() {
    this.spinner.show();
    this._contractManagementService.getContractDetails(this.issueId).subscribe({
      next: (next) => {
        this.issueDetails = next.data;
        this.branchId = next.data.branchId;
        this.getEmployee()

        if (this.issueDetails.contarctEmployees != null) {
          this.newAssigned = next.data.contarctEmployees;
        } else {
          this.newAssigned = [];
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
    });
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
          this.cdr.detectChanges();
        },
      });
  }
  //add row of Employee
  addEmployee() {

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
      // this.toastr.info(this.translate.instant('addIssue.haveAssigned'));
      this.appconfirmservice.confirm(
        this.translate.instant("addIssue.haveAssigned"), '',
        '/assets/imgs/confirm/warning.svg', false)
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

  ///delete row
  deleteRow(row: { id: number; name: string; email: string; branch: string }) {
    const index = this.newAssigned.indexOf(row);
    if (index > -1) {
      this.newAssigned.splice(index, 1);
    }
  }
  ///save data
  submit() {

    if (this.infoFormNotify.invalid) {
      Object.keys(this.infoFormNotify.controls).forEach((field) => {
        // {1}
        const control = this.infoFormNotify.get(field); // {2}
        control?.markAsTouched({ onlySelf: true }); // {3}
      });
      return;
    }
    if (this.newAssigned.length > 0) {
      if (this.issueId != 0) {
        this._contractManagementService
          .editAssigned({
            id: +this.issueId,
            employees: this.newAssigned,
            noOfDays: +this.infoFormNotify.get('number')?.value,
          })
          .subscribe({
            next: (next) => {
              this.spinner.hide();
              if (next.success) {

                this.loadingSave = false
                this.appconfirmservice.confirm(
                  this.translate.instant("workDuty.assignedSuccess"), '',
                  '/assets/imgs/confirm/add.svg')

              } else {
                this.loadingSave = false
                this.spinner.hide();

                this.appconfirmservice.confirm(
                  this.translate.instant(next.message), '',
                  '/assets/imgs/confirm/warning.svg', false)
              }
            },
            error: (error) => {
              this.spinner.hide();
              this.loadingSave = false
              this.appconfirmservice.confirm(
                this.translate.instant(error.error.error.message), '',
                '/assets/imgs/confirm/warning.svg', false)
            },
          });
      }
    } else {
      this.fieldRequired = true;
      this.loadingSave = false
    }
  }
  //back to first step
  Back() {

    this.router.navigate(['/agent/departments/contracts'])
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
