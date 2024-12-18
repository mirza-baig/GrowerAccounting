import { AddInvoicePaymentRequestService } from './../add-invoice-payment-request/add-invoice-payment-request.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { IApinvoicePaymentRequestBatch } from 'src/app/models/ap-invoice-payment-request-batch.interface';
import { IApinvoicePaymentRequest } from 'src/app/models/ap-invoice-payment-request.interface';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { IVwApvendorMaster } from 'src/app/models/vw-apvendor-master.interface';
import { IGrowerMaster } from 'src/app/models/grower-master.interface';
import { IInvoicePaymentRequestVM } from './invoice-payment-request-vm.interface';
import { ViewInvoiceBatchService } from './view-invoice-batch.service';
import { ToastService } from 'src/app/shared/toast.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { GrowerMasterListService } from 'src/app/account-maintenance/grower-master-list/grower-master-list.service';
import { PaymentRequestBatchItemActionsComponent } from './payment-request-batch-item-actions/payment-request-batch-item-actions.component';
import { WorkflowContactManagementService } from '../workflow-contact-management/workflow-contact-management.service';
import { IWorkflowContact } from 'src/app/models/workflow-contact.interface';
import { StatusRendererComponent } from '../status-renderer/status-renderer.component';
import { HttpClient } from '@angular/common/http';
import { ProcessInvoiceRequestsService } from '../process-invoice-requests/process-invoice-requests.service';
import { IApInvoice } from 'src/app/models/ap-invoice.interface';
import { AccountMaintenanceService } from 'src/app/account-maintenance/account-maintenance.service';
import { IGrowerAccount } from 'src/app/models/grower-account.interface';
import { IGrowerAccountPost } from 'src/app/models/grower-account-post.interface';
import { FarmDistributionRendererComponent } from '../invoice-batch-approval/farm-distribution-renderer/farm-distribution-renderer.component';
import { fade, slide } from 'src/fieldale-animations';
import {currencyFormatter} from '../../shared/grid-formatters/currency-formatter';
import {dateFormatter} from '../../shared/grid-formatters/date-formatter';

@Component({
  selector: 'app-view-invoice-batch',
  templateUrl: './view-invoice-batch.component.html',
  styleUrls: ['./view-invoice-batch.component.css'],
  animations: [
    fade,
    slide]
})
export class ViewInvoiceBatchComponent implements OnInit {
  pageTitle = 'Invoice Payment Request List for Batch #';
  moduleTitle = 'Invoice';
  innerWidth: number;
  innerHeight: number;
  id: number;

  // batch
  batchLoaded: boolean = false;
  batch: IApinvoicePaymentRequestBatch;
  submittedPost: boolean = false;
  printReady: boolean = false;


