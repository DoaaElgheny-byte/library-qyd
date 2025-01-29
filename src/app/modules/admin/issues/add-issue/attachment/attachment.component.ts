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
import { ClientService } from 'src/app/services/api/client.service';
import { IssuesService } from 'src/app/services/api/issues.service';
import { AttachmentType, FilesType } from 'src/app/services/enums/lawsuit';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.scss'],
})
export class AttachmentComponent implements OnInit {
  infoForm: FormGroup;

  hasError: boolean;
  isLoading$: Observable<boolean>;
  private unsubscribe: Subscription[] = [];
  lang: string | null = localStorage.getItem('language');
  fileType = FilesType;
  successLoaded = false;
  fileName: any;
  fileStorageFileName: any;
  fieldRequired = false;
  attachmentFileDataArray: any[] = [];
  lawsuitClassification: any[] = [];
  fileNameData: any;
  fileStorageFileNameData: any;
  fieldRequiredData = false;
  @Output() bindValue: EventEmitter<any> = new EventEmitter<any>();
  issueDetails: any;
  issueId: any;
  currentUser: any;
  @Input() newStep4: any;
  constructor(
    private fb: FormBuilder,
    private translationService: TranslationService,
    private spinner: NgxSpinnerService,
    private _clientService: ClientService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private toastr: ToastrService,
    private _lawsuitManagementService: IssuesService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngAfterViewChecked() {
    this.lang = localStorage.getItem('language');
    this.cdr.detectChanges();
  }
  ngOnInit(): void {
    localStorage.setItem('step', '4');
    this.currentUser = this.authService.getCurrentUser();
    this.getClassification();

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
  getClassification() {
    this._clientService.getLawsuitClassification().subscribe({
      next: (next) => {
        this.lawsuitClassification = next.data;
        this.cdr.detectChanges();
      },
    });
  }
  ///get case details
  getIssueById() {
    
    this.spinner.show();
    this._lawsuitManagementService.getLawsuitDetails(this.issueId).subscribe({
      next: (next) => {
        //  
        this.issueDetails = next.data;
        if (this.issueDetails.lawsuitFiles != null) {
          this.attachmentFileDataArray = this.issueDetails.lawsuitFiles;
        } else {
          this.attachmentFileDataArray = [];
        }
        if (!this.issueDetails.isDraft) {
          if (this.newStep4) {
            if (this.newStep4 != null) {
              this.attachmentFileDataArray = this.newStep4;
            } else {
              this.attachmentFileDataArray =  this.issueDetails.lawsuitFiles;
            }
          }
        }
        this.cdr.detectChanges();
        this.spinner.hide();
      },
    });
  }
  //init form of info form
  initForm() {
    this.infoForm = this.fb.group({
      id: [null],
      lawsuitClassificationAttachmentId: [
        null,
        Validators.compose([Validators.required]),
      ],
      classificationName: [
        null,
        Validators.compose([Validators.required]),
      ],
      attachment: [null, Validators.compose([Validators.required])],
    });
  }
  //upload file of info
  uploadImg(data: any) {
    this.fileName = data.fileName;
    this.fileStorageFileName = data.storageFileName;
    this.infoForm.get('attachment')?.setValue(data.storageFileName);
  }
  classificationRepeated: boolean;
  disableOther:boolean=true
  AttachmentType=AttachmentType
  checkRepeatClassification() {
    let otherValue = this.lawsuitClassification.filter((x:any)=>x.classificationType === AttachmentType.Other)[0].id
   
    if (this.infoForm.get('lawsuitClassificationAttachmentId')?.value == otherValue) {
      this.disableOther=false
      this.infoForm.get('classificationName')?.setValidators([Validators.required]);
      this.infoForm.get('classificationName')?.updateValueAndValidity();
    } else {
      this.infoForm.get('classificationName')?.setValue(null);
      this.disableOther=true
      this.infoForm.get('classificationName')?.setValidators(null);
      this.infoForm.get('classificationName')?.updateValueAndValidity();
      let repeated =this.attachmentFileDataArray.filter((x:any)=>x.lawsuitClassificationAttachmentId == this.infoForm.get('lawsuitClassificationAttachmentId')?.value)[0]
      if(repeated){
        this.classificationRepeated = true
      }else {
        this.classificationRepeated = false
      }
    }
   
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
    let obj = this.lawsuitClassification.find(
      (i: any) =>
        i.id == this.infoForm.get('lawsuitClassificationAttachmentId')?.value
    );
    let name = this.lang == 'ar' ? obj.nameAr : obj.nameEn;
    this.attachmentFileDataArray.push({
      id: 0,
      lawsuitClassificationAttachmentId: this.infoForm.get(
        'lawsuitClassificationAttachmentId'
      )?.value,
      classificationName: this.infoForm.get('classificationName')?.value ? this.infoForm.get('classificationName')?.value :name,
      imageName: this.fileName,
      imageStorageFileName: this.fileStorageFileName,
      filesType: this.fileType.AttachmentFile,
      date: new Date(),
      imageStorageFileURL: environment.BlobUrl + this.fileStorageFileName,
    });
    this.fileName = null;
    this.fileStorageFileName = null;
    this.infoForm.reset();
    this.fieldRequired = false;
  }
  //delete row of info table
  deleteRow(index: number) {
    this.attachmentFileDataArray.splice(index, 1);
  }

  ///upload attachment of support
  uploadImgData(data: any) {
    this.fileNameData = data.fileName;
    this.fileStorageFileNameData = data.storageFileName;
  }

  //save
  submit() {
  
    if (this.attachmentFileDataArray.length > 0) {
      if (this.issueId) {
        if (this.issueDetails.isDraft) {
          this.spinner.show();
          this._lawsuitManagementService
            .addAttachment({
              id: this.issueId,
              files: this.attachmentFileDataArray,
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
          this.bindValue.emit({
            isSuccess: true,
            isBack: false,
            data: this.attachmentFileDataArray,
          });
        }
      }
    } else {
      if (this.attachmentFileDataArray.length === 0) {
        this.bindValue.emit({
          isSuccess: true,
          isBack: false,
          data: this.attachmentFileDataArray,
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
