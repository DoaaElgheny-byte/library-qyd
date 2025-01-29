import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/modules/SharedComponent/SharedComponent/breadcrumb/breadcrumb.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  isCollapsed = [false];
  list=[0,1,2,3,4,5,6,7,8,9];
  lang: string;
  constructor(
    private breadcrumbService: BreadcrumbService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.lang = String(localStorage.getItem('language'));
    
    // Setting page title
    let title = "QYD | FAQ";
    if (this.lang === "ar"){
      title = "قيد | الأسئلة الشائعة";
    }
    this.titleService.setTitle(title);

    this.breadcrumbService.restoreBreadcrumbsFromStorage();
  }

}
