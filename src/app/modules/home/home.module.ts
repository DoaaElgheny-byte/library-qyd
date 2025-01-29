import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxIntlTelephoneInputModule } from 'ngx-intl-telephone-input';
import { TranslationModule } from 'src/app/i18n';
import { register as registerSwiperElements } from 'swiper/element/bundle';
import { PackageCardModule } from '../SharedComponent/SharedComponent/package-card/package-card/package-card.module';
import { whatsappComponent } from '../SharedComponent/SharedComponent/whatts-app';
import { FooterModule } from '../visitor/footer/footer.module';
import { HeaderModule } from '../visitor/header/header.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';
import { SoonComponent } from './soon/soon.component';
registerSwiperElements();

@NgModule({
  declarations: [HomeComponent, SoonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  imports: [
    CommonModule,
    whatsappComponent,
    HomeRoutingModule,
    TranslationModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderModule,
    FooterModule,
    RouterModule,
    PackageCardModule,
    NgxIntlTelephoneInputModule,
  ],
})
export class HomeModule { }
