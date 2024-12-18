import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { AddGrowerInvoiceService } from '../add-grower-invoice/add-grower-invoice.service';

@Component({
  selector: 'app-gldistribution-actions',
  templateUrl: './gldistribution-actions.component.html',
  styleUrls: ['./gldistribution-actions.component.css']
})
export class GLDistributionActionsComponent  implements ICellRendererAngularComp {
  public params: any;

  constructor(
    private messageService: MessageService,
    private _invoiceService: AddGrowerInvoiceService,
  ) { }

  agInit(params: any): void {
    this.params = params; // has the full model
  }



  public deleteDistribution() {
    // only have to delete from API if id exists
    if (this.params.data.distributionId > 0) {
      this._invoiceService.deleteAPGLDistributionAccount(this.params.data.distributionId).subscribe(() => {
        // todo - do we need to delete a distribution from the API? or will post handle it

        const templist = [];
        templist.push(this.params.data);
        this.params.api.updateRowData({ remove: templist});

        this.successToast('You have successfully deleted the account distribution!');
      });
    } else {
      // else we can just pop it off the list
      const templist = [];
      templist.push(this.params.data);
      this.params.api.updateRowData({ remove: templist});

      // todo - how do we validate

      this.successToast('You have successfully deleted the account distribution!');
    }




  }

  refresh(): boolean {
      return false;
  }

  /** Show a toast popup for a success message */
  private successToast(msg: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: msg
    });
  }


}
