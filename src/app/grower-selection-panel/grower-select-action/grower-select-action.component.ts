import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';

@Component({
  selector: 'app-grower-select-action',
  templateUrl: './grower-select-action.component.html',
  styleUrls: ['./grower-select-action.component.css']
})
export class GrowerSelectActionComponent implements ICellRendererAngularComp {

  constructor(
  ) { }

  public params: any;
  public lockSettlements: boolean = true;

    agInit(params: any): void {
      this.params = params; // has the full model
    }

    public selectGrower() {
      this.params.node.setSelected(true, true);
    }

    refresh(): boolean {
        return false;
    }

}
