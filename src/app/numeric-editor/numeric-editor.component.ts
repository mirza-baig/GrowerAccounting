import { Component, OnInit, AfterViewInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ICellEditorAngularComp } from '@ag-grid-community/angular';
import {fromEvent} from 'rxjs';
import {debounce, debounceTime} from 'rxjs/operators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'numeric-editor',
  templateUrl: './numeric-editor.component.html',
  styleUrls: ['./numeric-editor.component.css']
})

export class NumericEditorComponent implements ICellEditorAngularComp, AfterViewInit {
  private params: any;
  public value: number;

  private numRegex = new RegExp('^-?[0-9]+(\.[0-9]+)?$');
  private cancelBeforeStart: boolean = false;
  private allowNegatives = false;

  @ViewChild('input', { read: ViewContainerRef }) public input;

  agInit(params: any): void {
    this.params = params;
    this.value = this.params.value;

    if (params.allowNegative) {
      this.allowNegatives = true;
    }

    // only start edit if key pressed is a number, not a letter
    // ! needs to allow backspace, tab, and period
    this.cancelBeforeStart =
      params.charPress && '1234567890'.indexOf(params.charPress) < 0;
  }

  getValue(): any {
    return !!this.value ? this.value : 0;
  }

  isCancelBeforeStart(): boolean {
    return this.cancelBeforeStart;
  }

  onKeyDown(event): void {
    if (!this.isKeyPressedNumeric(event)) {
      if (event.preventDefault) { event.preventDefault(); }
    }
  }

  // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
  ngAfterViewInit() {
    window.setTimeout(() => {
      this.input.element.nativeElement.focus();
      // how to select so they don't have to?
    });

    fromEvent(this.input.element.nativeElement, 'keyup')
      .pipe(debounceTime(1000)).subscribe((value) => {
        const numVal = Number(this.value);
        if (!numVal || (!this.allowNegatives && numVal < 0)) {
          this.value = 0;
        }
    });
  }

  private getCharCodeFromEvent(event): any {
    event = event || window.event;
    return typeof event.which === 'undefined' ? event.keyCode : event.which;
  }

  private isCharNumeric(charStr): boolean {
    return !!/\d/.test(charStr);
  }

  /** to allow backspace and only 1 decimal point */
  private isCharOthervalid(charStr): boolean {
    return charStr === 'Backspace'
      || (charStr === '.' && this.numRegex.test(this.value.toString() + '.0')); // this trick will only make the first . work
  }

  private isKeyPressedNumeric(event): boolean {
    const charCode = this.getCharCodeFromEvent(event);
    const charStr = event.key ? event.key : String.fromCharCode(charCode);
    return this.isCharNumeric(charStr) || this.isCharOthervalid(charStr);
  }

  onFocus($event: FocusEvent) {
    console.log($event);
    if (this.value === 0) {this.value = null; }
  }
}
