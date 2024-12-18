import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared/toast.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-invoice-request-approval-actions',
  templateUrl: './invoice-request-approval-actions.component.html',
  styleUrls: ['./invoice-request-approval-actions.component.css']
})
export class InvoiceRequestApprovalActionsComponent implements ICellRendererAngularComp {
  public params: any;
  public lockSettlements: boolean = true;
  public rejected: boolean = false;

  public commentsForm: FormGroup;
  public commentsModal: boolean = false;
  public showFile: boolean = true;

  public detailModal: boolean = false;

  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private messageService: ToastService,
  ) { }

  agInit(params: any): void {
    this.params = params; // has the full model
    if (!!!this.params.data.invoice.fileName) {
      this.params.data.isFileViewed = true;
      this.showFile = false;
    }

    this.commentsForm = this._formBuilder.group({
      Comments: new FormControl({
        value: '',
      }, [ Validators.required]),
      Action: new FormControl({
        value: '',
      }),
    });
    this.commentsForm.patchValue({Comments: this.params.data.comment });
    this.commentsForm.patchValue({Action: this.params.data.approval });
  }

  /** Event handler for  changing an approval */
  public changeApprovalEvent(event: any) {
    // if a rejection, prompt for comments
    if (event.value === 'Approved') {
      // only have to update the parent level
      this.params.data.approval = event.value;
      this.params.data.comment = '';
      this.rejected = false;
      this.updateParent();
    } else {
      // rejection event, must require comments
      this.commentsModal = true;
    }
  }

  /** push an update to the parent grid level*/
  public updateParent() {
    const update = [];
    update.push(this.params.data);
    this.params.api.updateRowData({ update: update });
  }

  /** close the comment modal and revert the approval state */
  public cancelRejectComments() {
    this.commentsModal = false;
    this.commentsForm.patchValue({ Comments: this.params.data.comment });
    this.commentsForm.patchValue({ Action: '' });
  }

  /** confirm event */
  public confirmRejectComments() {
    this.params.data.approval = 'Rejected';
    this.params.data.comment = this.commentsForm.value.Comments;
    this.commentsModal = false;
    this.rejected = true;
    this.updateParent();
  }

  refresh(): boolean {
      return false;
  }


}
