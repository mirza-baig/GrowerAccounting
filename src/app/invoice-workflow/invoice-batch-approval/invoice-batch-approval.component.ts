import { Component, OnInit, HostListener } from '@angular/core';
import { IApinvoicePaymentRequestBatch } from 'src/app/models/ap-invoice-payment-request-batch.interface';
import { IApinvoicePaymentRequest } from 'src/app/models/ap-invoice-payment-request.interface';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { IGrowerMaster } from 'src/app/models/grower-master.interface';
import { IVwApvendorMaster } from 'src/app/models/vw-apvendor-master.interface';
import { InvoiceBatchApprovalService } from './invoice-batch-approval.service';
import { ToastService } from 'src/app/shared/toast.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GrowerMasterListService } from 'src/app/account-maintenance/grower-master-list/grower-master-list.service';
import { IInvoicePaymentRequestVM } from '../view-invoice-batch/invoice-payment-request-vm.interface';
import * as moment from 'moment';
import { InvoiceFileRendererComponent } from '../invoice-file-renderer/invoice-file-renderer.component';
import { InvoiceRequestApprovalActionsComponent } from './invoice-request-approval-actions/invoice-request-approval-actions.component';
import { IWorkflowActionHistory } from 'src/app/models/workflow-action-history.interface';
import { WorkflowContactManagementService } from '../workflow-contact-management/workflow-contact-management.service';
import { IWorkflowContact } from 'src/app/models/workflow-contact.interface';
import { ICurrentUser } from 'src/app/user-management/current-user.interface';
import { DropdownService } from 'src/app/shared/dropdown.service';
import { EditAccountService } from 'src/app/account-maintenance/edit-account/edit-account.service';
import { IGrowerAccountType } from 'src/app/models/grower-account-type.interface';
import { IAccountType } from 'src/app/models/account-type.interface';
import { FarmDistributionRendererComponent } from './farm-distribution-renderer/farm-distribution-renderer.component';
import {currencyFormatter} from '../../shared/grid-formatters/currency-formatter';
import {dateFormatter} from '../../shared/grid-formatters/date-formatter';

@Component({
  selector: 'app-invoice-batch-approval',
  templateUrl: './invoice-batch-approval.component.html',
  styleUrls: ['./invoice-batch-approval.component.css']
})
export class InvoiceBatchApprovalComponent implements OnInit {
  pageTitle = 'Invoice Payment Request Approval';
  moduleTitle = 'Invoice';
  innerWidth: number;
  innerHeight: number;

  // url
  token: string;

  // batch
  batchLoaded: boolean = false;
  batch: IApinvoicePaymentRequestBatch;
  invoicesLoaded: boolean = false;
  invoices: IApinvoicePaymentRequest[] = [];
  autoApprovedInvoices: IApinvoicePaymentRequest[] = [];
  invoiceItems: IInvoicePaymentRequestVM[] = [];
  submitted: boolean = false;
  incomplete: boolean = true;
  // add a model for approval

  columnDefs = [
    {
      headerName: 'Approval',
      cellRenderer: 'actionsRenderer',
      field: 'invoice.id',
      width: 250,
      sortable: false,
      filter: false,
    },
    {
      headerName: 'Farm',
      field: 'farmName',
      width: 500,
      sortable: true,
      cellRenderer: 'growerRenderer',
      wrapText: true,
      autoHeight: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      }
    },

