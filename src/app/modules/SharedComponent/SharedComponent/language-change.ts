import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from 'src/app/i18n';

const BODY_CLASSES = ['bgi-size-cover', 'bgi-position-center', 'bgi-no-repeat'];

@Component({
  selector: 'app-language-change',
  template: ` <button (click)="selectLanguage()">
    {{ selectedLanguage }}
  </button>`,
})
export class LanguageChangeComponent implements OnInit, OnDestroy {
  selectedLanguage: any;
  @HostBinding('class') class = 'd-flex flex-column flex-root';
  constructor(
 
    private translationService: TranslationService
  ) {
  }

  ngOnInit(): void {

    this.selectedLanguage= this.translationService.getSelectedLanguage();
    BODY_CLASSES.forEach((c) => document.body.classList.add(c));
  }

  selectLanguage() {
    this.selectedLanguage = this.translationService.getSelectedLanguage();
    if (this.selectedLanguage == 'ar') {
      this.translationService.setLanguage('en');
      this.selectedLanguage = 'en';
    } else {
      this.translationService.setLanguage('ar');
      this.selectedLanguage = 'ar';
    }
  }
  ngOnDestroy(): void {
    BODY_CLASSES.forEach((c) => document.body.classList.remove(c));
  }
}
