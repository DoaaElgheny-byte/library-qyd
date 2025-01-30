import { Component, OnInit } from '@angular/core';
import { ToasterService } from './toaster.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-toaster',
  templateUrl: './custom-toaster.component.html',
  styleUrls: ['./custom-toaster.component.scss'],
  standalone:true,
  imports:[CommonModule]
})
export class CustomToasterComponent implements OnInit {
  message :string = '';
  title:string=''
  icon:string=''
  bgColor:string=''
  color:string=''
  textColor:string=''
  show = false;
  constructor(private toastService: ToasterService) { }

  ngOnInit(): void {
    this.toastService.toast$.subscribe(toast => {
      this.message = toast.message;
      this.title = toast.title;
      this.icon = toast.icon;
      this.bgColor = toast.bgColor;
      this.color = '5px solid' + toast.color;
      this.textColor = toast.textColor
      this.show = true;
      setTimeout(() => {
        this.show = false;
      }, 3000);
    });

  }

}
