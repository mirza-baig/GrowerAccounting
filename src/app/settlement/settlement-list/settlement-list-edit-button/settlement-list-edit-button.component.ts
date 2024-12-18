import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Router } from '@angular/router';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'settlement-list-edit-button',
  templateUrl: './settlement-list-edit-button.component.html',
  styleUrls: ['./settlement-list-edit-button.component.css']
})
export class SettlementListEditButtonComponent implements ICellRendererAngularComp {
  public params: any;

  constructor(
    private _router: Router,
  ) { }

  agInit(params: any): void {
    this.params = params; // has the full model
  }

  public goToEdit() {
    this._router.navigateByUrl(
      'EditAccountComponent?Id=' + this.params.value
    );
    return;
  }

  refresh(): boolean {
      return false;
  }


}