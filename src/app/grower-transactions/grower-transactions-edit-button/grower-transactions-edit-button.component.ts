import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/utility.service';
import { GrowerTransactionsService } from '../grower-transactions.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-grower-transactions-edit-button',
  templateUrl: './grower-transactions-edit-button.component.html',
  styleUrls: ['./grower-transactions-edit-button.component.css']
})
export class GrowerTransactionsEditButtonComponent implements ICellRendererAngularComp {

  constructor(
    private _router: Router,
    private messageService: MessageService,
    private _utilityService: UtilityService,
    private _transactionService: GrowerTransactionsService,
  ) { }

  public params: any;

    agInit(params: any): void {
      this.params = params; // has the full model
      // params.data.Status === 'Posted'
    }

   // command text is reset

    public goToEdit() {
      // try to destroy the parent grid

      setTimeout(() => {
        this.params.api.destroy();
        this._router.navigateByUrl(
          'ViewBatchComponent?Id=' + parseInt(this.params.data.BatchId.toString(), 10)
        );
      }, 100); // 500 seemed stable

      // return;
    }

    public deleteBatch() {
      this._transactionService.deleteTransactionBatch(this.params.data.BatchId).subscribe(
        () => {
          // removed in server side, now update the ui
          const templist = [];
          templist.push(this.params.data);
          this.params.api.updateRowData({ remove: templist});
          this.successToast('Transaction batch has been deleted successfully!');
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
