import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'dateDifference',
  standalone:true
})
export class DateDifferencePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}
  transform(value: string): any {
    let myDate = new Date(value);
    var newDate = new Date(myDate.getTime() - myDate.getTimezoneOffset() * 60 * 1000);
  
   
    const inputDate = newDate;

    const currentDate = new Date();
 return newDate;
    //time
    const timeDifference = currentDate.getTime() - inputDate.getTime() ;

    // difference in seconds, minutes, hours, and days
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
 
  }
}
