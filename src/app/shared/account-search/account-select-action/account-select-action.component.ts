import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-select-action',
  templateUrl: './account-select-action.component.html',
  styleUrls: ['./account-select-action.component.css']
})
export class AccountSelectActionComponent implements ICellRendererAngularComp {

  constructor() { }

  public params: any;
  public lockSettlements: boolean = true;

    agInit(params: any): void {
      this.params = params; // has the full model
    }

    public selectAccount() {
      // node.setSelected(true, true);
      this.params.node.setSelected(true, true);
    }

    refresh(): boolean {
        return false;
    }


}
