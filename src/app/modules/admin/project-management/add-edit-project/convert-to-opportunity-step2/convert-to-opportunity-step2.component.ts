import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEditClientComponent } from '../../../client/add-edit-client/add-edit-client/add-edit-client.component';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeManagementService } from 'src/app/services/api/employee-management.service';
import { ClientService } from 'src/app/services/api/client.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientType } from 'src/app/services/enums/client';
import { finalize } from 'rxjs';
import { IssuesService } from 'src/app/services/api/issues.service';
import { ToastrService } from 'ngx-toastr';
import { WorkDutyService } from 'src/app/services/api/work-duty.service';
import { WorkDutyStatus } from 'src/app/services/enums/work-duty.enum';
import { TranslateService } from '@ngx-translate/core';
import { ProjectAttachmentComponent } from '../project-attachment/project-attachment.component';


@Component({
  selector: 'app-convert-to-opportunity-step2',
  templateUrl: './convert-to-opportunity-step2.component.html',
  styleUrls: ['./convert-to-opportunity-step2.component.scss']
})
export class ConvertToOpportunityStep2Component implements OnInit {
  @Output() callNextStep = new EventEmitter<void>(); // EventEmitter to notify the parent
  @Output() callPrevStep = new EventEmitter<void>(); // EventEmitter to notify the parent

  private modalService = inject(NgbModal);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private service = inject(IssuesService);
  private workDutyService = inject(WorkDutyService);
  private toastr = inject(ToastrService);

  infoForm: FormGroup;
  clientTypeEnum = ClientType;
  workDutyStatus = WorkDutyStatus

  clients: any[] = [];
  duties: any[] = [];
  totalCount: number;
  page: number = 1;
  pageSize: number = 10;
  lang: string | null = localStorage.getItem('language');
  clientName: string = '';
  clientEmail: string = '';
  clientStatus: string = '';
  clientType: string = '';
  fromSearchInput: boolean = false;
  isShowClients: boolean = false;
  isButtonDisabled: boolean = false;
  selectedClientData = null;
  selectedDutyDataList: any[] = [];
  selectedDutiesId: any[] = [];

  projectId: any;

  @ViewChild(ProjectAttachmentComponent, { static: true })
  projectAttachment: ProjectAttachmentComponent;

  constructor(private clientservice: ClientService, private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
  ) { }
  ngOnInit(): void {
    this.initForm();
    this.getClients();
    this.getDuties();
    this.getRequestId();
  }

  getRequestId() {
    this.route.params.subscribe({
      next: (params) => {
        this.projectId = params['id'];
        if (this.projectId)
          this.getChangeProjectToChanceData();
      },
    });
  }
  @Input() changeProjectToChanceDetails: any;

  getChangeProjectToChanceData() {

    this.service.getChangeProjectToChanceById(this.projectId).subscribe(res => {
      this.changeProjectToChanceDetails = res.data;
      if (this.changeProjectToChanceDetails != null) {
        this.isButtonDisabled = this.changeProjectToChanceDetails.isChangeToChance;
        this.infoForm.patchValue(this.changeProjectToChanceDetails);
        if (this.changeProjectToChanceDetails.employeeId == 0) {
          this.infoForm.get('employeeId')?.setValue(null)
        }
        let duties = this.changeProjectToChanceDetails.dutiesId;
        // عاوز اظهر الليست تاني بتاع العملاء
        this.getClientDetails(this.changeProjectToChanceDetails.employeeId)
        // عاوز برضه اظهر لمهام ف لليست 
        duties.forEach((id: any) => {
          this.getdutyDetails(id);
        });
      }
    })
  }

  triggerNextStep(): void {
    this.callNextStep.emit();
  }

  triggerPrevStep(): void {
    this.callPrevStep.emit();
    window.scrollTo(0, 0)
    // this.router.navigate(['../add-edit-project', this.projectId], { relativeTo: this.route });

  }

  addNewClient() {
    localStorage.setItem('addNewClientFromProject', 'true')
    this.router.navigate(['/agent/departments/clients/add-edit-client'], { queryParams: { step2Id: this.projectId } });
  }

  addNewTask() {
    localStorage.setItem('addNewTaskFromProject', 'true')
    this.router.navigate(['/agent/departments/work-duty/add-edit-workduty/false/0'], { queryParams: { step2Id: this.projectId } });
  }

