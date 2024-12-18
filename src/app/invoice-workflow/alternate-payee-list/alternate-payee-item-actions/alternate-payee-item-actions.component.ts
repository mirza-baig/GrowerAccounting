import { AlternatePayeeListService } from './../alternate-payee-list.service';
import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { MatDialog } from '@angular/material';
import { ToastService } from 'src/app/shared/toast.service';
import { InvoiceDetailsModalComponent } from '../../invoice-details-modal/invoice-details-modal.component';

@Component({
  selector: 'app-alternate-payee-item-actions',
  templateUrl: './alternate-payee-item-actions.component.html',
  styleUrls: ['./alternate-payee-item-actions.component.css']
})
export class AlternatePayeeItemActionsComponent implements ICellRendererAngularComp {
  public params: any;
  detailModal: boolean = false;
  innerWidth: any;
  innerHeight: any;

  constructor(
    private _invoiceService: AlternatePayeeListService,
    private _toastService: ToastService,
    public dialog: MatDialog,
  ) { }

  agInit(params: any): void {
    this.params = params;
    this.innerHeight = window.innerHeight;
    this.innerWidth = window.innerWidth;
  }

  refresh(): boolean {
    return false;
  }

  markAsPaid() {
    this._invoiceService.markInvoiceAsPaid(this.params.value).subscribe(result => {
      // remove from the parent grid
      const templist = [];
      templist.push(this.params.data);
      this.params.api.updateRowData({ remove: templist});
      this._toastService.successToast('You have successfully marked invoice #' + this.params.data.invoice.invoiceNumber + ' as its check sent!');
    }, error => {
      console.error(error);
      this._toastService.errorToast(error);
    });
  }

  public openModal() {
    this.dialog.open(InvoiceDetailsModalComponent, {
      data: { id: this.params.data.invoice.id},
    });
  }

}
