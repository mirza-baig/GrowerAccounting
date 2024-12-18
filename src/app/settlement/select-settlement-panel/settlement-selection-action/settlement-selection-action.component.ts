import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';

@Component({
  selector: 'app-settlement-selection-action',
  templateUrl: './settlement-selection-action.component.html',
  styleUrls: ['./settlement-selection-action.component.css']
})
export class SettlementSelectionActionComponent implements ICellRendererAngularComp {

  constructor(
  ) { }

  public params: any;

    agInit(params: any): void {
      this.params = params; // has the full model
    }

    public selectSettlement() {
      // node.setSelected(true, true);
      this.params.node.setSelected(true, true);
    }

    refresh(): boolean {
        return false;
    }

}
