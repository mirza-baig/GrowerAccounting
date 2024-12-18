import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { UtilityService } from 'src/app/shared/utility.service';

@Component({
  selector: 'app-grower-master-edit-button',
  templateUrl: './grower-master-edit-button.component.html',
  styleUrls: ['./grower-master-edit-button.component.css']
})
export class GrowerMasterEditButtonComponent implements ICellRendererAngularComp {

  constructor(
    private _router: Router,
    private _utilityService: UtilityService,
  ) { }

  public params: any;
  public lockSettlements: boolean = true;

    agInit(params: any): void {
      this.params = params; // has the full model
      this.getLockStatus();
    }

    /** Check to see if the site needs to be locked down */
  public getLockStatus() {
    this.lockSettlements = JSON.parse(sessionStorage.getItem('lockSettlements')) as boolean;
  }


    public goToEdit() {
      this._router.navigateByUrl(
        'EditGrowerMasterComponent?Id=' + this.params.value
      );
      return;
    }
    public goToAccountMaintenance() {
      this._router.navigateByUrl(
        'AccountMaintenanceComponent?id=' + this.params.value
      );
      return;
    }

    public goToTransfer() {
      this._router.navigateByUrl(
        'AccountTransferComponent?Id=' + this.params.value
      );
      return;
    }



    // todo - make a delete button thing!

    refresh(): boolean {
        return false;
    }

  displayFarmInformation() {
      this._router.navigateByUrl(
        'GrowerFarmInformationComponent?Id=' + this.params.value
      );
  }
}
