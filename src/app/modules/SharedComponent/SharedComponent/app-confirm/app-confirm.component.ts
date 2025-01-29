import { Location } from '@angular/common';
import { Component, Inject, Input, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-app-confirm',
  templateUrl: './app-confirm.component.html',
  styleUrls: ['./app-confirm.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppConfirmComponent implements OnInit {
  @Input() title: string;
  @Input() src: string;
  @Input() close:boolean
  @Input() backUrl:string
  @Input() body?:string


  activeModall = inject(NgbActiveModal);

  constructor(
    private config: NgbModalConfig,
    private activeModal: NgbActiveModal,private _location:Location,
  private router:Router) { 
      this.config.backdrop = 'static';
		  this.config.keyboard = false;
    }

  ngOnInit() {
    if(this.close){
    setTimeout(() => {
          this.activeModal.dismiss();
          if(this.backUrl){
            this.router.navigate([this.backUrl])
          }else{
            this._location.back()
          }
        }, 1000);
    }else {
      setTimeout(() => {
        this.activeModal.dismiss();
        
      }, 2000);
    }
    
  }

}
