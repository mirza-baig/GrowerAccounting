import { IApInvoice } from '../../../models/ap-invoice.interface';
import { ProcessInvoiceRequestItemService } from '../../process-invoice-request-item/process-invoice-request-item.service';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared/toast.service';
import { GridApi } from '@ag-grid-community/all-modules';

@Component({
  selector: 'app-show-invoice-total-component',
  templateUrl: './show-invoice-total-component.component.html',
  styleUrls: ['./show-invoice-total-component.component.css']
})
export class ShowInvoiceTotalComponentComponent implements ICellRendererAngularComp {
  public params: any;
  public invoice: IApInvoice;
  private api: GridApi;

  constructor(
    private _router: Router,
    private ngZone: NgZone,
    private messageService: ToastService,
    private invoiceService: ProcessInvoiceRequestItemService,
  ) { }

  agInit(params: any): void {
    this.params = params; // has the full model

    if (!!this.params.data.invoice.apinvoiceId) {
      this.invoiceService.getInvoice(parseInt(this.params.data.invoice.apinvoiceId.toString(), 10)).subscribe(result => {
        this.invoice = result;
        this.params.api.refreshCells();
      }, error => {
        console.error(error);
      });
    }
  }

  refresh(): boolean {
    return false;
}

}
