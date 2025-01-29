import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VisibilityService {
  visibilityChange$ = new Subject<boolean>();

  constructor() {
    document.addEventListener('visibilitychange', () => {
      this.visibilityChange$.next(!document.hidden);
    });
  }
}