import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageChangeComponent } from './SharedComponent/language-change';
import { ConfirmationDialogComponent } from './SharedComponent/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from './SharedComponent/confirmation-dialog/confirmation-dialog.service';
import { TranslationModule } from 'src/app/i18n';
import { BreadcrumbComponent } from './SharedComponent/breadcrumb/breadcrumb/breadcrumb.component';
// import { Conf}
@NgModule({
  declarations: [
 
    LanguageChangeComponent,
    ConfirmationDialogComponent,
    BreadcrumbComponent,
  ],
  imports: [CommonModule, LanguageChangeComponent, TranslationModule],
  exports: [LanguageChangeComponent, ConfirmationDialogComponent],
  providers: [ConfirmationDialogService],
})
export class SharedModule {}
