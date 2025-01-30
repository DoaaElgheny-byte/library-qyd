import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTooltipConfig, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-custom-storage',
  standalone: true,
  imports: [CommonModule,NgbTooltipModule],
  templateUrl: './custom-storage.component.html',
  styleUrls: ['./custom-storage.component.scss']
})
export class CustomStorageComponent implements OnInit {
  @Input() progressValue :string = '50%';
  @Input() progressColor:string='#1A5EC1'
  @Input() totalStorage:string='30'
  @Input() usedSorage:string='20'
  @Input() tooltipColor:string='#F97316'
  @Input() tooltipLink:string=''
  @Input() tooltipTxt:string='يرجى ترقية مساحة التخزين الخاصة بك'
  constructor(config: NgbTooltipConfig) {
		// customize default values of tooltips used by this component tree
		config.placement = 'top';
	}

  ngOnInit(): void {
    document.documentElement.style.setProperty('--kt-tooltip-bg', this.tooltipColor);

  }

}
