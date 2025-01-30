import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  private toastSubject = new Subject<
  { message: string,
    title: string,
    icon: string,
    bgColor: string,
    color : string,
    textColor:string
  }>();
  toast$ = this.toastSubject.asObservable();

  showSuccess(message: string,title:string,icon:string,bgColor:string,color:string,textColor:string) {
    this.toastSubject.next({ message,title,icon,bgColor,color,textColor });
  }
}
