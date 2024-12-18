import { Component, OnInit } from '@angular/core';
import { IApinvoicePaymentRequest } from 'src/app/models/ap-invoice-payment-request.interface';
import { IWorkflowActionHistory } from 'src/app/models/workflow-action-history.interface';
import { IWorkflowContact } from 'src/app/models/workflow-contact.interface';
import { InvoiceItemCancelledService } from '../invoice-item-cancelled/invoice-item-cancelled.service';
import { WorkflowContactManagementService } from '../workflow-contact-management/workflow-contact-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/shared/toast.service';
import { InvoiceBatchApprovalService } from '../invoice-batch-approval/invoice-batch-approval.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ICurrentUser } from 'src/app/user-management/current-user.interface';

@Component({
  selector: 'app-invoice-request-item-approval',
  templateUrl: './invoice-request-item-approval.component.html',
  styleUrls: ['./invoice-request-item-approval.component.css']
})
export class InvoiceRequestItemApprovalComponent implements OnInit {
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

  // comments form
  commentsForm: FormGroup;
  commentsFormLoaded: boolean = false;
  rejectText: string;
  confirmModal: boolean = false;
  action: string;
  submitted: boolean = false;

  constructor(
    private _invoiceService: InvoiceItemCancelledService,
    private _contactService: WorkflowContactManagementService,
    private _approvalService: InvoiceBatchApprovalService,
    private _formBuilder: FormBuilder,
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

    this.commentsFormLoaded = true;

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

        if (this.invoice.stage === 'Already Approved') {
          const msg = 'The link you used to access this approval page has already been used and is no longer valid.';
          this._router.navigateByUrl(
            'ErrorComponent?errorMessage=' + msg
          );
        }

        this.rejectText = result.stage === 'Accounting Approval' ? 'Reject' : 'Cancel';
        // build the form
        if (result.stage === 'Accounting Approval') {
          this.commentsForm = this._formBuilder.group({
            Comments: new FormControl({
              value: '',
            }),
          });
        } else {
          this.commentsForm = this._formBuilder.group({
            Comments: new FormControl({
              value: '',
            }, [ Validators.required]),
          });
        }

        this.commentsForm.patchValue({ Comments: ''});

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

  public confirmChoice(action: string) {
    this.action = action;
    this.confirmModal = true;
  }

  public submitApproval() {

    this.confirmModal = false;
    this.submitted = true;
    const user = JSON.parse(localStorage.getItem('ActiveDirectoryUser')) as ICurrentUser;
    const userid = this.contacts.find(c => c.email.toLowerCase() === user.email.toLowerCase());

    const approval = {
      id: 0,
      actionTaken: this.action,
      comment: this.commentsForm.value.Comments,
      date: new Date(),
      invoicePaymentRequestId: this.invoice.id,
      stage: this.invoice.stage,
      workflowContactId: userid.id,
    } as IWorkflowActionHistory;
    const approvals = [];
    approvals.push(approval);

    // send to api
    this._approvalService.submitApprovalActions(approvals).subscribe(
      result => {
        if (result.statusCode === 200) {
          this._messageService.successToast('You have successfully submitted your approval actions!');
          setTimeout(() => {
            this.submitted = false;
            this._router.navigateByUrl(
              'DashboardComponent'
            );
          }, 1000);
        } else {
          this._messageService.errorToast('An error occured while processing your request. Please try again');
          this.submitted = false;
        }
      }, error => {
        console.error(error);
        this._messageService.errorToast(error);
        this.submitted = false;
      }
    );
  }

  private getTime(date: string) {
    return new Date(date).toLocaleTimeString('en-US');
  }

}
