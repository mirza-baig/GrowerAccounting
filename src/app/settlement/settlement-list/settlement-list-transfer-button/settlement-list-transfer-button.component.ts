import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Router } from '@angular/router';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'settlement-list-transfer-button',
  templateUrl: './settlement-list-transfer-button.component.html',
  styleUrls: ['./settlement-list-transfer-button.component.css']
})
export class SettlementListTransferButtonComponent implements ICellRendererAngularComp {
  public params: any;

  constructor(
    private _router: Router,
  ) { }

  agInit(params: any): void {
    this.params = params; // has the full model in params.data
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
