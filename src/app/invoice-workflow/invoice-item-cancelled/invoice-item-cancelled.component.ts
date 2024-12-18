import { Component, OnInit } from '@angular/core';
import { IApinvoicePaymentRequest } from 'src/app/models/ap-invoice-payment-request.interface';
import { IWorkflowActionHistory } from 'src/app/models/workflow-action-history.interface';
import { InvoiceItemCancelledService } from './invoice-item-cancelled.service';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkflowContactManagementService } from '../workflow-contact-management/workflow-contact-management.service';
import { IWorkflowContact } from 'src/app/models/workflow-contact.interface';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-invoice-item-cancelled',
  templateUrl: './invoice-item-cancelled.component.html',
  styleUrls: ['./invoice-item-cancelled.component.css']
})
export class InvoiceItemCancelledComponent implements OnInit {
  pageTitle = 'Invoice Payment Request Approval';
  moduleTitle = 'Invoice';
  innerWidth: number;
  innerHeight: number;

  // url
  token: string;

  // models
  invoice: IApinvoicePaymentRequest;
  id: number;
  actions: IWorkflowActionHistory[] = [];
  contacts: IWorkflowContact[] = [];
  loaded: boolean = false;

  constructor(
    private _invoiceService: InvoiceItemCancelledService,
    private _contactService: WorkflowContactManagementService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _messageService: ToastService,
  ) { }

  ngOnInit() {
    // set dimensions
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

    // get the batch id
    this._route.queryParams.subscribe(params => {
      this.token = params['token'] as string;
    });
    this.token = this.token.replace('\\', '');
    this.loadContacts();


  }

  private loadContacts() {
    this._contactService.getWorkflowContacts().subscribe(
      result => {
        this.contacts = result;
        this.loadInvoice(this.token);
      }, error => {
        console.error(error);
        this._messageService.errorToast(error);
      }
    );

  }

  private getContact(id: number) {
    const match = this.contacts.find(c => c.id.toString() === id.toString());
    return match.firstName + ' ' + match.lastName;
  }

  /** load the token */
  private loadInvoice(token: string) {
    this._invoiceService.getInvoiceByToken(token).subscribe(
      result => {
        this.invoice = result;
        this.id = result.id;
        this.loadHistory(result.id);
      }, error => {
        console.error(error);
        this._messageService.errorToast(error);
      }
    );

  }

  private loadHistory(id: number) {
    this._invoiceService.getWorkflowActionHistory(id).subscribe(
      result => {
        this.actions = result;
        this.loaded = true;
      }, error => {
        console.error(error);
        this._messageService.errorToast(error);
      }
    );
  }

  private getTime(date: string) {
    return new Date(date).toLocaleTimeString('en-US');
  }

}
