import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslationModule } from 'src/app/i18n';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';

@NgModule({
  declarations: [ConfirmationDialogComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    NgMultiSelectDropDownModule,
    FormsModule,
    ReactiveFormsModule,
    TranslationModule
  ],
  exports: [ConfirmationDialogComponent]
})
export class ConfirmationDialogModule {}
