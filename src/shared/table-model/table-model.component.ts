import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-model',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-model.component.html',
  styleUrls: ['./table-model.component.scss']
})
export class TableModelComponent implements OnInit {
  @Input() tableData:any
  @Input() tableHeaders:string[]=[]
  @Input() displayedColumns:string[]=[]
  @Input() tableAction:any
   @Output() functionSubmit = new EventEmitter<any>();
   @Input() customTemplates: { [key: string]: TemplateRef<any> } = {};

  constructor() { }

  ngOnInit(): void {
  }
  handleFn(fnName:string){
    this.functionSubmit.emit(fnName)
  }
}
