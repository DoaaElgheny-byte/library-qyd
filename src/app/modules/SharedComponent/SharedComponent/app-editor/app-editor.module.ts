import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppEditorComponent } from './app-editor.component';
import { NgxEditorModule } from 'ngx-editor';
import { FormsModule } from '@angular/forms';
import { TranslationModule } from 'src/app/i18n';

@NgModule({
  imports: [
    CommonModule,
    NgxEditorModule,
    FormsModule,
    TranslationModule
  ],
  declarations: [AppEditorComponent],
  exports: [AppEditorComponent],
})
export class AppEditorModule { }