  getClients(): void {
    this.clientservice.getClientLookups().subscribe({
      next: (res) => {
        this.clients = res.data;
      },
    });
  }

  getClientDetails(id: any) {
    this.clientservice.getClientDetails(id).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe(res => {
      this.selectedClientData = res.data;
      this.cdr.detectChanges();
    })
  }

  selectedClient() {

    this.spinner.show();
    let item = this.infoForm.get('employeeId')?.value;
    this.getClientDetails(item);
  }

  selectedDuty() {
    this.spinner.show();
    let item = this.infoForm.get('dutiesId')?.value;
    this.getdutyDetails(item.id);
  }

  getdutyDetails(id: any) {
    this.workDutyService.getDutyDetails(id).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe(res => {
      this.selectedDutyDataList.push(res.data);
      this.selectedDutiesId.push(res.data.id)
      this.cdr.detectChanges();
    })
  }

  ChangeToChance() {
    this.isButtonDisabled = true
    this.infoForm.get('isChangeToChance')?.setValue(true)
    this.cdr.detectChanges();
  }

  delete() {
    this.selectedClientData = null;
    this.infoForm.get('employeeId')?.setValue(null);
    this.cdr.detectChanges();
  }

  deleteDuty(id: any) {
    const index = this.selectedDutyDataList.findIndex(item => item.id === id);
    if (index !== -1) {
      this.selectedDutyDataList.splice(index, 1);
      this.infoForm.get('dutiesId')?.setValue(null)
    }
    this.selectedDutiesId = this.selectedDutiesId.filter(item => item !== id);
    this.cdr.detectChanges();
  }

  getDuties() {
    this.workDutyService.getDutiesLookups().subscribe(res => {
      this.duties = res.data
    })
  }

  initForm(): void {
    this.infoForm = this.fb.group({
      employeeId: [null, Validators.required],
      projectId: [],
      isChangeToChance: [false, Validators.required],
      dutiesId: [],
    });
  }

  submit() {

    let value = this.infoForm.get('employeeId')?.value;
    let valueChangeToChance = this.infoForm.get('isChangeToChance')?.value;
    if ((value == null || value == '') || (valueChangeToChance == false)) {
      this.toastr.error(this.translate.instant('projectManagement.ShouldInsertOneEmployeeAtLeastAndChangeToChance'));
      return
    }
    if (this.infoForm.invalid) {
      Object.keys(this.infoForm.controls).forEach((field) => {
        const control = this.infoForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }
    const formValue = { ...this.infoForm.value };
    formValue.projectId = +this.projectId;
    formValue.dutiesId = this.selectedDutiesId;
    if (formValue.employeeId.id !== null || formValue.employeeId.id !== undefined) {
      formValue.employeeId = formValue.employeeId;
    } else {
      formValue.employeeId = value;
    }
    this.spinner.show();

    if (this.projectId) {
      this.service.ChangeProjectToChance(formValue).subscribe({
        next: (res) => {
          this.spinner.hide();
          if (res.success) {
            this.projectId = res.data.projectId;
            this.projectAttachment.submit(this.projectId);
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

  submitLater() {
    // localStorage.setItem('currentStep', '1');

    let employeeId = this.infoForm.get('employeeId')?.value;
    let isChangeToChance = this.infoForm.get('isChangeToChance')?.value;

    if (employeeId == null || employeeId == '') {
      const descriptionControl = this.infoForm.get('employeeId');
      descriptionControl?.setValidators(null);
      descriptionControl?.updateValueAndValidity();
    }

    if (isChangeToChance == false) {
      const descriptionControl = this.infoForm.get('isChangeToChance');
      descriptionControl?.setValidators(null);
      descriptionControl?.updateValueAndValidity();
    }

    if (this.infoForm.invalid) {
      Object.keys(this.infoForm.controls).forEach((field) => {
        const control = this.infoForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }
    const formValue = { ...this.infoForm.value };
    formValue.projectId = +this.projectId;
    if (employeeId?.id != null || employeeId != null)
      formValue.employeeId = formValue.employeeId;
    if (formValue.dutiesId)
      formValue.dutiesId = this.selectedDutiesId

    this.spinner.show();
    if (this.projectId) {
      formValue.projectId = +this.projectId;
      this.service.ChangeProjectToChanceCompleteForLater(formValue).subscribe({
        next: (res) => {
          this.spinner.hide();
          if (res.success) {
            this.projectAttachment.submit(this.projectId, true);
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
}
