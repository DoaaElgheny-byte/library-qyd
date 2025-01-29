import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
  lang: string;

  constructor(
    private spinner:NgxSpinnerService,
    private breadcrumbService: BreadcrumbService,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.lang = String(localStorage.getItem('language'));
    
    // Setting page title
    let title = "QYD | Privacy Policy";
    if (this.lang === "ar"){
      title = "قيد | سياسة الخصوصية";
    }
    this.titleService.setTitle(title);

    this.breadcrumbService.restoreBreadcrumbsFromStorage();
  }
  downloadPrivacy() {
    this.spinner.show();
    window.open(`/assets/privacy.pdf`);
    this.spinner.hide();
  }
}
