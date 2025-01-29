import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Validators } from 'ngx-editor';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { EmployeeLookupDto, LookupGuidDto } from 'src/app/modules/auth/models/agent-user.model';
import { EmployeeManagementService } from 'src/app/services/api/employee-management.service';

@Component({
  selector: 'app-view-create-team',
  templateUrl: './view-create-team.component.html',
  styleUrls: ['./view-create-team.component.scss']
})
export class ViewCreateTeamComponent implements OnInit {

  lang: string | null = localStorage.getItem('language');
  all = this.lang === 'ar' ? 'الكل' : 'All';
  unall = this.lang === 'ar' ? 'إلغاء الكل' : 'UnSelect All';
  employeeTeamForm: FormGroup;
  @Input() teamId!: string;

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: this.all,
    unSelectAllText: this.unall,
    itemsShowLimit: 50,
    allowSearchFilter: true,
  };

  dropdownList = [] as EmployeeLookupDto[];
  selectedItems = [] as EmployeeLookupDto[];
  activeModal = inject(NgbActiveModal);

  isEditTeam: boolean = false;

  constructor(
    private employeeManagementService: EmployeeManagementService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {

    this.buildForm();
    this.getEmployees();
    if (this.teamId != null) {
      this.getEmployees();
      this.isEditTeam = true;
    }
  }

  getEmployees() {
    this.employeeManagementService.getEmployeesLookups().subscribe({
      next: (next) => {
        this.dropdownList = next.data;
        if (this.teamId != null) {
          this.getData(this.teamId);
        }
      },
    });
  }

  getData(id: any) {
    this.spinner.show();
    if (id != null) {
      this.employeeManagementService.getTeamAndEmployeeByTeamId(id).pipe(finalize(() => {
        this.spinner.hide();
      })).subscribe(res => {

        this.employeeTeamForm.get('name')?.setValue(res.data.name);
        this.employeeTeamForm.get('id')?.setValue(id);
        this.selectedItems = res.data.employeeTeamIds;
        let employeeIds = res.data.employeeTeamIds;
        this.selectedItems = this.dropdownList.filter(item =>
          employeeIds.includes(item.id)
        )
        this.employeeTeamForm.controls['employeeTeamIds'].setValue(
          this.selectedItems.map(item => item)
        );
      })
    }
  }

  buildForm() {
    this.employeeTeamForm = this.fb.group({
      id: null,
      name: [null, Validators.required],
      employeeTeamIds: [[], Validators.required]
    })
  }

  onSubmit() {
    if (this.isEditTeam) {
      this.editTeam();
    } else {
      this.saveTeam();
    }
  }

  saveTeam() {
    this.spinner.show();
    const ids = this.employeeTeamForm.get('employeeTeamIds')?.value.map((employee: any) => employee.id);

    const submissionData = {
      ...this.employeeTeamForm.value,
      employeeTeamIds: ids
    };
    if (this.employeeTeamForm.valid && this.employeeTeamForm.value.name != "" && this.employeeTeamForm.value.name != null) {
      if (ids.length == 0) {
        this.toastr.info(this.translate.instant('attorny.MustAddAtLeastOneItem'));
        this.spinner.hide();
        return;
      }
      this.employeeManagementService.AddTeam(submissionData).subscribe({
        next: (next) => {
          if (next.success) {
            this.toastr.success(this.translate.instant('attorny.TeamddSuccess'));
            this.activeModal.close();
            this.cdr.detectChanges();
          } else {
            this.toastr.error(this.translate.instant('attorny.NameOfTeamExist'));
            this.spinner.hide();
          }
        },
        error: (error) => {
          this.spinner.hide();
        },
      })
    }
    else {
      this.spinner.hide();
      this.toastr.error(this.translate.instant('attorny.CheckInsertData'));
    }
  }

  editTeam() {

    this.spinner.show();
    const ids = this.employeeTeamForm.get('employeeTeamIds')?.value.map((employee: any) => employee.id);

    const submissionData = {
      ...this.employeeTeamForm.value,
      employeeTeamIds: ids
    };
    if (this.employeeTeamForm.valid && this.employeeTeamForm.value.name != "" && this.employeeTeamForm.value.name != null) {
      if (ids.length == 0) {
        this.toastr.info(this.translate.instant('attorny.MustAddAtLeastOneItem'));
        this.spinner.hide();
        return;
      }
      this.employeeManagementService.EditTeam(submissionData).subscribe({
        next: (next) => {
          this.spinner.hide();
          if (next.success) {
            this.toastr.success(this.translate.instant('attorny.TeamEditSuccess'));
            this.activeModal.close();
            this.cdr.detectChanges();
          } else {
            this.toastr.error(this.translate.instant('attorny.NameOfTeamExist'));
            this.spinner.hide();
          }
        },
        error: (error) => {
          this.spinner.hide();
        },
      })
    } else {
      this.spinner.hide();
      this.toastr.error(this.translate.instant('attorny.CheckInsertData'));
    }
  }
}
