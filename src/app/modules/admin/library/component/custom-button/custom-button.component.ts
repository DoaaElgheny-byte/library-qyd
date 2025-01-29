import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-button.component.html',
  styleUrls: ['./custom-button.component.scss']
})
export class CustomButtonComponent {

  @Input() type:string='button' //submit,reset
  @Input() size:string='lg' //lg,sm
  @Input() title:string='' //button title
  @Input() normalStyle: { [key: string]: string } = { //normal style
    color: 'white',
    'background-color': 'blue',
    border: '1px solid blue',
  };
  @Input() hoverStyle: { [key: string]: string } = { //hover style
    color: 'lightgray',
    'background-color': 'darkblue',
    border: '1px solid darkblue',
  };
  @Output() outputEvent = new EventEmitter<boolean>(); //output event
  @Input() btnIcon: string = ''; // button icon

  isHovered: boolean = false; //hover flag
  output(){
    this.outputEvent.emit(true)
  }

}
