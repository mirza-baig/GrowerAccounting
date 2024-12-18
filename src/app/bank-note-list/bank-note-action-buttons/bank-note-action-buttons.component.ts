import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Router } from '@angular/router';
import { BankNoteListService } from '../bank-note-list.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-bank-note-action-buttons',
  templateUrl: './bank-note-action-buttons.component.html',
  styleUrls: ['./bank-note-action-buttons.component.css']
})
export class BankNoteActionButtonsComponent implements ICellRendererAngularComp {

  constructor(
    private _router: Router,
    private _service: BankNoteListService,
    private _toastService: ToastService,
  ) { }

  public params: any;

    agInit(params: any): void {
      this.params = params; // has the full model
    }

    public goToEdit() {
      this._router.navigateByUrl(
        'AddBankNoteComponent?Id=' + this.params.value
      );
      return;
    }


    public deleteBankNote() {
      const templist = [];
      templist.push(this.params.data);
      this.params.api.updateRowData({ remove: templist});
      this._toastService.successToast('Bank Note has been deleted successfully!');
      this._service.deleteBankNote(this.params.data.id).subscribe(() => {

      }, error => {
        console.error(error);
      });
    }

    refresh(): boolean {
        return false;
    }

}
