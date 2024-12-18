import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Router } from '@angular/router';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'edit-account-button',
  templateUrl: './edit-account-button.component.html',
  styleUrls: ['./edit-account-button.component.css']
})
export class EditAccountButtonComponent implements ICellRendererAngularComp {

  constructor(
    private _router: Router,
  ) { }

  public params: any;

    agInit(params: any): void {
      this.params = params; // has the full model
    }

    public goToEdit() {
      this._router.navigateByUrl(
        'EditAccountComponent?id=' + this.params.data.id
      );
      return;
    }

    // todo - make a delete button thing!

    refresh(): boolean {
        return false;
    }

}
