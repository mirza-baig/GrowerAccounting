import { Component, ViewChild, ElementRef } from '@angular/core';
import { ICellEditorAngularComp } from '@ag-grid-community/angular';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-currency-cell-editor',
  templateUrl: './currency-cell-editor.component.html',
  styleUrls: ['./currency-cell-editor.component.css']
})
export class CurrencyCellEditorComponent implements ICellEditorAngularComp {
  @ViewChild('valueInput') valueInput: ElementRef;
  public params: any;
  public value: number;
  public valueForm: FormGroup;
  constructor(
    private _formBuilder: FormBuilder,
  ) { }

  /** Return the value to the parent calling component */
  getValue(): any {
    this.value = this.valueForm.value.Value;
    return this.value;

  }

  // cleanup: what is up here
  isPopup(): any {
  }

  agInit(params: any): void {
    this.params = params;
    this.value = params.value;
    // build a form
    this.valueForm = this._formBuilder.group({
      Value: new FormControl({
        value: this.value,
      }),
    });
    // focus the element
    // this.valueInput.nativeElement.focus();
    // this.valueInput.nativeElement.value = this.value;

  }

  // cleanup: do we need this?
  focusIn() {
  }

  // cleanup: do we need this?
  focusOut() {
  }

  refresh(): boolean {
      return false;
  }


}
