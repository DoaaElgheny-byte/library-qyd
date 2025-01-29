import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AddIssueComponent } from '../../../issues/add-issue/add-issue/add-issue.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LegalAdviceType, ProjectNameType, ProjectType } from 'src/app/services/enums/client';
import { EmployeeManagementService } from 'src/app/services/api/employee-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProjectService } from 'src/app/services/api/project.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { IssuesService } from 'src/app/services/api/issues.service';
import { ContractService } from 'src/app/services/api/contract.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-project-details-step1',
  templateUrl: './project-details-step1.component.html',
  styleUrls: ['./project-details-step1.component.scss']
})
export class ProjectDetailsStep1Component implements OnInit {
  @Output() callNextStep = new EventEmitter<void>(); // EventEmitter to notify the parent
  @Output() bindValue: EventEmitter<any> = new EventEmitter<any>();
  @Input() projectDetails: any;
  @Input() isAuth: boolean;
  @Input() ProjectDetails: any;
  @Input() newStep1: any;


  private translateService = inject(TranslateService);
  private fb = inject(FormBuilder);
  private employee = inject(EmployeeManagementService);
  private spinner = inject(NgxSpinnerService);
  private projectService = inject(IssuesService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  isService: boolean = true;
  infoForm!: FormGroup;
  currentLang: string = 'en';
  newProjectList: any[] = [];
  employees: any[] = [];
  contracts: any[] = [];
  lawsuits: any[] = [];
  ProjectType = ProjectType;
  projectNameType: any;
  legalAdviceType: any;
  isShowOtherProjectName: boolean = false;
  isShowOtherLegalName: boolean = false;
  isShowLawsuitSelection: boolean = false;
  isShowContractSelection: boolean = false
  projectId: any;
  selectedContractItem: any;
  selectedLawsuitItem: any;

  constructor(
    private contract: ContractService,
    private lawsuit: IssuesService,

  ) { }

  ngOnInit(): void {
    this.initializeDirection();
    this.initForm();
    this.getLegalAdviceType();
    this.getProjectNameType();
    this.getEmployees();
    this.getLawsuitData();
    this.getContractData();
    this.route.params.subscribe({
      next: (params) => {
        this.projectId = params['id'];
        if (this.projectId) {
          this.getEmployees();
          this.getProjectById();
        }
      },
    });
  }

  initializeDirection(): void {
    this.currentLang = this.translateService.currentLang || 'ar';
  }

  initForm(): void {
    this.infoForm = this.fb.group({
      id: [''],
      projectType: [this.ProjectType.Service, Validators.required],
      legalAdvice: [null, Validators.required],
      projectName: [null, Validators.required],
      otherLegalAdviceName: ['',],
      otherProjectName: ['',],
      projectManagerId: [null],
      isProjectHaveCase: [false],
      isProjectHaveContract: [false],
      lawsuitId: [null, Validators.required],
      contractId: [null, Validators.required],
      description: ['', Validators.required],
    });
  }

  changeCaseValue(value: any) {
    this.isShowLawsuitSelection = value
  }

  changeContractValue(value: any) {
    this.isShowContractSelection = value
  }

  getEmployees(): void {
    this.employee.getEmployeesLookups().subscribe({
      next: (res) => {
        this.employees = res.data;
      },
    });
  }

  getProjectNameType(): void {
    this.projectNameType = Object.keys(ProjectNameType)
      .filter((key) => !isNaN(Number(ProjectNameType[key as keyof typeof ProjectNameType])))
      .map((key) => ({ id: Number(ProjectNameType[key as keyof typeof ProjectNameType]), name: key }));
  }

  getLegalAdviceType(): void {
    this.legalAdviceType = Object.keys(LegalAdviceType)
      .filter((key) => !isNaN(Number(LegalAdviceType[key as keyof typeof LegalAdviceType])))
      .map((key) => ({ id: Number(LegalAdviceType[key as keyof typeof LegalAdviceType]), name: key }));
  }

  getProjectById(): void {
    this.spinner.show();
    this.projectService.getProjectDetails(this.projectId).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe({
      next: (res) => {
        this.ProjectDetails = res.data;
        if (!this.ProjectDetails?.isDraft && this.newStep1) this.ProjectDetails = this.newStep1;
        this.infoForm.patchValue(this.ProjectDetails);
        if (this.ProjectDetails.projectType == ProjectType.Service) this.isService = true;
        else this.isService = false;
        if (res.data.projectName != null && res.data.projectName != 0) {
          this.showOtherProjectName();
        }
        if (res.data.legalAdvice != null && res.data.legalAdvice != 0) {
          this.showOtherLegalName();
        }

        this.changeCaseValue(this.ProjectDetails.isProjectHaveCase);
        this.changeContractValue(this.ProjectDetails.isProjectHaveContract);
        const selectedContract = this.contracts.find(contract => contract.id === this.ProjectDetails.contractId);
        this.infoForm.get('contractId')?.setValue(selectedContract);
        const selectedLawsuit = this.lawsuits.find(lawsuit => lawsuit.id === this.ProjectDetails.lawsuitId);
        this.infoForm.get('lawsuitId')?.setValue(selectedLawsuit);
        this.cdr.detectChanges();
      },
      error: () => this.spinner.hide(),
    });
  }

  getContractData() {
    this.contract.getContractLookups().subscribe(res => {
      this.contracts = res.data;
    })
  }

  getLawsuitData() {
    this.lawsuit.getLawsuitLookups().subscribe(res => {
      this.lawsuits = res.data;
    })
  }

  serviceOrConsultation(type: boolean): void {
    this.isService = type;
  }

  showOtherProjectName(): void {

    this.isShowOtherLegalName = false
    this.infoForm.get('legalAdvice')?.setValue(null)
    const value = this.infoForm.get('projectName')?.value;
    this.isShowOtherProjectName = value === '10' || value === 10;
  }

  showOtherLegalName(): void {

    this.isShowOtherProjectName = false;
    this.infoForm.get('projectName')?.setValue(null)
    const value = this.infoForm.get('legalAdvice')?.value;
    this.isShowOtherLegalName = value === 7 || value === '7';
  }

  triggerNextStep(): void {
    this.callNextStep.emit();
  }

  submit(): void {

    if (!this.isShowContractSelection) {
      this.infoForm.get('contractId')?.setValidators(null);
    } else this.infoForm.get('contractId')?.setValidators(Validators.required);
    if (!this.isShowLawsuitSelection) {
      this.infoForm.get('lawsuitId')?.setValidators(null);
    } else this.infoForm.get('lawsuitId')?.setValidators(Validators.required);

    if (!this.isShowOtherLegalName)
      this.infoForm.get('otherLegalAdviceName')?.setValidators(null);
    else
      this.infoForm.get('otherLegalAdviceName')?.setValidators(Validators.required);
    if (!this.isShowOtherProjectName)
      this.infoForm.get('otherProjectName')?.setValidators(null);
    else
      this.infoForm.get('otherProjectName')?.setValidators(Validators.required);
    if (!this.isService) {
      this.infoForm.get('projectName')?.setValidators(null);
      this.infoForm.get('legalAdvice')?.setValidators(Validators.required);
    }
    else {
      this.infoForm.get('projectName')?.setValidators(Validators.required);
      this.infoForm.get('legalAdvice')?.setValidators(null);
    }

    this.infoForm.get('projectName')?.updateValueAndValidity();
    this.infoForm.get('contractId')?.updateValueAndValidity();
    this.infoForm.get('lawsuitId')?.updateValueAndValidity();

    this.infoForm.get('legalAdvice')?.updateValueAndValidity();
    this.infoForm.get('otherProjectName')?.updateValueAndValidity();
    this.infoForm.get('otherLegalAdviceName')?.updateValueAndValidity();


    this.infoForm.updateValueAndValidity();

    if (this.infoForm.invalid) {
      Object.keys(this.infoForm.controls).forEach((field) => {
        const control = this.infoForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      this.toastr.error(this.translateService.instant('attorny.CheckInsertData'));
      return;
    }
    const formValue = { ...this.infoForm.value };
    formValue.projectName = +formValue.projectName;
    formValue.legalAdvice = +formValue.legalAdvice;
    formValue.projectManagerId = +formValue.projectManagerId;
    formValue.lawsuitId = formValue.lawsuitId;
    formValue.contractId = formValue.contractId;
    this.spinner.show();

    if (this.projectId) {
      formValue.id = +this.projectId;
      this.projectService.editProject(formValue).subscribe({
        next: (res) => {
          this.spinner.hide();
          this.triggerNextStep();
          //  this.bindValue.emit({ id: this.projectId, isSuccess: res.success });
          if (!res.success) this.toastr.info(res.message);
        },
        error: (err) => {
          this.spinner.hide();
          this.toastr.error(err.error.error.message);
        },
      });
    } else {
      this.projectService.AddProject(formValue).subscribe({
        next: (res) => {
          this.spinner.hide();
          if (res.success) {
            this.projectId = res.data;
            this.router.navigate(['../add-edit-project', this.projectId], { relativeTo: this.route });
            this.triggerNextStep();
          } else {
            this.toastr.info(res.message);
          }
        },
        error: (err) => {
          this.spinner.hide();
          this.toastr.error(err.error.error?.message);
        },
      });

    }
  }

  submitForCompleteLater() {
    let description = this.infoForm.get('description')?.value;
    let contractId = this.infoForm.get('contractId')?.value;
    let lawsuitId = this.infoForm.get('lawsuitId')?.value;
    let legalAdvice = this.infoForm.get('legalAdvice')?.value;
    let projectName = this.infoForm.get('projectName')?.value;


    if (description == null || description == '') {
      const descriptionControl = this.infoForm.get('description');
      descriptionControl?.setValidators(null);
      descriptionControl?.updateValueAndValidity();
    }
    if (contractId == null) {
      const contractIdControl = this.infoForm.get('contractId');
      contractIdControl?.setValidators(null);
      contractIdControl?.updateValueAndValidity();
    }
    if (lawsuitId == null) {
      const lawsuitIdControl = this.infoForm.get('lawsuitId');
      lawsuitIdControl?.setValidators(null);
      lawsuitIdControl?.updateValueAndValidity();
    }
    if (legalAdvice == null) {
      const legalAdviceControl = this.infoForm.get('legalAdvice');
      legalAdviceControl?.setValidators(null);
      legalAdviceControl?.updateValueAndValidity();
    }
    if (projectName == null) {
      const projectNameControl = this.infoForm.get('projectName');
      projectNameControl?.setValidators(null);
      projectNameControl?.updateValueAndValidity();
    }

    if (this.infoForm.invalid) {
      Object.keys(this.infoForm.controls).forEach((field) => {
        const control = this.infoForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }
    const formValue = { ...this.infoForm.value };

    this.spinner.show();

    if (this.projectId) {
      formValue.id = +this.projectId;
      this.projectService.editProjectForCompleteLater(formValue).subscribe({
        next: (res) => {
          this.spinner.hide();
          this.router.navigate(['/admin/departments/project-management']);

          if (!res.success) this.toastr.info(res.message);
        },
        error: (err) => {
          this.spinner.hide();
          this.toastr.error(err.error.error.message);
        },
      });
    } else {
      this.projectService.AddProjectForCompleteLater(formValue).subscribe({
        next: (res) => {
          this.spinner.hide();
          if (res.success) {
            this.router.navigate(['/admin/departments/project-management']);
          }
        },
        error: (err) => {
          this.spinner.hide();
          this.toastr.error(err.error.error?.message);
        },
      });
    }

  }

  addNewCase() {
    localStorage.setItem('addNewCaseFromProject', 'true')
    this.router.navigate(['/admin/departments/cases/add-issue']);

  }

  addNewContract() {
    localStorage.setItem('addNewContractFromProject', 'true')
    this.router.navigate(['/agent/departments/contracts/add-edit-contract']);


  }
}
