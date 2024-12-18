import { Component, OnInit, NgZone } from '@angular/core';
import { ToastService } from 'src/app/shared/toast.service';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice-batch-list-actions',
  templateUrl: './invoice-batch-list-actions.component.html',
  styleUrls: ['./invoice-batch-list-actions.component.css']
})
export class InvoiceBatchListActionsComponent implements ICellRendererAngularComp {
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

  public goToEdit() {
    setTimeout(() => {
      // this._router.navigateByUrl(
      //   'ViewInvoiceBatchComponent?Id=' + this.params.value
      // );

      this.ngZone.run(() => {
        this._router.navigate(['/ViewInvoiceBatchComponent'], { queryParams: { Id: this.params.value } });
      });
      
    }, 100);  
    
    return;
  }


  refresh(): boolean {
      return false;
  }


}
