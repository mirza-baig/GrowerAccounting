import { IVwApinvoiceWithRequest } from 'src/app/models/vw-ap-invoice-with-request.interface';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { IFileModel } from 'src/app/shared/file-modal/file-model.interface';

@Component({
  selector: 'app-invoice-details-modal',
  templateUrl: './invoice-details-modal.component.html',
  styleUrls: ['./invoice-details-modal.component.css']
})
export class InvoiceDetailsModalComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IVwApinvoiceWithRequest,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

}
