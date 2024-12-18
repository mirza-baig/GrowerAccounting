import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/utility.service';
import { GrowerInvoiceListService } from '../grower-invoice-list.service';
import {ICurrentUser} from '../../user-management/current-user.interface';

@Component({
  selector: 'app-grower-invoice-list-actions',
  templateUrl: './grower-invoice-list-actions.component.html',
  styleUrls: ['./grower-invoice-list-actions.component.css']
})
export class GrowerInvoiceListActionsComponent implements ICellRendererAngularComp {

  constructor(
    private _router: Router,
    private _utilityService: UtilityService,
    private _invoiceService: GrowerInvoiceListService,
  ) { }

  public params: any;
  public lockSettlements: boolean = true;
  detailModal: boolean = false;
  innerWidth: any;
  innerHeight: any;

    agInit(params: any): void {
      this.params = params; // has the full model
      this.innerHeight = window.innerHeight;
    this.innerWidth = window.innerWidth;

    }

    public goToEdit() {
      this._router.navigateByUrl(
        'AddGrowerInvoiceComponent?Id=' + this.params.value
      );
      return;
    }

    public retryExport() {
      // call the service
      const user = JSON.parse(localStorage.getItem('ActiveDirectoryUser')) as ICurrentUser;
      this.params.data.email = user.email;
      this._invoiceService
      .exportAPInvoices(this.params.data)
      .subscribe(
        data => {
          try {
            if (data.statusCode === 200) {
              this.params.data.status = 'Exported';
            }
          } catch (e) {
            console.error(e);
          }
        },
        error => {
          console.error(error);
        }
      );
    }

    /** Check to see if the site needs to be locked down */
  public getLockStatus() {
    this._utilityService
      .isSettlementInProcess()
      .subscribe(
        data => {
          try {
            this.lockSettlements = data;
          } catch (e) {
            console.error(e);
          }
        },
        error => {
          console.error(error);
        }
      );
  }

    refresh(): boolean {
        return false;
    }

}
