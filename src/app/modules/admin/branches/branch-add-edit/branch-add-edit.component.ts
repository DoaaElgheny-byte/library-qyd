import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AppConfirmService } from 'src/app/modules/SharedComponent/SharedComponent/app-confirm/app-confirm.service';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';
import { ValidationPattern } from 'src/app/modules/SharedComponent/helper/validator';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { BranchesService } from 'src/app/services/api/branches.service';
import { AttachmentType } from 'src/app/services/enums/branches-state.enum';
import {
  ConditionType,
  Payment,
} from 'src/app/services/enums/payment-conditions.enum';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-branch-add-edit',
  templateUrl: './branch-add-edit.component.html',
  styleUrls: ['./branch-add-edit.component.scss'],
})
export class BranchAddEditComponent implements OnInit {
  @Input() id: string;
  public Branches: any[];
  public form: FormGroup = new FormGroup({});
  public lang: string = String(localStorage.getItem('language'));
  successLoad = false;
  public SportList: any = [];
  public dropdownSettings: IDropdownSettings = {};
  all = this.lang === 'ar' ? 'الكل' : 'All';
  unall = this.lang === 'ar' ? 'إلغاء الكل' : 'UnSelect All';
  regions: any;
  managers: { id: number; name: string }[] = [];
  AttachmentType = AttachmentType;
  agentName: string;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _branchesService: BranchesService,
    private router: Router,
    private appConfirmService: AppConfirmService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private breadcrumbService: BreadcrumbService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.route.params.subscribe({
      next: (next) => {
        this.id = next['id'];
      },
    });
    this.getCondition();
  }
  getCondition() {

    let packageCondition = window.localStorage.getItem(
      'condtions-to-current-user'
    );
    let packageData: any = JSON.parse(packageCondition!);
    if (packageData.paymentType == Payment.Expired) {
      this.router.navigate(['/agent/error-package'], {
        queryParams: { key: 'Expired' },
      });
    } else {
      let condition = packageData.getConditions.find(
        (i: any) => i.conditionType == ConditionType.BranchManagment
      );
      if (condition.updateValue === 0 && !this.id) {
        this.router.navigate(['/agent/error-package'], {
          queryParams: { key: 'Finish' },
        });
      }
    }
  }
  ngOnInit(): void {
    this.breadcrumbService.restoreBreadcrumbsFromStorage();

    this.getRegion();
    this.getClassification();
    if (this.id) {
      this.getManagers();
      this.getPlayerById();
    } else {
      this.authService.getcurrentUserApi().subscribe({
        next: (next) => {
          this.agentName = next.data.name;
          this.form.get('employeeManagerId')?.clearValidators();
          this.form.get('employeeManagerId')?.updateValueAndValidity();
          this.form.get('employeeManagerId')?.setValue(null);
          this.form.get('employeeManagerId')?.disable();
          this.cdr.detectChanges();
          this.successLoad = true;
        },
      });
    }
    this.initForm();
    this.initfileForm();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: this.all,
      unSelectAllText: this.unall,
      itemsShowLimit: 3,
      allowSearchFilter: false,
    };
    this.authService.getcurrentUserApi().subscribe({
      next: (next) => {
        this.agentName = next.data.name;
        this.cdr.detectChanges();
      },
    });
  }
  getRegion() {
    this._branchesService.getRegion().subscribe({
      next: (next) => {
        this.regions = next.data;
        this.cdr.detectChanges();
      },
    });
  }
  getManagers() {
    this._branchesService.getManagerByBranch(this.id).subscribe({
      next: (next) => {
        this.managers = next.data;
        if (this.managers.length === 0) {
          this.form.get('employeeManagerId')?.clearValidators();
          this.form.get('employeeManagerId')?.updateValueAndValidity();
          this.form.get('employeeManagerId')?.setValue(null);
          this.form.get('employeeManagerId')?.disable();
        }
        this.cdr.detectChanges();
      },
    });
  }
  initForm() {
    this.form = this.fb.group({
      id: [],
      nameAr: [
        null,
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(200),
          Validators.pattern(ValidationPattern.arabicOnly),
        ],
      ],
      nameEn: [
        null,
        Validators.compose([
          Validators.minLength(1),
          Validators.maxLength(200),
          Validators.pattern(ValidationPattern.EnglishOnly),
        ]),
      ],
      regionId: [null,],
      nationalAddress: [null,],
      noOfEmployees: [
        null,
        Validators.compose([

          Validators.pattern(ValidationPattern.allNumber),
        ]),
      ],
      employeeManagerId: [null, Validators.compose([Validators.required])],
      files: [null],
    });
  }

  getPlayerById() {
    this.spinner.show();
    this._branchesService.getBranchDetail(this.id).subscribe({
      next: (next) => {
        this.patchValue(next.data);
        this.cdr.detectChanges();
      },
    });
  }
  patchValue(res: any) {
    this.form.patchValue(res);
    if (res.files != null) {
      this.attachmentFileInfoArray = res.files;
    } else {
      this.attachmentFileInfoArray = [];
    }
    this.successLoad = true;
    this.spinner.hide();
    this.cdr.detectChanges();
  }

  /*attachment part */
  classes: any;
  filesForm: FormGroup;
  getClassification() {
    this._branchesService.getClassification().subscribe({
      next: (next) => {
        this.classes = next.data;
        this.cdr.detectChanges();
      },
    });
  }
  classificationRepeated: boolean;
  disableOther: boolean = true;
  checkRepeatClassification() {
    let otherValue = this.classes.filter(
      (x: any) => x.branchAttachmentType === AttachmentType.Other
    )[0].id;

    if (this.filesForm.get('branchNameId')?.value == otherValue) {
      this.disableOther = false;
      this.filesForm
        .get('classificationName')
        ?.setValidators([Validators.required]);
      this.filesForm.get('classificationName')?.updateValueAndValidity();
    } else {
      this.filesForm.get('classificationName')?.setValue(null);
      this.disableOther = true;
      this.filesForm.get('classificationName')?.setValidators(null);
      this.filesForm.get('classificationName')?.updateValueAndValidity();
      let repeated = this.attachmentFileInfoArray.filter(
        (x: any) => x.branchNameId == this.filesForm.get('branchNameId')?.value
      )[0];
      if (repeated) {
        this.classificationRepeated = true;
      } else {
        this.classificationRepeated = false;
      }
    }
  }
  /**Attachment form */
  attachmentFileInfoArray: {
    id: any;
    classificationName: string;
    imageName: string;
    imageStorageFileName: string;
    imageStorageFileURL: string;
    branchNameId: number;
    branchName: string;
    imageURL: string | null
  }[] = [];
  fileName: any;
  fileStorageFileName: any;
  fieldRequired = false;

  initfileForm() {
    this.filesForm = this.fb.group({
      branchNameId: [null, Validators.compose([Validators.required])],
      attachment: [null, Validators.compose([Validators.required])],
      classificationName: [null, Validators.compose([Validators.required])],
    });
  }
  //upload file of info
  uploadImg(data: any) {
    this.fileName = data.fileName;
    this.fileStorageFileName = data.storageFileName;
    this.filesForm.get('attachment')?.setValue(data.storageFileName);
  }
  //addAttachment of info
  addAttachmentInfo() {
    if (this.filesForm.invalid) {
      Object.keys(this.filesForm.controls).forEach((field) => {
        // {1}
        const control = this.filesForm.get(field); // {2}
        control?.markAsTouched({ onlySelf: true }); // {3}
      });
      return;
    }
    let className = this.classes.filter(
      (x: any) => x.id == this.filesForm.get('branchNameId')?.value
    )[0];
    this.attachmentFileInfoArray.push({
      id: 0,
      classificationName: this.filesForm.get('classificationName')?.value,
      imageName: this.fileName,
      imageStorageFileName: this.fileStorageFileName,
      imageStorageFileURL:
        environment.BlobUrl +
        this.fileStorageFileName,
      branchNameId: this.filesForm.get('branchNameId')?.value,
      branchName: this.lang === 'ar' ? className.nameAr : className.nameEn,
      imageURL: null
    });
    this.fileName = null;
    this.fileStorageFileName = null;
    this.disableOther = true;

    this.filesForm.reset();
  }
  //delete row of info table
  deleteRow(row: {
    id: any;
    classificationName: string;
    imageName: string;
    imageStorageFileName: string;
    imageStorageFileURL: string;
    branchNameId: number;
    branchName: string;
    imageURL: string | null

  }) {
    const index = this.attachmentFileInfoArray.indexOf(row);
    if (index > -1) {
      this.attachmentFileInfoArray.splice(index, 1);
    }
  }

  public submit() {
    this.form.get('files')?.setValue(this.attachmentFileInfoArray);
    if (this.form.valid) {
      let data = {
        ...this.form.value,
      };
      if (this.id) this.edit(data);
      if (!this.id) this.add(data);
    } else {
      Object.keys(this.form.controls).forEach((field) => {
        const control = this.form.get(field); // {2}
        control?.markAsTouched({ onlySelf: true });
        return;
      });
    }
  }
  add(data: any) {


    this._branchesService.addNewBranches(data).subscribe({
      next: (next) => {
        this.spinner.hide();
        if (next.success) {
          this.authService.getConditionsToCurrentUser();
          this.appConfirmService.confirm(
            this.translate.instant('branchEditAdd.addSuccess'),
            '',
            '/assets/imgs/confirm/add.svg'
          );
          this.cdr.detectChanges();
        } else {
          this.appConfirmService.confirm(
            next.message,
            '',
            '/assets/imgs/confirm/warning.svg',
            false
          );
        }
      },
      error: (error) => {
        this.spinner.hide();
        this.appConfirmService.confirm(
          error.error.error.message,
          '',
          '/assets/imgs/confirm/warning.svg',
          false
        );
      },
    });
  }
  edit(data: any) {
    if (data.employeeManagerId == 0) {
      data.employeeManagerId = null;
    }
    this._branchesService.editBranches(data).subscribe({
      next: (next) => {
        this.spinner.hide();
        if (next.success) {

          this.appConfirmService.confirm(
            this.translate.instant('branchEditAdd.editSuccess'),
            '',
            '/assets/imgs/confirm/add.svg'
          );
          this.cdr.detectChanges();
        } else {
          this.appConfirmService.confirm(
            next.message,
            '',
            '/assets/imgs/confirm/warning.svg',
            false
          );
        }
      },
      error: (error) => {
        this.spinner.hide();
        this.appConfirmService.confirm(
          error.error.error.message,
          '',
          '/assets/imgs/confirm/warning.svg',
          false
        );
      },
    });
  }
  Back() {
    this.router.navigate(['/agent/departments/branches']);
  }
}
