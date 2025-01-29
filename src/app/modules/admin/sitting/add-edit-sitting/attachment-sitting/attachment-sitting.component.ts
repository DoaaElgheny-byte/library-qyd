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
import { AuthService } from 'src/app/modules/auth';
import { SittingManagementService } from 'src/app/services/api/sitting-management.service';
import { FilesType } from 'src/app/services/enums/lawsuit';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-attachment-sitting',
  templateUrl: './attachment-sitting.component.html',
  styleUrls: ['./attachment-sitting.component.scss'],
})
export class AttachmentSittingComponent implements OnInit {
  infoForm: FormGroup;
  infoFormSupport: FormGroup;
  hasError: boolean;
  isLoading$: Observable<boolean>;
  private unsubscribe: Subscription[] = [];
  lang: string | null = localStorage.getItem('language');
  fileType = FilesType;
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
  fileName: any;
  fileStorageFileName: any;
  fieldRequired = false;
  @Input() newStep4: any;
  @Output() bindValue: EventEmitter<any> = new EventEmitter<any>();
  issueDetails: any;
  issueId: any;
  currentUser: any;
  constructor(
    private fb: FormBuilder,
    private translationService: TranslationService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private toastr: ToastrService,
    private _sittingManagementService: SittingManagementService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}
  ngAfterViewChecked() {
    this.lang = localStorage.getItem('language');
    this.cdr.detectChanges();
  }
  ngOnInit(): void {
    localStorage.setItem('step', '2');
    this.currentUser = this.authService.getCurrentUser();

    this.route.params.subscribe({
      next: (next) => {
        this.issueId = next['id'];
      },
    });
    this.initForm();
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
        if (this.issueDetails.files != null) {
          this.attachmentFileInfoArray = this.issueDetails.files;
        } else {
          this.attachmentFileInfoArray = [];
        }
        this.cdr.detectChanges();
        this.spinner.hide();
      },
    });
  }
  //init form of info form
  initForm() {
    this.infoForm = this.fb.group({
      name: [null, Validators.compose([Validators.required])],
      attachment: [null, Validators.compose([Validators.required])],
    });
  }
  //upload file of info
  uploadImg(data: any) {
    this.fileName = data.fileName;
    this.fileStorageFileName = data.storageFileName;
    this.infoForm.get('attachment')?.setValue(data.storageFileName);
  }
  //addAttachment of info
  addAttachmentInfo() {
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
  //delete row of info table
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

  //save
  submit() {
      if (this.issueId) {
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
        if (this.issueDetails.isDraft) {
          this._sittingManagementService
            .addAttachment({ id: this.issueId, files: filesArray })
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
            data: { id: this.issueId, files: filesArray },
          });
        }
      }
   
  }
  Back() {
    this.bindValue.emit({
      isBack: true,
    });
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
