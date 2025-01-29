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
import { IssuesService } from 'src/app/services/api/issues.service';
import { SittingManagementService } from 'src/app/services/api/sitting-management.service';

@Component({
  selector: 'app-assigned',
  templateUrl: './assigned.component.html',
  styleUrls: ['./assigned.component.scss'],
})
export class AssignedComponent implements OnInit {
  infoForm: FormGroup;
  hasError: boolean;
  isLoading$: Observable<boolean>;
  private unsubscribe: Subscription[] = [];
  lang: string | null = localStorage.getItem('language');
  dateText1: any;
  branches: any;
  employees: any;
  branchId: any = null;
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
    isManager:boolean
  }[] = [];
  fieldRequired = false;
  loadingSave:boolean

  @Output() bindValue: EventEmitter<any> = new EventEmitter<any>();
  issueDetails: any;
  issueId: any;
  @Input() newStep2: any;
  infoFormNotify: FormGroup;
  constructor(
    private fb: FormBuilder,
    private translationService: TranslationService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private toastr: ToastrService,
    private _lawsuitManagementService: IssuesService,
    private router: Router,
    public route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private appconfirmservice: AppConfirmService,
    private _sittingManagementService: SittingManagementService,

  ) {}
  ngAfterViewChecked() {
    this.lang = localStorage.getItem('language');
    this.cdr.detectChanges();
  }
  ngOnInit(): void {
        this.breadcrumbService.restoreBreadcrumbsFromStorage();

  
    this.initForm();
    this.initNotify();
    this.route.params.subscribe({
      next: (next) => {
        this.issueId = next['id'];
      },
    });
    if (this.issueId) {
      this.getIssueById();
    }
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
  ///get case details
  getIssueById() {
    this.spinner.show();
    this._sittingManagementService.getSittingDetails(this.issueId).subscribe({
      next: (next) => {
        this.infoFormNotify.get('number')?.setValue(next.data.noOfDays);
        this.issueDetails = next.data;
        this.branchId = next.data.branchId
        if (this.issueDetails.employees != null) {
          this.newAssigned = next.data.employees;
        } else {
          this.newAssigned = [];
        }
        if (!this.issueDetails.isDraft) {
          if (this.newStep2) {
            this.newAssigned = this.newStep2;
          }
        }
        if(this.branchId) this.getEmployee()
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
  
  ///get employee base of branch
  getEmployee() {
    this._lawsuitManagementService
      .getEmployeeInBranch(this.branchId)
      .subscribe({
        next: (next) => {
          this.spinner.hide();
          this.employees = next.data;
          this.cdr.detectChanges();
        },
      });
  }
  data:any
  checkOfType(e:any){

    this.newAssigned.forEach((x:any)=>{
      if(e.target.value == x.id){
        x.isManager = true
      }else{
        x.isManager=false
      }
    })
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
          isManager: this.infoForm.get('employee')?.value.isManager,

        });
        this.infoForm.reset();
        this.fieldRequired = false;
      } else {
        this.toastr.info(this.translate.instant('addIssue.notaddMorefive'));
      }
    }
  }

  ///delete row
  deleteRow(row: { id: number; name: string; email: string; branch: string;isManager:boolean }) {
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
      this.spinner.show();
      if (this.issueId) {
          this._sittingManagementService
            .addAssigned({ id: +this.issueId, employees: this.newAssigned ,noOfDays: +this.infoFormNotify.get('number')?.value, })
            .subscribe({
              next: (next) => {
                
                this.spinner.hide();
                if (next.success) {
                  this.loadingSave=false

                  this.appconfirmservice.confirm(
              this.translate.instant("addIssue.editSuccess"),'',
              '/assets/imgs/confirm/add.svg')
                } else {
                  this.loadingSave=false

                  this.spinner.hide();
                 this.appconfirmservice.confirm(
              this.translate.instant(next.message),'',
              '/assets/imgs/confirm/warning.svg')
                }
              },
              error: (error) => {
                this.spinner.hide();
                this.loadingSave=false

                this.appconfirmservice.confirm(
                  this.translate.instant(error.error.error.message),'',
                  '/assets/imgs/confirm/warning.svg')
              },
            });
       
      }
    } else {
      this.fieldRequired = true;
      this.loadingSave=false

    }
  }
  //back to first step
  Back() {
    this.router.navigate(['/agent/departments/cases'])
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
