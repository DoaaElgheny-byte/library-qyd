import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { TranslationService } from 'src/app/i18n';
import { AuthService } from 'src/app/modules/auth';
import { IssuesService } from 'src/app/services/api/issues.service';
import { WorkDutyService } from 'src/app/services/api/work-duty.service';
import { FilesType } from 'src/app/services/enums/lawsuit';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-project-attachment',
  templateUrl: './project-attachment.component.html',
  styleUrls: ['./project-attachment.component.scss'],
})
export class ProjectAttachmentComponent implements OnInit, OnDestroy {
  infoForm: FormGroup;
  isLoading$: Observable<boolean>;
  private subscriptions: Subscription[] = [];
  lang: string | null = localStorage.getItem('language');
  fileType = FilesType;
  // attachmentFileInfoArray: AttachmentFileInfo[] = [];
  fileName: any;
  fileStorageFileName: any;
  fieldRequired = false;

  @Output() bindValue: EventEmitter<any> = new EventEmitter<any>();
  @Input() triggerNextStep: () => void;


  infoFormSupport: FormGroup;
  hasError: boolean;
  private unsubscribe: Subscription[] = [];
  attachmentFileInfoArray: {
    id: any;
    classificationName: string;
    imageName: string;
    imageStorageFileName: string;
    filesType: any;
    name: string;
    imageStorageFileURL: string;
    date: string;
  }[] = [];



  issueDetails: any;
  changeProjectToChanceId: any;
  currentUser: any;

  constructor(
    private fb: FormBuilder,
    private translationService: TranslationService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private toastr: ToastrService,
    private workDutyService: WorkDutyService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private IssuesService: IssuesService,

  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.changeProjectToChanceId = this.route.snapshot.params['id'] || null;

    this.initForm();
    if (this.changeProjectToChanceId) {
      this.getChangeProjectToChanceById();
    }
  }

  private initForm(): void {
    this.infoForm = this.fb.group({
      name: [null, Validators.required],
      attachment: [null, Validators.required],
    });
  }

  getChangeProjectToChanceById(): void {

    this.spinner.show();
    this.IssuesService.getChangeProjectToChanceById(this.changeProjectToChanceId).subscribe({
      next: (response) => {
        this.issueDetails = response.data;
        this.attachmentFileInfoArray = response.data?.changeToChanceFiles || [];
        this.spinner.hide();
        this.cdr.detectChanges();
      },
      error: () => {
        this.spinner.hide();
        this.toastr.error('Failed to load issue details.');
      },
    });
  }

  uploadImg(data: { fileName: string; storageFileName: string }): void {
    this.fileName = data.fileName;
    this.fileStorageFileName = data.storageFileName;
    this.infoForm.get('attachment')?.setValue(data.storageFileName);
  }

  addAttachmentInfo(): void {
    if (this.infoForm.invalid) {
      Object.keys(this.infoForm.controls).forEach((field) => {
        // {1}
        const control = this.infoForm.get(field); // {2}
        control?.markAsTouched({ onlySelf: true }); // {3}
      });
      return;
    }

    this.attachmentFileInfoArray.push({
      id: 0,
      classificationName: this.infoForm.get('name')?.value,
      imageName: this.fileName,
      imageStorageFileName: this.fileStorageFileName,
      filesType: this.fileType.AttachmentFile,
      name: this.currentUser.email,
      imageStorageFileURL:
        environment.BlobUrl +
        this.fileStorageFileName,
      date: Date.now().toString(),
    });
    this.fileName = null;
    this.fileStorageFileName = null;
    this.infoForm.reset();
    this.fieldRequired = false;
  }

  private markFormTouched(form: FormGroup): void {
    Object.keys(form.controls).forEach((field) => {
      const control = form.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  private resetForm(): void {
    this.fileName = null;
    this.fileStorageFileName = null;
    this.infoForm.reset();
    this.fieldRequired = false;

  }






  deleteRow(row: {
    id: any;
    classificationName: string;
    imageName: string;
    imageStorageFileName: string;
    filesType: any;
    name: string;
    imageStorageFileURL: string;
    date: string;
  }) {
    const index = this.attachmentFileInfoArray.indexOf(row);
    if (index > -1) {
      this.attachmentFileInfoArray.splice(index, 1);
    }
  }

  submit(id: any, isLater?: any): void {

    this.spinner.show();
    let filesArray: {
      id: any;
      classificationName: string;
      imageName: string;
      imageStorageFileName: string;
      filesType: any;
      name: string;
      imageStorageFileURL: string;
      date: string;
    }[] = [];
    this.attachmentFileInfoArray.forEach((element) => {
      filesArray.push(element);
    });
    if (filesArray == null || filesArray.length == 0) {
      this.spinner.hide();
      if (!isLater) { this.triggerNextStep(); }

      return
    }
    else {
      this.IssuesService
        .AssignedFilesToChangeProjectToChance({ id: id, files: filesArray })
        .subscribe({
          next: (response) => {
            this.spinner.hide();
            if (!isLater) { this.triggerNextStep(); }

            if (!response.success) {
              this.toastr.info(response.message);
            }
          },
          error: (error) => {
            this.spinner.hide();
            this.toastr.error(error.error?.message || 'Failed to save attachments.');
          },
        });
    }
  }

  Back(): void {
    this.bindValue.emit({ isBack: true });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}

interface AttachmentFileInfo {
  id: any;
  classificationName: string;
  imageName: string;
  imageStorageFileName: string;
  filesType: any;
  name: string;
  imageStorageFileURL: string;
  date: string;
}
