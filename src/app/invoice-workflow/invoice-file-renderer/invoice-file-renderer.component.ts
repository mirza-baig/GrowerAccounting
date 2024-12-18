import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared/toast.service';
import { AddInvoicePaymentRequestService } from '../add-invoice-payment-request/add-invoice-payment-request.service';
import { IApinvoicePaymentRequest } from 'src/app/models/ap-invoice-payment-request.interface';
import { MatDialog } from '@angular/material';
import { FileModalComponent } from 'src/app/shared/file-modal/file-modal.component';

@Component({
  selector: 'app-invoice-file-renderer',
  templateUrl: './invoice-file-renderer.component.html',
  styleUrls: ['./invoice-file-renderer.component.css']
})
export class InvoiceFileRendererComponent  implements ICellRendererAngularComp {
  public params: any;
  // params.data is going to be IInvoicePaymentRequestVM
  public invoiceModelWithFile: IApinvoicePaymentRequest;

  public displayFileReady: boolean = false;
  public blob: Blob;
  public postSubmitted: boolean = false;


  constructor(
    private _router: Router,
    private messageService: ToastService,
    private invoiceService: AddInvoicePaymentRequestService,
    public dialog: MatDialog,
  ) { }

  agInit(params: any): void {
    this.params = params; // has the full model
    this.loadFile();
  }

  /** determine if we need to load the file stream or not */
  public getFileEvent() {
    this.postSubmitted = true;
    if (this.displayFileReady) {
      this.displayFile();
    } else {
      this.loadFile();
    }
  }

  /** get the file from the server so we have the file data */
  public loadFile() {
    this.invoiceService.getAPInvoicePaymentRequestById(this.params.value).subscribe(
      result => {
        this.invoiceModelWithFile = result;
        this.generateFileForView();
      }, error => {
        console.error(error);
      }
    );
  }

  /** make the conversions to the file data to generate a blob (and update the parent grid) */
  public generateFileForView() {
    const byteCharacters = atob(this.invoiceModelWithFile.fileData);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    this.blob = new Blob([byteArray], {type: this.invoiceModelWithFile.mimeType});

    this.displayFileReady = true;

    // this.displayFile();
  }

  /** create a url from the blob and render it */
  public displayFile() {
    const allowedMimeTypes: string[] = [
      'application/pdf',
      'image/bmp',
      'image/gif',
      'image/jpeg',
      'image/png',
      'image/tiff',
      'text/plain',
    ];
    const url = window.URL.createObjectURL(this.blob);

    if (allowedMimeTypes.includes(this.invoiceModelWithFile.mimeType) && this.dialog.openDialogs.length === 0) {
      this.dialog.open(FileModalComponent, {
        data: {
          url: url,
          width: (window.innerWidth * 0.75),
          height: (window.innerHeight * 0.90),
          fileName: this.invoiceModelWithFile.fileName,
          mimeType: this.invoiceModelWithFile.mimeType,
        },
        width: (window.innerWidth * 0.8).toString() + 'px',
        height: (window.innerHeight * 0.95).toString() + 'px',
      });
    } else {
      const anchor = document.createElement('a');
      anchor.download = this.invoiceModelWithFile.fileName;
      anchor.href = url;
      anchor.click();
    }

    // const anchor = document.createElement('a');
    // anchor.download = this.invoiceModelWithFile.fileName;
    // anchor.href = url;
    // anchor.click();
    this.postSubmitted = false;

    this.params.data.isFileViewed = true;
    const update = [];
    update.push(this.params.data);
    this.params.api.updateRowData({ update: update });
    // this.params.redrawRows();
  }

  refresh(): boolean {
      return false;
  }


}
