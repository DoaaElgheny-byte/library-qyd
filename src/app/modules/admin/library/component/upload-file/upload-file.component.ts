import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { DomSanitizer } from '@angular/platform-browser';
import { UploadFileService } from 'src/app/services/api/upload-file';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { CustomButtonComponent } from 'src/app/modules/admin/library/component/custom-button/custom-button.component';
import { CustomFormComponent } from 'src/app/modules/admin/library/component/custom-form/custom-form.component';
import { CustomTableComponent } from 'src/app/modules/admin/library/component/custom-table/custom-table.component';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TranslationModule } from 'src/app/i18n';
@Component({
  selector: 'app-upload-file-alone',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => UploadFileComponentAlone),
    },
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslationModule,
    HttpClientModule,
    NgxSpinnerModule,
    InlineSVGModule,
  ],
})
export class UploadFileComponentAlone implements OnInit {
  public files: any[] = [];
  @Input() flag: number;
  @Input() fileName: any;
  file: any;
  @Input() showDetails: boolean = true;
  @ViewChild('myFileInput') myFileInput: { nativeElement: { value: string } };

  @Input() isRequired: boolean = false;
  @Input() isMultiple: boolean = false;
  @Input() isDownLoad: boolean = false;
  @Input() downloadURL: string;
  @Input() label: string = '';
  @Input() id = 'file-5';
  @Input() imagePersonal: any;
  @Input() acceptedExtensions: string[] = [
    'png',
    'gif',
    'jpg',
    'pdf',
    'doc',
    'docx',
    'xlsx',
    'xls',
    'iso',
    'mp3',
    'mpeg',
    'mp4',
    'vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'msword',
    'svg',
    'image/svg+xml',
    'svg+xml',
    'jpeg',
  ];

  @Output() bindValue: EventEmitter<any> = new EventEmitter<any>();
  @Output() uploadEvent: EventEmitter<any> = new EventEmitter<any>();

  acceptedExtensionsString: string;
  @Input() url: any;
  @Input() labelUploaded: string;
  @Input() delName: boolean;
  constructor(
    private uploadFileService: UploadFileService,
    private toastr: ToastrService,
    private spinnerService: NgxSpinnerService,
    private _sanitizer: DomSanitizer,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    //this.url = this.imagePersonal;
    this.acceptedExtensionsString = this.acceptedExtensions.reduce(
      (str, ext) => `.${ext},${str}`,
      ''
    );
    if (this.labelUploaded) {
      this.fileName = this.labelUploaded;
      this.cdr.detectChanges();
    }
  }

  onSelectFile(files: FileList) {
    if (files && files[0]) {
      for (let index = 0; index < files.length; index++) {
        let fileEtenion = files[index].type.substring(
          files[index].type.indexOf('/') + 1
        );
        if (this.acceptedExtensions.includes(fileEtenion)) {
          this.spinnerService.show();

          let name = files[index].name;

          let reader = new FileReader();

          reader.readAsDataURL(files[index]); // read file as data url

          if (fileEtenion !== 'mp4' && files[index].size <= 2097152) {
            reader.onload = (event: any) => {
              let file = event.target.result;

              if (
                files[index].type ==
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                files[index].type ==
                  'vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                files[index].type == 'docx'
              ) {
                file = file.slice(84, file.length);
              }
              if (
                files[index].type == 'msword' ||
                files[index].type == 'doc' ||
                files[index].type == 'application/msword'
              ) {
                file = file.slice(31, file.length);
              }

              if (
                files[index].type == 'svg' ||
                files[index].type == 'image/svg+xml' ||
                files[index].type == 'svg+xml'
              ) {
                this.url = this.getSVGImageUrl(event.target.result);
                if (this.delName) this.labelUploaded = name;
                if (!this.delName) this.labelUploaded = name;
              } else {
                this.url = event.target.result;
                if (this.delName) this.labelUploaded = name;
                if (!this.delName) this.labelUploaded = name;
              }

              this.uploadEvent.emit({
                fileContent: this.uploadFileService.prepareImageAsBinary(file),
                fileName: name,
              });

              this.uploadFileService.UploadMyFile(file, name).subscribe(
                (res) => {
                  this.spinnerService.hide();
                  this.onChange(res.storageFileName);
                  this.bindValue.emit({
                    storageFileName: res.storageFileName,
                    fileName: name,
                  });
                  this.myFileInput.nativeElement.value = '';
                  this.fileName = name;
                },
                (err) => {
                  this.spinnerService.hide();
                }
              );
            };
          } else if (fileEtenion !== 'mp4' && files[index].size > 2097152) {
            this.spinnerService.hide();
            this.toastr.error(
              this.translate.instant('Shared.TheMaximumFileAllowed')
            );
          } else if (fileEtenion === 'mp4' && files[index].size < 800000000) {
            reader.onload = (event: any) => {
              let file = event.target.result;

              if (
                files[index].type ==
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                files[index].type ==
                  'vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                files[index].type == 'docx'
              ) {
                file = file.slice(84, file.length);
              }
              if (
                files[index].type == 'msword' ||
                files[index].type == 'doc' ||
                files[index].type == 'application/msword'
              ) {
                file = file.slice(31, file.length);
              }

              if (
                files[index].type == 'svg' ||
                files[index].type == 'image/svg+xml' ||
                files[index].type == 'svg+xml'
              ) {
                this.url = this.getSVGImageUrl(event.target.result);
              } else {
                this.url = event.target.result;
              }
              this.uploadFileService.UploadMyFile(file, name).subscribe(
                (res) => {
                  this.spinnerService.hide();
                  this.onChange(res.storageFileName);
                  this.bindValue.emit({
                    storageFileName: res.storageFileName,
                    fileName: name,
                  });
                  this.myFileInput.nativeElement.value = '';
                  this.fileName = name;
                },
                (err) => {
                  this.spinnerService.hide();
                }
              );
            };
          } else {
            this.spinnerService.hide();
            this.toastr.error(
              this.translate.instant('Shared.TheMaximumVedioFileAllowed')
            );
          }
        } else {
          this.spinnerService.hide();
          this.toastr.error(
            this.translate.instant('Shared.CheckUploadedFileFormat')
          );
        }
      }
    }
  }

  getSVGImageUrl(image: any) {
    let base64string = btoa(image);
    return this._sanitizer.bypassSecurityTrustUrl(
      'data:image/svg+xml;base64' + base64string
    );
  }
  onChange = (data: any) => this.writeValue(data);
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  onTouched = () => {};
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  writeValue(obj: any): void {
    Name: obj;
  }
  download() {
    window.open(this.downloadURL);
  }

  deleteImage() {
    this.url = null;
    this.fileName = null;
    this.bindValue.emit({ storageFileName: null, fileName: null });
    this.cdr.detectChanges();
  }
}
