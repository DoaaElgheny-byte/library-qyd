import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitorComponent } from './visitor.component';
import { HeaderModule } from '../header/header.module';
import { Routes, RouterModule } from '@angular/router';
import { TranslationModule } from 'src/app/i18n';
import { VisitorRoutingModule } from './visitor-routing';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { FooterModule } from '../footer/footer.module';
const routes: Routes = [
  {
    path: '',
    component: VisitorComponent,

    children: VisitorRoutingModule,
  },
];


@NgModule({
  declarations: [
    VisitorComponent
  ],
  imports: [
    CommonModule,
    HeaderModule,
    RouterModule.forChild(routes),
    TranslationModule,
    NgxSpinnerModule,
    ToastrModule,
    TranslateModule,
    FooterModule

  ]
})
export class VisitorModule { }
