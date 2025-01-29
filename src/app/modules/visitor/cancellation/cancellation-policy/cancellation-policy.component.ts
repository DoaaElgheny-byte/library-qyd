import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-cancellation-policy',
  templateUrl: './cancellation-policy.component.html',
  styleUrls: ['./cancellation-policy.component.scss']
})
export class CancellationPolicyComponent implements OnInit {
  lang: string;

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.lang = String(localStorage.getItem('language'));
    
    // Setting page title
    let title = "QYD | Cancelation Policy";
    if (this.lang === "ar"){
      title = "قيد | سياسة الإلغاء";
    }
    this.titleService.setTitle(title);
  }

}
