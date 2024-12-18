import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared/toast.service';
import { AddInvoicePaymentRequestService } from '../add-invoice-payment-request.service';

@Component({
  selector: 'app-farm-distribution-actions',
  templateUrl: './farm-distribution-actions.component.html',
  styleUrls: ['./farm-distribution-actions.component.css']
})
export class FarmDistributionActionsComponent implements ICellRendererAngularComp {
  public params: any;
  public lockSettlements: boolean = true;

  constructor(
    private _router: Router,
    private messageService: ToastService,
    private _paymentService: AddInvoicePaymentRequestService,
  ) { }

  agInit(params: any): void {
    this.params = params; // has the full model

  }

  public goToEdit() {
    this._router.navigateByUrl(
      'ViewInvoiceBatchComponent?Id=' + this.params.value
    );
    return;
  }

  public deleteDistribution() {
    // only have to delete from API if id exists
    if (this.params.data.id > 0) {
      this._paymentService.deleteAPInvoicePaymentFarmDistribution(this.params.data.distributionId).subscribe(() => {
        // todo - do we need to delete a distribution from the API? or will post handle it

        const templist = [];
        templist.push(this.params.data);
        this.params.api.updateRowData({ remove: templist});

        this.messageService.successToast('You have successfully deleted the farm distribution!');
      });
    } else {
      // else we can just pop it off the list
      const templist = [];
      templist.push(this.params.data);
      this.params.api.updateRowData({ remove: templist});

      // todo - how do we validate

      this.messageService.successToast('You have successfully deleted the farm distribution!');
    }




  }



  refresh(): boolean {
      return false;
  }


}
