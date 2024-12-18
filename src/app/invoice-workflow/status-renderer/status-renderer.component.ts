import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';

@Component({
  selector: 'app-status-renderer',
  templateUrl: './status-renderer.component.html',
  styleUrls: ['./status-renderer.component.css']
})
export class StatusRendererComponent implements ICellRendererAngularComp {

  public params: any;

  constructor() { }

  agInit(params: any): void {
    this.params = params; // has the full model
  }

  refresh(): boolean {
    return false;
}

}