  // invoice list
  invoicesLoaded: boolean = false;
  freshBatch: boolean = true; // used to indicate that the reviewer hasn't visited the batch yet so they can resend a reminder
  invoices: IApinvoicePaymentRequest[] = [];
  invoiceItems: IInvoicePaymentRequestVM[] = [];
  apInvoices: IApInvoice[] = [];
  invoiceTotal: number = 0;
  columnDefs = [
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
      width: 200,
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
      width: 150,
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
      width: 250,
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      }
    },
    {
      headerName: 'Status',
      width: 125,
      field: 'invoice.stage',
      // valueFormatter: this.farmTypeRenderer,
      sortable: true,
      filter: true,
      cellRenderer: 'statusRenderer',


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
      headerName: 'Amount',
      field: 'invoice.amount',
      width: 125,
      valueFormatter: currencyFormatter,
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        debounceMs: 0,
      }
    },
    {
      headerName: 'Actions',
      cellRenderer: 'actionsRenderer',
      field: 'invoice.id',
      width: 400,
      sortable: false,
      filter: false
    }

  ];

  modules = AllModules;
  public frameworkComponents = {
    actionsRenderer: PaymentRequestBatchItemActionsComponent,
    statusRenderer: StatusRendererComponent,
    growerRenderer: FarmDistributionRendererComponent,
  };
  public gridApi;
  public gridColumnApi;

  // approval form
  public approverForm: FormGroup;
  public approverFormLoaded: boolean = false;
  public approvalModal: boolean = false;

  // dropdowns
  growerList: IGrowerMaster[] = [];
  vendorList: IVwApvendorMaster[] = [];
  approverList: IWorkflowContact[] = [];

  constructor(
    private messageService: ToastService,
    private _invoiceService: ViewInvoiceBatchService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute,
    private _growerService: GrowerMasterListService,
    private _workflowContactService: WorkflowContactManagementService,
    private _http: HttpClient,
    private _processService: ProcessInvoiceRequestsService,
    private _accountService: AccountMaintenanceService,
    private _requestItemService: AddInvoicePaymentRequestService,
  ) {
    this.ngOnInit();
  }

  ngOnInit() {

    // set dimensions
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;



    // get the batch id
    this._route.queryParams.subscribe(params => {
      this.id = params['Id'] as number;
    });
    // hacky fix for the weird id issue
    const idstr = this.id.toString();
    if (idstr.length === 8) {
      this.id = parseInt(idstr.substring(0, 4), 10);
    }



    if (!!!this.vendorList || this.vendorList.length === 0) {
      this.pageTitle += this.id;
      // start the loads
      this.loadVendorList();
    }

  }

  /***************************************************
   * Dropdowns
   **************************************************/

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
          this.loadBatch(this.id);
        } catch (e) {
          console.error(e);
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  private loadApprovers(id: number) {

    // build the form
    this.approverForm = this._formBuilder.group({
      Approver: new FormControl({
        value: '',
      }),
    });
    this.approverFormLoaded = true;

    // get the list of approvers for this batch
    this._workflowContactService.getWorkflowContacts().subscribe(
      result => {
        // save the approver list
        this.approverList = result
          .filter(a => a.stage === 'LPO Review')
          .map(a => {
            if (a.isActive) {
              a.lastName = a.lastName + ' (default)';
              if (!!!this.batch.approverId) {
                this.approverForm.patchValue({ Approver: a.id });
                this.batch.approverId = a.id;
                this.updateBatch();
              }
            }
            return a;
          });



        if (!!this.batch.approverId) {
          this.approverForm.patchValue({ Approver: parseInt(this.batch.approverId.toString(), 10) });
        }


      }, error => {
        console.error(error);
        this.messageService.errorToast(error);
      }
    );

  }


  /***************************************************
   * Invoice Payment Requests for the grid
   **************************************************/
  /** load the batch */
   private loadBatch(id: number) {
    this._invoiceService.getAPInvoicePaymentRequestBatchById(id).subscribe(
      result => {
        this.batch = result;
        this.batchLoaded = true;



        // load the approver list
        this.loadApprovers(id);

        // load the invoices
        this.loadApBatch(id);

      }, error => {
        console.error(error);
        this.messageService.errorToast(error);
      }
    );
  }

  private loadApBatch(id: number) {
    this._processService.getAPInvoicesByBatchId(id).subscribe(result => {
      this.apInvoices = result;
      this.loadInvoices(id);
    });
  }

  /** load the invoices for a batch */
  private loadInvoices(id: number) {
    this._invoiceService.getAPInvoicePaymentRequestsByBatchId(id).subscribe(
        result => {
          this.invoices = result;
          if (this.invoices.length > 0) {
            this.invoiceItems = [];
            result.forEach(i => {

              // status/stage replace
              if (i.status === 'Cancelled') {
                i.stage = 'Cancelled';
              }

              if (i.status !== 'New' && i.status === 'Cancelled') {
                this.freshBatch = false;
              }

              // add to the sum
              this.invoiceTotal += i.amount;

              const match = this.apInvoices.find(ap => ap.id.toString() === i.apinvoiceId);
              // map the dropdowns
              const farm = this.growerList.find(g => g.id.toString() === i.growerId.toString());
              const vendor = this.vendorList.find(v => v.vnumb.toString() === i.vendorId.toString());
              const item = {
                invoice: i,
                farmName: !!farm ? (farm.id + ' - ' + farm.farmName) : 'Invalid',
                apInvoice: match,
                vendorName: !!vendor ? (vendor.vnumb + ' - ' + vendor.vname) : 'Invalid',
               } as IInvoicePaymentRequestVM;

               if (!!match) {
                item.apAmount = match.amount;
               }


               this._accountService.getAccountById(i.account).subscribe(acct => {
                 // account type
                item.accountName = this.getAccountName(acct);
                // now get the distributions
                this._requestItemService.getInvoicePaymentFarmDistributions(i.id).subscribe(dists => {
                  item.invoice.apinvoicePaymentFarmDistribution = dists;
                  // add to the list and bail when done
                  this.invoiceItems.push(item);
                  if (this.invoiceItems.length === this.invoices.length) {
                   this.invoicesLoaded = true;
                  }
                }, error => {
                  console.error(error);
                });


              }, error => {
                console.error(error);
              });

            });
          } else {
            this.invoicesLoaded = true;
          }

      }, error => {
        console.error(error);
        this.messageService.errorToast(error);
      }
    );
  }

  public getAccountName(acct: IGrowerAccountPost): string {
    switch (acct.accountType) {
      case 1:
        return 'Regular - ' + acct.accountSuffix;
      case 2:
        return 'Construction - ' + acct.accountSuffix;
      case 3:
        return 'Special - ' + acct.accountSuffix;
      case 4:
        return 'Unique - ' + acct.accountSuffix;
      case 5:
        return 'Miscellaneous - ' + acct.accountSuffix;
   }
  }

  public getGrowerName(id: number) {
    const match = this.growerList.find(g => g.id.toString() === id.toString());
    return match.id.toString() + ' - ' + match.farmName;
  }


  /** go to the add page to make a new  */
  public addNewInvoice() {
    this._router.navigateByUrl(
      'AddInvoicePaymentRequestComponent?BatchId=' + this.id
    );
  }

  public returnToList() {
    this._router.navigateByUrl(
      'InvoiceBatchListComponent'
    );
  }

  public resendApprovalEmail() {
    this._invoiceService.resendInvoicePaymentRequestBatchApprovalEmail(this.id).subscribe(
      result => {

        this.messageService.successToast('You have successfully resent an email reminder for approval');
      }, error => {
        console.error(error);
        this.messageService.errorToast(error);
      }
    );
  }

  /***************************************************
   * Approver updates
   **************************************************/

   /** does a silent update on the batch */
  public updateBatch() {
    this._invoiceService.postInvoicePaymentRequestBatch(this.batch).subscribe(
      postResult => {

      }, error => {
        console.error(error);
      }
    );
  }

  /** handler for when the dropdown for approver changes */
  public approverChange(event: any) {
    this.batch.approverId = parseInt(this.approverForm.value.Approver, 10);
    this.updateBatch();
  }

  public submitForApproval() {
    this.submittedPost = true;
    this._invoiceService.submitPaymentRequestBatchForApproval(this.batch).subscribe(
      result => {

        if (result.statusCode === 200) {
          this.messageService.successToast('You have successfully submitted the batch for approval!');
          setTimeout(() => {
            this.submittedPost = false;
            this._router.navigateByUrl(
              'InvoiceBatchListComponent'
            );
          }, 1000);

        }
      }, error => {
        this.messageService.errorToast(error);
        console.error(error);
      }
    );
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


    // this.gridApi.onFilterChanged();


    // const sort = [
    //   {
    //     colId: 'Id',
    //     sort: 'desc'
    //   }
    // ];

    // // todo - should we pre filter status?
    // this.gridApi.setSortModel(sort);
  }

  public printBatch() {
    this.printReady = true;
    this._http.get('assets/tablestyle.json').subscribe(res => {
      const tableStyle = res['style'];
      let printContents, popupWin;
      printContents = document.getElementById('print-section-batch').innerHTML;
      popupWin = window.open(
        '',
        '_blank',
        'top=0,left=0,height=100%,width=auto'
      );
      popupWin.document.open();
      popupWin.document.write(`
        <html>
          <head>
            <title>Batch #${this.batch.id} - ${this.batch.description}</title>
            <style>
            ${tableStyle}
            </style>
          </head>
      <body onload="window.print();window.close()'">${printContents}</body>
        </html>`);
      popupWin.document.close();
      popupWin.print();
    });

  }

  public printBatchTrim() {
    this.printReady = true;
    this._http.get('assets/tablestyle.json').subscribe(res => {
      const tableStyle = res['style'];
      let printContents, popupWin;
      printContents = document.getElementById('print-section-batch-trim').innerHTML;
      popupWin = window.open(
        '',
        '_blank',
        'top=0,left=0,height=100%,width=auto'
      );
      popupWin.document.open();
      popupWin.document.write(`
        <html>
          <head>
            <title>Batch #${this.batch.id} - ${this.batch.description}</title>
            <style>
            ${tableStyle}
            </style>
          </head>
      <body onload="window.print();window.close()'">${printContents}</body>
        </html>`);
      popupWin.document.close();
      popupWin.print();
    });

  }

  /** export the grid to excel */
  public exportData() {
    this.gridApi.exportDataAsExcel(
      {
        fileName: 'Invoice Batch ' + this.batch.id,
        columnKeys: [
          'farmName',
          'vendorName',
          'invoice.description',
          'invoice.company',
          'invoice.amount',
        ],
      }
    );
  }

}
