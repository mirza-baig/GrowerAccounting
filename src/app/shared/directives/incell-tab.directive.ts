import {
  OnInit,
  Input,
  OnDestroy,
  Directive,
  ElementRef,
  Renderer2
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import {
  CreateFormGroupArgs,
  GridComponent
} from '@progress/kendo-angular-grid';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[inCellTab]'
})
export class InCellTabDirective implements OnInit, OnDestroy {
  /* tslint:disable-next-line:no-input-rename */
  @Input('inCellTab')
  public createFormGroup: (args: any) => FormGroup;

  @Input()
  public wrap = true;

  private unsubKeydown: () => void;

  constructor(
    private grid: GridComponent,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  public ngOnInit(): void {
    this.unsubKeydown = this.renderer.listen(
      this.el.nativeElement,
      'keydown',
      e => this.onKeydown(e)
    );
  }

  public ngOnDestroy(): void {
    this.unsubKeydown();
  }

  public onKeydown(e: KeyboardEvent): void {
    if (e.key !== 'Tab') {
      // Handle just tabs
      return;
    }

    // let activeCol = this.grid.activeCell.colIndex;
    // if (activeCol == 0) {
    //   e.preventDefault();
    //   // return;
    // }

    let activeRow = this.grid.activeRow;
    if (!activeRow || !activeRow.dataItem) {
      // Not on an editable row
      return;
    }

    if (this.grid.isEditingCell() && !this.grid.closeCell()) {
      // Content validation failed, keep focus in cell
      e.preventDefault();
      return;
    }

    const nav = e.shiftKey
      ? this.grid.focusPrevCell(this.wrap)
      : this.grid.focusNextCell(this.wrap);

    if (!nav) {
      // No next cell to navigate to
      return;
    }

    // Prevent the focus from moving to the next element
    e.preventDefault();

    activeRow = this.grid.activeRow;
    const dataItem = activeRow.dataItem;
    if (dataItem) {
      // Edit focused cell
      if (nav.colIndex != 0) {
        const formGroup = this.createFormGroup({ dataItem });
        this.grid.editCell(activeRow.dataRowIndex, nav.colIndex, formGroup);
      }
    }
  }
}
