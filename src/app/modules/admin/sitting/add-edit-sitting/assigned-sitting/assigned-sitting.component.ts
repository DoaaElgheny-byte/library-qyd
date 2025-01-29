import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { TranslationService } from 'src/app/i18n';
import { SittingManagementService } from 'src/app/services/api/sitting-management.service';

@Component({
  selector: 'app-assigned-sitting',
  templateUrl: './assigned-sitting.component.html',
  styleUrls: ['./assigned-sitting.component.scss'],
})
export class AssignedSittingComponent implements OnInit {
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
  @Input() newStep2: any;
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
    private _sittingManagementService: SittingManagementService,
    private formBuilder: FormBuilder,
    public route: ActivatedRoute
  ) {}
  ngAfterViewChecked() {
    this.lang = localStorage.getItem('language');
    this.cdr.detectChanges();
  }
  ngOnInit(): void {
    localStorage.setItem('step', '2');
    this.initForm();
    this.initNotify();
    this.getBranch();
    this.route.params.subscribe({
      next: (next) => {
        this.issueId = next['id'];
      },
    });
    if (this.issueId) {
      this.getIssueById();
    }
  }
  ///get case details
  getIssueById() {
    this.spinner.show();
    this._sittingManagementService.getSittingDetails(this.issueId).subscribe({
      next: (next) => {
        this.issueDetails = next.data;
        if (this.issueDetails.employees != null) {
          this.newAssigned = next.data.employees;
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
      branchId: [null, Validators.compose([Validators.required])],
    });
  }
  initNotify() {
    this.infoFormNotify = this.fb.group({
      number: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.pattern(/^-?(0|[1-9]\d*)?$/),
        ]),
      ],
    });
  }
  //get branches
  getBranch() {
    this._sittingManagementService.getBranch().subscribe({
      next: (next) => {
        this.spinner.hide();
        this.branches = next.data;
        this.cdr.detectChanges();
      },
    });
  }
  ///get employee base of branch
  getEmployee(event: any) {
    this._sittingManagementService
      .getEmployeeInBranch(event.target.value)
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
      this.toastr.info(this.translate.instant('addIssue.haveAssigned'));
    } else {
      if (this.newAssigned.length < 5) {
        this.newAssigned.push({
          id: this.infoForm.get('employee')?.value.id,
          name: this.infoForm.get('employee')?.value.name,
          email: this.infoForm.get('employee')?.value.email,
          branch: this.infoForm.get('employee')?.value.branch,
        });
        this.infoForm.reset();
        this.fieldRequired = false;
      } else {
        this.toastr.info(this.translate.instant('addIssue.notaddMorefive'));
      }
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
      if (this.issueId) {
        if (this.issueDetails.isDraft) {
          this._sittingManagementService
            .addAssigned({
              id: +this.issueId,
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
        } else {
          this.spinner.hide();
          this.bindValue.emit({
            id: this.issueId,
            isSuccess: true,
            data: {
              id: +this.issueId,
              employees: this.newAssigned,
              noOfDays: +this.infoFormNotify.get('number')?.value,
            },
          });
        }
      }
    } else {
      this.fieldRequired = true;
    }
  }
  //back to first step
  Back() {
    this.bindValue.emit({
      isBack: true,
    });
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
