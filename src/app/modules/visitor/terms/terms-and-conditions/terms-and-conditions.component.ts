import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit {
  lang: string;

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.lang = String(localStorage.getItem('language'));
    
    // Setting page title
    let title = "QYD | Terms and Conditions";
    if (this.lang === "ar"){
      title = "قيد | الشروط والأحكام";
    }
    this.titleService.setTitle(title);
  }

}
