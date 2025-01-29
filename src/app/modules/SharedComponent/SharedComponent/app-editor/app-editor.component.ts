import { Component, HostListener, Input, OnDestroy, ViewEncapsulation, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Editor, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-editor',
  templateUrl: './app-editor.component.html',
  styleUrls: ['./app-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppEditorComponent),
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.None
})
export class AppEditorComponent implements OnDestroy, ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = 'Type here...';
  isDisabled: boolean = false;
  onChange: any = () => { };
  onTouch: any = () => { };
  html = '';
  editor = new Editor();
  toolbar: Toolbar = [
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['bold', 'italic'],
    ['link'],
    ['bullet_list', 'ordered_list'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['blockquote', 'horizontal_rule'],
    ['text_color', 'background_color'],

    // ['underline', 'strike'],
    // ['text_color', 'background_color'],
    // ['align_left', 'align_center', 'align_right', 'align_justify'],
    // ['horizontal_rule', 'format_clear'],
  ];

  onHtmlChange(html: string) {
    this.html = html;
    this.onChange(this.html);
  }

  writeValue(value: string): void {
    this.html = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
  @HostListener('document:paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    let items;
    if (event.clipboardData) {
      items = event.clipboardData.items;
    } else {
      // Fallback for older browsers
      items = (window as any).clipboardData.items;
    }

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        event.preventDefault();
        return;
      }
    }
  }
  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
