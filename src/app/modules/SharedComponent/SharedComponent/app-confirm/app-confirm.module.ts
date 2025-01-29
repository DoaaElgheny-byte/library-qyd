import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppConfirmComponent } from './app-confirm.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
  ],
  declarations: [AppConfirmComponent]
})
export class AppConfirmModule { }
