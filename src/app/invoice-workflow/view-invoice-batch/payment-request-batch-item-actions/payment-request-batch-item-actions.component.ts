import { Component, NgZone } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared/toast.service';
import { ViewInvoiceBatchService } from '../view-invoice-batch.service';

@Component({
  selector: 'app-payment-request-batch-item-actions',
  templateUrl: './payment-request-batch-item-actions.component.html',
  styleUrls: ['./payment-request-batch-item-actions.component.css']
})
export class PaymentRequestBatchItemActionsComponent implements ICellRendererAngularComp {
  public params: any;
  public lockSettlements: boolean = true;

  constructor(
    private _router: Router,
    private ngZone: NgZone,
    private messageService: ToastService,
    private _invoiceService: ViewInvoiceBatchService,
  ) { }

  agInit(params: any): void {
    this.params = params; // has the full model
  }

  public goToEdit() {
    setTimeout(() => {
      this.ngZone.run(() => {
        this._router.navigate(['/AddInvoicePaymentRequestComponent'], { queryParams: { Id: this.params.value } });
      });
    }, 100);


  }

  public goToView() {
    setTimeout(() => {
      this.ngZone.run(() => {
        this._router.navigate(['/ViewInvoicePaymentRequestComponent'], { queryParams: { Id: this.params.value } });
      });
    }, 100);


  }

  public deleteInvoice() {
    const templist = [];
      templist.push(this.params.data);
      this.params.api.updateRowData({ remove: templist});
      this.messageService.successToast('Invoice has been deleted successfully!');
      this._invoiceService.deleteInvoicePaymentRequest(this.params.value ).subscribe(() => {

      }, error => {
        console.error(error);
      });
  }

  public sendReminder() {
    // this.params.value
    this._invoiceService.resendInvoicePaymentRequestApprovalEmail(this.params.value).subscribe(
      () => {
        this.messageService.successToast('You have successfully resent the approval email reminder');
      }, error => {
        console.error(error);
        this.messageService.errorToast(error);
      }
    );
  }



  refresh(): boolean {
      return false;
  }


}
