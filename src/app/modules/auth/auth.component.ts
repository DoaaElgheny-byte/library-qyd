import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from 'src/app/i18n';
import { Location } from '@angular/common';
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '<body[root]>',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  today: Date = new Date();

  selectedLanguage: any;
  @HostBinding('class') class = 'd-flex flex-column flex-root';
  constructor(
    private router: Router,
    private _location: Location,
    private translationService: TranslationService
  ) { }

  ngOnInit(): void {
    this.selectedLanguage = this.translationService.getSelectedLanguage();
  }
  login() {
    this.router.navigate([`auth/login`]);
  }
  selectLanguage() {

    if (this.selectedLanguage == 'ar') {
      this.translationService.setLanguage('en');
      this.selectedLanguage = 'en';
    } else {
      this.translationService.setLanguage('ar');
      this.selectedLanguage = 'ar';
    }
    document.location.reload();
  }
  back() {
    this._location.back();
  }
  ngOnDestroy(): void {
    // BODY_CLASSES.forEach((c) => document.body.classList.remove(c));
  }
}
