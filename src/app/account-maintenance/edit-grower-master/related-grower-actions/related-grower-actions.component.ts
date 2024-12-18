import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { MessageService } from 'primeng/api';
import { RelatedGrowerActionsService } from './related-grower-actions.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';


@Component({
  selector: 'app-related-grower-actions',
  templateUrl: './related-grower-actions.component.html',
  styleUrls: ['./related-grower-actions.component.css']
})
export class RelatedGrowerActionsComponent implements ICellRendererAngularComp {

  constructor(
    private _router: Router,
    private messageService: MessageService,
    private growerService: RelatedGrowerActionsService,
    public dialog: MatDialog,
  ) { }

  public params: any;

    agInit(params: any): void {
      this.params = params; // has the full model
    }

    public goToEdit() {
      this._router.navigateByUrl(
        'EditGrowerMasterComponent?Id=' + this.params.data.growerId
      );
      return;
    }

    public deleteConfirm() {
      this.openDialog();
    }

    // todo - make a delete button thing!

    refresh(): boolean {
        return false;
    }

    /***************************************************
   * Modals/Dialogs
   **************************************************/

  /** Show a toast popup for an error message */
  private errorToast(error: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: error
    });
  }

  /** Show a toast popup for a success message */
  private successToast(msg: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: msg
    });
  }
  // CLEANUP: Remove dead code after testing
  /** Show a toast popup for an info message */
  /*private infoToast(msg: string) {
    this.messageService.add({
      severity: 'info',
      summary: 'Information',
      detail: msg
    });
  }*/

  openDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDeleteRelationModal, {
      width: '450px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      // if true, send the delete
      if (result) {

        this.growerService.removeGrowerRelation(this.params.data).subscribe(
          () => {
            // have to delete it as a list
            const templist = [];
            templist.push(this.params.data);
            this.params.api.updateRowData({ remove: templist});
            this.successToast('Relationship has been deleted successfully!');

            // todo - how do we return this grower back to the pool of selectable ones?
          }, error => {
            console.error(error);
            this.errorToast(error);
          });


      }
    });
  }
}


/** modal component for deleting a relation */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'confirm-relation-delete',
  templateUrl: 'confirm-relation-delete.html',
})
// tslint:disable-next-line:component-class-suffix
export class ConfirmDeleteRelationModal {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteRelationModal>) {}
}
