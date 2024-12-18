import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';


@Injectable()
/** Service for wrapping around Prime NG toaster */
export class ToastService {
    constructor(
        private _messageService: MessageService
    ) {}

    /** Show a toast popup for an error message */
  public errorToast(error: string) {
    this._messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: error
    });
  }

  /** Show a toast popup for a success message */
  public successToast(msg: string) {
    this._messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: msg
    });
  }
  /** Show a toast popup for an info message */
  public infoToast(msg: string) {
    this._messageService.add({
      severity: 'info',
      summary: 'Information',
      detail: msg
    });
  }

}