    {
      headerName: 'Vendor',
      field: 'vendorName',
      width: 300,
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      }
    },
    {
      headerName: 'Date Opened',
      field: 'createdDate',
      width: 200,
      sortable: true,
      valueFormatter: dateFormatter,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      },
    },
    {
      headerName: 'Description',
      field: 'invoice.description',
      width: 300,
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      }
    },

    // {
    //   headerName: 'Co',
    //   field: 'invoice.company',
    //   width: 75,
    //   sortable: true,
    //   filter: true,
    //   filterParams: {
    //     debounceMs: 0,
    //   }
    // },
    {
      headerName: 'File',
      field: 'invoice.id',
      width: 150,
      sortable: false,
      filter: false,
      cellRenderer: 'fileRenderer',
      filterParams: {
        debounceMs: 0,
      }
    },
    {
      headerName: 'Amount',
      field: 'invoice.amount',
      width: 200,
      valueFormatter: currencyFormatter,
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        debounceMs: 0,
      }
    },


  ];
  modules = AllModules;
  public frameworkComponents = {
    actionsRenderer: InvoiceRequestApprovalActionsComponent,
    fileRenderer: InvoiceFileRendererComponent,
    growerRenderer: FarmDistributionRendererComponent,
  };
  public gridApi;
  public gridColumnApi;

  // dropdown lists
  growerList: IGrowerMaster[] = [];
  vendorList: IVwApvendorMaster[] = [];
  contacts: IWorkflowContact[] = [];
  accountTypes: IAccountType[] = [];

  constructor(
    private _messageService: ToastService,
    private _invoiceService: InvoiceBatchApprovalService,
    private _workflowContactService: WorkflowContactManagementService,
    private _dropdownService: DropdownService,
    private _accountService: EditAccountService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _growerService: GrowerMasterListService,
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
    this.loadAccountTypes();



  }

  /***************************************************
   * Dropdowns
   **************************************************/

  private loadAccountTypes() {
    this._dropdownService.getAccountTypes().subscribe(
      result => {
        this.accountTypes = result;
        this.loadContacts();
      }, error => {
        console.error(error);
        this._messageService.errorToast(error);
      }
    );
  }

  private loadContacts() {
    this._workflowContactService.getWorkflowContacts().subscribe(
      result => {
        this.contacts = result;
        this.loadVendorList();
      }, error => {
        console.error(error);
        this._messageService.errorToast(error);
      }
    );
  }

  // load the vendor list from storage
  private loadVendorList() {
    if (this.vendorList.length === 0) {
      this.vendorList = JSON.parse(localStorage.getItem('APVendorList')) as IVwApvendorMaster[];
      this.loadGrowerList();
    }

  }

  private loadGrowerList() {
    this._growerService
    .getGrowers(false)
    .subscribe(
      data => {
        try {
          this.growerList = data;

          // now we can load the batch
          this.loadBatch(this.token);
        } catch (e) {
          console.error(e);
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  /***************************************************
   * Invoice Payment Requests for the grid
   **************************************************/
  /** load the batch */
   private loadBatch(token: string) {
    this._invoiceService.getAPInvoicePaymentRequestBatchByToken(token).subscribe(
      result => {
        this.batch = result;

        if (this.batch.id === 0) {
          const msg = 'The link you used to access this approval page is invalid. Please try again. If this issue persists please file a bug report';
          this._router.navigateByUrl(
            'ErrorComponent?errorMessage=' + msg
          );
        }

        this.pageTitle += ' Batch #' + this.batch.id + ' - ' + this.batch.description;

        this.batchLoaded = true;

        // todo - add authentication back in at some point

        if (this.batch.stage === 'Already Approved') {
          const msg = 'The link you used to access this approval page has already been used and is no longer valid.';
          this._router.navigateByUrl(
            'ErrorComponent?errorMessage=' + msg
          );
        }


        // get the user and check if you're on the right stage
        const user = JSON.parse(localStorage.getItem('ActiveDirectoryUser')) as ICurrentUser;
        // CLEANUP: remove dead code
        // const match = this.contacts.find(c => c.email === user.email && c.stage === this.batch.stage);
        // if (!!!match) {
        //   const msg = 'You are not authorized as a valid approver for this step of approval - ' + this.batch.stage;
        //   this._router.navigateByUrl(
        //     'ErrorComponent?errorMessage=' + msg
        //   );
        // } else if (this.batch.stage === 'Invoice Processing') {
        //   const msg = 'This batch has been fully approved and is no longer accessible here';
        //   this._router.navigateByUrl(
        //     'ErrorComponent?errorMessage=' + msg
        //   );
        // } else {
        //   // load the invoices
        //   this.loadInvoices(this.batch.id);
        // }
        this.loadInvoices(this.batch.id);



      }, error => {
        console.error(error);
        this._messageService.errorToast(error);
      }
    );
  }

  /** load the invoices for a batch */
  private loadInvoices(id: number) {
    this._invoiceService.getAPInvoicePaymentRequestsByBatchId(id).subscribe(
        result => {
          // todo - do we need to filter down based on accounts for accounting approval?
          // if (this.batch.stage === 'Accounting Approval') {

          // }
          this.invoices = result.filter(i => i.status.toLowerCase() === 'new');

          // blindly add if not accounting approval
          if (this.invoices.length > 0 && this.batch.stage !== 'Accounting Approval') {
            this.invoiceItems = result.map(i => {
              // map the dropdowns
              const farm = this.growerList.find(g => g.id.toString() === i.growerId.toString());
              const vendor = this.vendorList.find(v => v.vnumb.toString() === i.vendorId.toString());
              const item = {
                invoice: i,
                farmName: !!farm ? (farm.id + ' - ' + farm.farmName) : 'Invalid',
                vendorName: !!vendor ? (vendor.vnumb + ' - ' + vendor.vname) : 'Invalid',
                approval: '',
                isFileViewed: false
               } as IInvoicePaymentRequestVM;
               return item;
            });
            this.invoicesLoaded = true;
          } else if (this.invoices.length > 0 && this.batch.stage === 'Accounting Approval') {
            // if this is the accounting approval step, we can actually filter out
            let count = 0;
            this.invoices.forEach(i => {
              this._accountService.getAccountById(i.account).subscribe(
                account => {
                  const accountType = this.accountTypes.find(at => at.id.toString() === account.accountType.toString());
                  // bypass if they're Regular or Misc (we will auto approve them later)
                  if (accountType.accountCode === 'R' || accountType.accountCode === 'M') {
                    this.autoApprovedInvoices.push(i);
                    count++;
                    if (count === this.invoices.length) {
                      this.invoicesLoaded = true;
                    }
                  } else {
                    // just add blindly
                    const farm = this.growerList.find(g => g.id.toString() === i.growerId.toString());
                    const vendor = this.vendorList.find(v => v.vnumb.toString() === i.vendorId.toString());
                    const item = {
                      invoice: i,
                      farmName: !!farm ? (farm.id + ' - ' + farm.farmName) : 'Invalid',
                      vendorName: !!vendor ? (vendor.vnumb + ' - ' + vendor.vname) : 'Invalid',
                      approval: '',
                      isFileViewed: false
                    } as IInvoicePaymentRequestVM;
                    this.invoiceItems.push(item);
                    count++;
                    if (count === this.invoices.length) {
                      this.invoicesLoaded = true;
                    }
                  }
                }, error => {
                  console.error(error);
                  // still add to the list if an error in getting the account
                  const farm = this.growerList.find(g => g.id.toString() === i.growerId.toString());
                  const vendor = this.vendorList.find(v => v.vnumb.toString() === i.vendorId.toString());
                  const item = {
                    invoice: i,
                    farmName: !!farm ? (farm.id + ' - ' + farm.farmName) : 'Invalid',
                    vendorName: !!vendor ? (vendor.vnumb + ' - ' + vendor.vname) : 'Invalid',
                    approval: '',
                    isFileViewed: false
                  } as IInvoicePaymentRequestVM;
                  this.invoiceItems.push(item);
                  count++;
                  if (count === this.invoices.length) {
                    this.invoicesLoaded = true;
                  }
                }
              );
            });
          } else {
            this.invoicesLoaded = true;
          }



      }, error => {
        console.error(error);
        this._messageService.errorToast(error);
      }
    );
  }

  /***************************************************
   * Submission
   **************************************************/

   /** process the data in the grid and submit to the API to progress the workflow */
  public submitForApproval() {
    this.submitted = true;
    // get the values in IInvoicePaymentRequestVM form
    const invoices: IInvoicePaymentRequestVM[] = [];
    this.gridApi.forEachNode((node: { data: any; }) => invoices.push(node.data));

    const user = JSON.parse(localStorage.getItem('ActiveDirectoryUser')) as ICurrentUser;
    const userid = this.contacts.find(c => c.email.toLowerCase() === user.email.toLowerCase());

    // map to approval actions
    let actions = invoices.map(i => {
      if (i.invoice.stage === 'LPO Review' && i.approval === 'Rejected') {
        i.approval = 'Cancelled';
      }
      return {
        id: 0,
        workflowContactId: userid.id,
        stage: i.invoice.stage,
        date: new Date(),
        invoicePaymentRequestId: i.invoice.id,
        actionTaken: i.approval,
        comment: i.comment,
      } as IWorkflowActionHistory;
    });

    if (this.batch.stage === 'Accounting Approval') {
      // we need to remap the ones that weren't approved if they were the wrong account types (R and M)
      const approved = this.autoApprovedInvoices.map(i => {
        return {
          id: 0,
          workflowContactId: userid.id,
          stage: i.stage,
          date: new Date(),
          invoicePaymentRequestId: i.id,
          actionTaken: 'Approved',
          comment: null,
        } as IWorkflowActionHistory;
      });
      actions = actions.concat(approved);
    }

    // post to the server
    this._invoiceService.submitApprovalActions(actions).subscribe(
      result => {
        if (result.statusCode === 200) {
          this._messageService.successToast('You have successfully submitted your approvals');
          setTimeout(() => {
            this.submitted = false;
            this._router.navigateByUrl(
              'DashboardComponent'
            );
          }, 1000);
        } else {
          this._messageService.errorToast('An error occurred submitting your approvals. Please try again');
          this.submitted = false;
        }


      },
      error => {
        console.error(error);
        this._messageService.errorToast(error);
      }
    );

  }


  /** validate every time someone performs an approval (aka on cell change) */
  public onCellValueChange(event: any) {
    const invoices: IInvoicePaymentRequestVM[] = [];
    this.gridApi.forEachNode((node: { data: any; }) => invoices.push(node.data));
    if (invoices.findIndex(i => !!!i.approval) === -1) {
      this.incomplete = false;
    }
  }

  /***************************************************
   * Misc utils
   **************************************************/
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
  }

  onColumnResized() {
    this.gridApi.resetRowHeights();
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.gridApi.sizeColumnsToFit();

    this.gridApi.onFilterChanged();


    const sort = [
      {
        colId: 'vendorName',
        sort: 'asc'
      }
    ];

    // todo - should we pre filter status?
    this.gridApi.setSortModel(sort);

    // filterInstance.selectValue('New');
    // filterInstance.selectValue('Error');



  }

}
