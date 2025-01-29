import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
@Component({
  selector: 'app-whats-app',
  standalone: true,
  template: `<div class="whatsapp">
    <a (click)="wattsApp()" aria-label="qyd whatsapp" href="">
      <i class="fab fa-whatsapp" aria-hidden="true"></i>
    </a>
  </div>`,
  styles: [
    `
      .whatsapp {
        position: fixed;
        bottom: 1%;
        left: 1%;
        cursor: pointer;
        z-index: 99999999;
        a {
          cursor: pointer;
          i {
            background: #25d366;
            color: #fff;
            display: inline-block;
            padding: 12px;
            border-radius: 50%;
            font-size: 33px;
            min-width: 60px;
            height: 60px;
            text-align: center;
            transition: all 0.3s;
          }
          &:hover {
            i {
              transform: scale(1.05);
            }
          }
        }
      }
    `,
  ],
})
export class whatsappComponent implements OnInit {
  deviceInfo: any;
  constructor(private deviceService: DeviceDetectorService) { }

  ngOnInit(): void {
    this.epicFunction();
  }

  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
  }
  // wattsApp() {
  //   let href;
  //   if (this.deviceInfo.device == 'iPhone') {
  //     return window.open('https://wa.me/966552202366/?text=' + href, '_blank');
  //   } else {
  //     return window.open(
  //       'https://api.whatsapp.com/send?phone=966552202366&text=' + href,
  //       '_blank'
  //     );
  //   }
  // }
  wattsApp() {
    let href;
    if (this.deviceInfo.device == 'iPhone') {
      return window.open('https://wa.me/966552202366', '_blank');
    } else {
      return window.open(
        'https://api.whatsapp.com/send?phone=966552202366',
        '_blank'
      );
    }
  }
}
