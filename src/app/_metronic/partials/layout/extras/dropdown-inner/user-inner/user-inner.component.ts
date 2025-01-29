import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { TranslationService } from '../../../../../../i18n';
import { AuthService, UserType } from '../../../../../../modules/auth';
import { Constants } from 'src/app/services/Constants/constants';

@Component({
  selector: 'app-user-inner',
  templateUrl: './user-inner.component.html',
})
export class UserInnerComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  class = `menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px`;
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  language: LanguageFlag;
  user$: Observable<UserType>;
  langs = languages;
  currentUser: any;
  isAdmin: boolean;
  private unsubscribe: Subscription[] = [];

  constructor(
    private auth: AuthService,
    private translationService: TranslationService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.setLanguage(this.translationService.getSelectedLanguage());


  }

  logout() {
    this.auth.logout();
    document.location.reload();
  }

  selectLanguage(lang: string) {
    document.location.reload();

    if (lang === 'en') {
      this.translationService.setLanguage('ar');
      this.setLanguage('ar');
      localStorage.setItem('statusOfToggleLogin', 'true');

    } else {
      this.translationService.setLanguage('en');
      this.setLanguage('en');
      localStorage.setItem('statusOfToggleLogin', 'false');

    }
    this.cdr.detectChanges();
  }

  setLanguage(lang: string) {
    this.langs.forEach((language: LanguageFlag) => {
      if (language.lang === lang) {
        language.active = true;
        this.language = language;
      } else {
        language.active = false;
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}

interface LanguageFlag {
  lang: string;
  name: string;
  flag: string;
  active?: boolean;
}

const languages = [
  {
    lang: 'en',
    name: 'English',
    flag: './assets/media/flags/united-states.svg',
  },
  {
    lang: 'ar',
    name: 'العربيه',
    flag: './assets/media/flags/saudi-arabia.svg',
  },
];
