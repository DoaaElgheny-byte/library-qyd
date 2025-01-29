import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
declare let AOS: any;

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

  lang: string
  constructor(private titleService: Title) { }

  ngOnInit(): void {
    AOS.init()
    this.lang = String(localStorage.getItem('language'));
    
    // Setting page title
    let title = "QYD | About Qyd";
    if (this.lang === "ar"){
      title = "قيد | عن قيد";
    }
    this.titleService.setTitle(title);
  }

}
