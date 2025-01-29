import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslationModule } from 'src/app/i18n';



@NgModule({
  declarations: [
    FooterComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    NgbDropdownModule,
    TranslationModule,
    RouterModule
  ],
  exports:[
    FooterComponent
  ]
})
export class FooterModule { }
