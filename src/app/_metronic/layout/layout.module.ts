import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  NgbDropdownModule,
  NgbProgressbarModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TranslationModule } from '../../i18n';
import { ExtrasModule } from '../partials/layout/extras/extras.module';
import { LayoutComponent } from './layout.component';

import { AsideComponent } from './components/aside/aside.component';
import { ContentComponent } from './components/content/content.component';
import { HeaderComponent } from './components/header/header.component';
// import { FooterComponent } from './components/footer/footer.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AdminRouting } from 'src/app/modules/admin/admin-routing';
import { FooterModule } from 'src/app/modules/visitor/footer/footer.module';
import { DrawersModule, DropdownMenusModule, ModalsModule } from '../partials';
import { UserInnerComponent } from '../partials/layout/extras/dropdown-inner/user-inner/user-inner.component';
import { ThemeModeModule } from '../partials/layout/theme-mode-switcher/theme-mode.module';
import { AsideMenuComponent } from './components/aside/aside-menu/aside-menu.component';
import { HeaderMenuComponent } from './components/header/header-menu/header-menu.component';
import { NavbarComponent } from './components/header/navbar/navbar.component';
import { PageTitleComponent } from './components/header/page-title/page-title.component';
import { ScriptsInitComponent } from './components/scripts-init/scripts-init.component';
import { SidebarMenuComponent } from './components/sidebar/sidebar-menu/sidebar-menu.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AccountingComponent } from './components/toolbar/accounting/accounting.component';
import { ClassicComponent } from './components/toolbar/classic/classic.component';
import { ExtendedComponent } from './components/toolbar/extended/extended.component';
import { ReportsComponent } from './components/toolbar/reports/reports.component';
import { SaasComponent } from './components/toolbar/saas/saas.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { TopbarComponent } from './components/topbar/topbar.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: AdminRouting,
  },
];

@NgModule({
  declarations: [
    LayoutComponent,
    AsideComponent,
    HeaderComponent,
    ContentComponent,
    // FooterComponent,
    ScriptsInitComponent,
    ToolbarComponent,
    AsideMenuComponent,
    TopbarComponent,
    PageTitleComponent,
    HeaderMenuComponent,
    UserInnerComponent,
    SidebarComponent,
    SidebarMenuComponent,
    NavbarComponent,
    AccountingComponent,
    ClassicComponent,
    ExtendedComponent,
    ReportsComponent,
    SaasComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslationModule,
    InlineSVGModule,
    NgbDropdownModule,
    NgbProgressbarModule,
    ModalsModule,
    DrawersModule,
    DropdownMenusModule,
    NgbTooltipModule,
    TranslateModule,
    ThemeModeModule,
    ExtrasModule,
    NgxSpinnerModule,
    FooterModule
  ],
  exports: [RouterModule, PageTitleComponent],
})
export class LayoutModule { }
