import { Component, OnInit, NgZone } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-process-invoice-request-actions',
  templateUrl: './process-invoice-request-actions.component.html',
  styleUrls: ['./process-invoice-request-actions.component.css']
})
export class ProcessInvoiceRequestActionsComponent implements ICellRendererAngularComp {
  public params: any;
  public lockSettlements: boolean = true;

  constructor(
    private _router: Router,
    private ngZone: NgZone,
    private messageService: ToastService,
  ) { }

  agInit(params: any): void {
    this.params = params; // has the full model

  }

  // todo - should we adjust the logic here for ones that have already been converted?
  public goToEdit() {
    setTimeout(() => {
      this.ngZone.run(() => {
        this._router.navigate(['/ProcessInvoiceRequestItemComponent'], { queryParams: { Id: this.params.value } });
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


  refresh(): boolean {
      return false;
  }


}
