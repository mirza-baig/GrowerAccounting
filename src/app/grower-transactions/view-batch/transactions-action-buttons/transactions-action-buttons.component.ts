import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Router } from '@angular/router';
import { ViewBatchService } from '../view-batch.service';
import { MessageService } from 'primeng/api';
import { UtilityService } from 'src/app/shared/utility.service';

@Component({
  selector: 'app-transactions-action-buttons',
  templateUrl: './transactions-action-buttons.component.html',
  styleUrls: ['./transactions-action-buttons.component.css']
})
export class TransactionsActionButtonsComponent implements ICellRendererAngularComp {
  public params: any;
  public lockSettlements: boolean = true;

  constructor(
    private _router: Router,
    private messageService: MessageService,
    private _service: ViewBatchService,
    private _utilityService: UtilityService,
  ) { }

  agInit(params: any): void {
    this.params = params; // has the full model

    this.getLockStatus();
  }

  public goToEdit() {
    this._router.navigateByUrl(
      'AddGrowerTransactionComponent?Id=' + this.params.value
    );
    return;
  }

  /** Check to see if the site needs to be locked down */
  public getLockStatus() {
    this.lockSettlements = JSON.parse(sessionStorage.getItem('lockSettlements')) as boolean;
  }

  public deleteTransaction() {
    this._service.deleteTransaction(this.params.data.id).subscribe(
      () => {
        // removed in server side, now update the ui
        const templist = [];
        templist.push(this.params.data);
        this.params.api.updateRowData({ remove: templist});
        this.successToast('Transaction has been deleted successfully!');

      }, error => {
        console.error(error);
        this.errorToast(error);
      }

    );
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

  /** Show a toast popup for an error message */
  private errorToast(error: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: error
    });
  }

}
