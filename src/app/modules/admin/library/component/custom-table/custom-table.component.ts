import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss'],
})
export class CustomTableComponent implements OnInit {
  @Input() tableData: any; //table data
  @Input() tableHeaders: { text: string; columnKey: string; width?: string }[] =
    [];
  @Input() tableAction: any; //table action
  @Input() striped: boolean = false; //striped
  @Input() dark: boolean = false; //dark
  @Input() border: boolean = false; //border
  @Input() headerStyle: { [key: string]: string } = {
    //header style
    color: 'white',
    'background-color': 'darkblue',
  };
  @Input() normalStyle: { [key: string]: string } = {
    //normal style
    color: 'black',
    'background-color': 'darkblue',
    border: '1px solid darkblue',
  };
  @Input() customTemplates: { [key: string]: TemplateRef<any> } = {}; //custom templates
  @Output() functionSubmit = new EventEmitter<any>(); //output event of action
  @Output() rowClick = new EventEmitter<any>(); // output event of row click
  @Output() rowDoubleClick = new EventEmitter<any>(); // output event of row click
  selectedRowIndex: number | null = null; // selected row index

  constructor() {}

  ngOnInit(): void {
    console.log(this.tableAction);
  }
  handleFn(fnName: string, index: number) {
    this.onRowClick(this.tableData[index], index);
    setTimeout(() => {
      this.functionSubmit.emit(fnName);
    }, 20);
  }
  onRowClick(row: any, index: number): void {
    this.selectedRowIndex = index;
    this.rowClick.emit(row);
  }

  onRowDoubleClick(row: any, index: number): void {
    this.selectedRowIndex = index;
    this.rowDoubleClick.emit(row);
  }

  stopEvent(event: MouseEvent): void {
    event.stopPropagation();
  }
}
