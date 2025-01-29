import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from 'src/app/i18n';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { ScrollService } from 'src/app/scroll.service';
import { Constants } from 'src/app/services/Constants/constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() headerWhite: boolean = false;
  currentUser: any;
  allRoles = Constants.AllRoles;
  role: String;
  lang: string;
  //= String(localStorage.getItem('language'))
  constructor(
    private authService: AuthService,
    private translationService: TranslationService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private scrollService: ScrollService
  ) { }
  scrollToServiceComponent() {
    console.log(this.router.url);
    if (this.router.url != '/home') {
      this.router.navigate(['/']);
      setTimeout(() => {
        this.scrollService.scrollToServiceComponent('packages');
      }, 100);
    } else {
      this.scrollService.scrollToServiceComponent('packages');
    }
  }
  ngOnInit(): void {
    const storedLanguage = localStorage.getItem('statusOfToggleLogin');

    if (storedLanguage == null || storedLanguage == "true") {
      this.lang = 'ar';
      this.translationService.setLanguage('ar');
    } else {
      this.translationService.setLanguage('en');
      this.lang = 'en';
    }

    let x = String(localStorage.getItem('language'));

    this.currentUser = this.authService.getCurrentUser();

    if (this.currentUser?.roles[0] === Constants.AllRoles.qydSuperAdmin) {
      this.role = Constants.AllRoles.qydSuperAdmin;
    } else if (this.currentUser?.roles[0] === Constants.AllRoles.employee) {
      this.role = Constants.AllRoles.employee;
    } else if (this.currentUser?.roles[0] === Constants.AllRoles.qYDManager) {
      this.role = Constants.AllRoles.qYDManager;
    } else if (this.currentUser?.roles[0] === Constants.AllRoles.qydAgent) {
      this.role = Constants.AllRoles.qydAgent;
    }
  }
  @Output() scrollToSection: EventEmitter<string> = new EventEmitter<string>();

  onLinkClick(sectionId: string): void {
    this.scrollToSection.emit(sectionId);
  }
  selectedLanguage: boolean = false;

  selectLanguage(lang: string) {
    document.location.reload();
    if (lang === 'en') {
      this.translationService.setLanguage('ar');
      localStorage.setItem('statusOfToggleLogin', 'true');
      this.setLanguage('ar');
    } else {
      this.translationService.setLanguage('en');
      localStorage.setItem('statusOfToggleLogin', 'false');
      this.setLanguage('en');
    }
    this.cdr.detectChanges();
  }
  langs = languages;
  language: LanguageFlag;

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
