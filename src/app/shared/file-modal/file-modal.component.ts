import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { IFileModel } from './file-model.interface';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-file-modal',
  templateUrl: './file-modal.component.html',
  styleUrls: ['./file-modal.component.css']
})
export class FileModalComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IFileModel,
    public dialog: MatDialog,
    public sanitizer: DomSanitizer,
    ) {}

  public url: string;
  public isAllowedFile: boolean = false;
  public isImage: boolean = false;
  public imageWidth: number;
  public imageHeight: number;

  private allowedMimeTypes: string[] = [
    'application/pdf',
    'image/bmp',
    'image/gif',
    'image/jpeg',
    'image/png',
    'image/tiff',
    'text/plain',
  ];

  ngOnInit() {
    // this.data.url = this.data.url;

    /*
    application/vnd.openxmlformats-officedocument.wordprocessingml.document
    application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
    */
   // transform for documents
    if (!this.allowedMimeTypes.includes(this.data.mimeType)) {
      this.url = 'https://docs.google.com/gview?url=' + encodeURI(this.data.url) + '&embedded=true';
      this.isAllowedFile = false;
      this.downloadFile();
      this.dialog.closeAll();
    } else {
      this.url = this.data.url;
      this.isImage = this.data.mimeType.startsWith('image');

      this.isAllowedFile = true;
    }
  }

  fileUrl() {
    if (this.allowedMimeTypes.includes(this.data.mimeType)) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    } else {
      return '#';
    }
  }

  downloadFile() {
    const anchor = document.createElement('a');
    anchor.download = this.data.fileName;
    anchor.href = this.data.url;
    anchor.click();
  }

}
