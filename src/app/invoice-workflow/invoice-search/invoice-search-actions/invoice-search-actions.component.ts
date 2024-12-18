import { InvoiceDetailsModalComponent } from './../../invoice-details-modal/invoice-details-modal.component';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/shared/toast.service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-invoice-search-actions',
  templateUrl: './invoice-search-actions.component.html',
  styleUrls: ['./invoice-search-actions.component.css']
})
export class InvoiceSearchActionsComponent implements ICellRendererAngularComp {
  public params: any;
  detailModal: boolean = false;
  innerWidth: any;
  innerHeight: any;


  constructor(private _toastService: ToastService, public dialog: MatDialog) { }

  agInit(params: any): void {
    this.params = params;
    this.innerHeight = window.innerHeight;
    this.innerWidth = window.innerWidth;
  }

  refresh(): boolean {
    return false;
  }

  openModal() {
    this.dialog.open(InvoiceDetailsModalComponent, {
      data: { id: this.params.data.id},
    });
  }

}
