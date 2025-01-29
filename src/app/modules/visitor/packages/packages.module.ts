import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllPackagesComponent } from './all-packages/all-packages.component';
import { TranslationModule } from 'src/app/i18n';
import { RouterModule } from '@angular/router';
import { PackageCardModule } from '../../SharedComponent/SharedComponent/package-card/package-card/package-card.module';
import { register as registerSwiperElements } from 'swiper/element/bundle';
registerSwiperElements();



@NgModule({
  declarations: [
    AllPackagesComponent
  ],
  imports: [
    CommonModule,
    TranslationModule,
    PackageCardModule,
    RouterModule.forChild([
      {
        path: '',
        component: AllPackagesComponent,
        data: { breadcrumb: 'Packages' }
      },
    ]),

  ]
})
export class PackagesModule { }
