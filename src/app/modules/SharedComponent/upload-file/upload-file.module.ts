import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { TranslationModule } from 'src/app/i18n';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [UploadFileComponent],
  imports: [
    CommonModule,
    TranslationModule,
    HttpClientModule,
    NgxSpinnerModule,
    InlineSVGModule

  ],
  exports:[UploadFileComponent]
})
export class UploadFileModule { }
