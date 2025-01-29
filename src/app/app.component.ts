import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslationService } from './i18n';
// language list
import { locale as enLang } from './i18n/vocabs/en';
import { locale as arLang } from './i18n/vocabs/ar';
import { ThemeModeService } from './_metronic/partials/layout/theme-mode-switcher/theme-mode.service';
import { AuthService } from './modules/auth';


@Component({
  // tslint:disable-next-line:component-selector
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  stylesLoaded = false;
  public hostUrl: string = 'https://ej2-aspcore-service.azurewebsites.net/';
  public ajaxSettings: object = {
    url: this.hostUrl + 'api/FileManager/FileOperations'
  };
  qrBuffer: any;

  constructor(
    private translationService: TranslationService,
    private modeService: ThemeModeService,
    private authService: AuthService
  ) {
    // register translations
    this.translationService.loadTranslations(
      enLang,
      arLang

    );
    authService.checkIfneedToClearCache();


  }

  ngOnInit() {
    this.stylesLoaded = true;
  }
}
