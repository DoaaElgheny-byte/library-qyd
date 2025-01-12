import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button-model',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-model.component.html',
  styleUrls: ['./button-model.component.scss']
})
export class ButtonModelComponent implements OnInit {
  @Input() type:string='button' //submit,reset
  @Input() size:string='lg' //lg,sm
  @Input() title:string=''
  @Input() normalStyle: { [key: string]: string } = {
    color: 'white',
    'background-color': 'blue',
    border: '1px solid blue',
  };
  @Input() hoverStyle: { [key: string]: string } = {
    color: 'lightgray',
    'background-color': 'darkblue',
    border: '1px solid darkblue',
  };
  @Output() outputEvent = new EventEmitter<boolean>();
  isHovered: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }
  output(){
    this.outputEvent.emit(true)
  }
}
