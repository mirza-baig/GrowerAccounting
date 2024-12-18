import { AddInvoicePaymentRequestService } from './../../add-invoice-payment-request/add-invoice-payment-request.service';
import { IApinvoicePaymentFarmDistributionVM } from './../../../models/ap-invoice-payment-farm-distribution-vm.interface';
import { IApinvoicePaymentFarmDistribution } from './../../../models/ap-invoice-payment-farm-distribution.interface';
import { Component, Inject, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-farm-distribution-renderer',
  templateUrl: './farm-distribution-renderer.component.html',
  styleUrls: ['./farm-distribution-renderer.component.css']
})
export class FarmDistributionRendererComponent implements ICellRendererAngularComp {

  public params: any;
  distributions: IApinvoicePaymentFarmDistributionVM[] = [];

  constructor(
    private invoiceService: AddInvoicePaymentRequestService,
    public dialog: MatDialog,
  ) { }

  agInit(params: any): void {
    this.params = params;
    this.loadDistributions(params.data.invoice.id);

  }

  private loadDistributions(id: number) {
    this.invoiceService.getInvoicePaymentFarmDistributionVMs(id).subscribe(result => {
      this.distributions = result;
      // if (result.length > 1) {
      //   this.params.node.setRowHeight(50 * result.length + 50);
      // }
    }, error => {
      console.error(error);
    });
  }

  refresh(): boolean {
    return false;
  }

  public openModal() {
    this.dialog.open(ShowGrowerModal, {
      data: this.distributions,
    });
  }
}


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'show-grower-table',
  templateUrl: 'show-grower-table.html',
})
// tslint:disable-next-line:component-class-suffix
export class ShowGrowerModal {

  constructor(
    public dialogRef: MatDialogRef<ShowGrowerModal>,
    @Inject(MAT_DIALOG_DATA) public data: IApinvoicePaymentFarmDistributionVM[],
    public dialog: MatDialog,
    ) {}
}
