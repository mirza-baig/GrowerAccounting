import { IApInvoice } from '../../models/ap-invoice.interface';
import { ProcessInvoiceRequestItemService } from '../process-invoice-request-item/process-invoice-request-item.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { IApinvoicePaymentRequestBatch } from 'src/app/models/ap-invoice-payment-request-batch.interface';
import { IApinvoicePaymentRequest } from 'src/app/models/ap-invoice-payment-request.interface';
import { IInvoicePaymentRequestVM } from '../view-invoice-batch/invoice-payment-request-vm.interface';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { IGrowerMaster } from 'src/app/models/grower-master.interface';
import { IVwApvendorMaster } from 'src/app/models/vw-apvendor-master.interface';
import { ToastService } from 'src/app/shared/toast.service';
import { InvoiceBatchApprovalService } from '../invoice-batch-approval/invoice-batch-approval.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GrowerMasterListService } from 'src/app/account-maintenance/grower-master-list/grower-master-list.service';
import { ProcessInvoiceRequestActionsComponent } from './process-invoice-request-actions/process-invoice-request-actions.component';
import { ProcessInvoiceRequestsService } from './process-invoice-requests.service';
import { HttpClient } from '@angular/common/http';
import { fade, slide } from 'src/fieldale-animations';
import { StatusRendererComponent } from '../status-renderer/status-renderer.component';
import { ShowInvoiceTotalComponentComponent } from './show-invoice-total-component/show-invoice-total-component.component';
import { AccountMaintenanceService } from 'src/app/account-maintenance/account-maintenance.service';
import { FarmDistributionRendererComponent } from '../invoice-batch-approval/farm-distribution-renderer/farm-distribution-renderer.component';
import {ICurrentUser} from '../../user-management/current-user.interface';
import {IVmApInvoicePaymentRequestBatch} from '../../models/i-vm-ap-invoice-payment-request-batch';
import {currencyFormatter} from '../../shared/grid-formatters/currency-formatter';

@Component({
  selector: 'app-process-invoice-requests',
  templateUrl: './process-invoice-requests.component.html',
  styleUrls: ['./process-invoice-requests.component.css'],
  animations: [
    fade,
    slide]
})
export class ProcessInvoiceRequestsComponent implements OnInit {
  pageTitle = 'Process Grower Invoices Batch #';
  moduleTitle = 'Invoice';
  innerWidth: number;
  innerHeight: number;

  // url
  token: string;
  id: number;

  // batch
  batchLoaded: boolean = false;
  batch: IApinvoicePaymentRequestBatch;
  invoicesLoaded: boolean = false;
  allInvoicesProcessed: boolean = true;
  invoices: IApinvoicePaymentRequest[] = [];
  invoiceItems: IInvoicePaymentRequestVM[] = [];
  apInvoices: IApInvoice[] = [];
  postBatchModal: boolean = false;
  postBatchSubmitted: boolean = false;
  printReady: boolean = false;
  deleteBatchModal: boolean = false;
  // add a model for approval

  resetBatchSubmitted: boolean = false;
  resetBatchModel: boolean = false;

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
      width: 300,
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      }
    },
    {
      headerName: 'Status',
      field: 'invoice.status',
      width: 300,
      sortable: true,
      filter: true,

      // todo - style formatter
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      },
      cellRenderer: 'statusRenderer',
    },

    {
      headerName: 'Description',
      field: 'description',
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
      headerName: 'Request Amount',
      field: 'invoice.amount',
      width: 200,
      valueFormatter: params => currencyFormatter(params, ''),
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        debounceMs: 0,
      }
    },
    {
      headerName: 'Actual Amount',
      field: 'apAmount',
      valueFormatter: params => currencyFormatter(params, ''),
      width: 200,
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        debounceMs: 0,
      }
    },
    {
      headerName: 'Review',
      cellRenderer: 'actionsRenderer',
      field: 'invoice.id',
      width: 250,
      sortable: false,
      filter: false
    },


  ];
  modules = AllModules;
  public frameworkComponents = {
    actionsRenderer: ProcessInvoiceRequestActionsComponent,
    statusRenderer: StatusRendererComponent,
    invoiceRenderer: ShowInvoiceTotalComponentComponent,
    growerRenderer: FarmDistributionRendererComponent,
    // fileRenderer: InvoiceFileRendererComponent,
  };
  public gridApi;
  public gridColumnApi;

  // dropdown lists
  growerList: IGrowerMaster[] = [];
  vendorList: IVwApvendorMaster[] = [];

  constructor(
    private _messageService: ToastService,
    private _invoiceService: InvoiceBatchApprovalService,
    private _processService: ProcessInvoiceRequestsService,
    private _processItemService: ProcessInvoiceRequestItemService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _growerService: GrowerMasterListService,
    private _accountService: AccountMaintenanceService,
    private _http: HttpClient,
  ) { }

  ngOnInit() {
    // set dimensions
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

    // get the batch id
    this._route.queryParams.subscribe(params => {
      this.token = params['token'] as string;
      this.id = params['batchId'] as number;
    });

    if (!!this.token) {
      this.token = this.token.replace('\\', '');
      sessionStorage.setItem('token', this.token);
    }


    // start the loads
    this.loadVendorList();
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

          if (!!this.id) {
            this.loadBatchById(this.id);
          } else {
            // now we can load the batch
            this.loadBatch(this.token);
          }

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
        this.pageTitle += this.batch.id;
        this.batchLoaded = true;

        // if (this.batch.stage === 'Exported') {
        //   const msg = 'This batch has already been processed and exported and you can no longer access it from here';
        //   this._router.navigateByUrl(
        //     'ErrorComponent?errorMessage=' + msg
        //   );
        // } else {
        //   // load the invoices
        //   this.loadInvoices(this.batch.id);
        // }
        // load the invoices
        this.loadInvoices(this.batch.id);




      }, error => {
        console.error(error);
        this._messageService.errorToast(error);
      }
    );
  }

  private loadBatchById(id: number) {
    this._invoiceService.getAPInvoicePaymentRequestBatchById(id).subscribe(
      result => {
        this.batch = result;
        this.pageTitle += this.batch.id;
        this.batchLoaded = true;

        // CLEANUP remove dead code
        // if (this.batch.stage === 'Exported') {
        //   const msg = 'This batch has already been processed and exported and you can no longer access it from here';
        //   this._router.navigateByUrl(
        //     'ErrorComponent?errorMessage=' + msg
        //   );
        // } else {
        //   // load the invoices
        //   this.loadInvoices(this.batch.id);
        // }
        // load the invoices
        this.loadApBatch(this.batch.id);




      }, error => {
        console.error(error);
        this._messageService.errorToast(error);
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
          this.invoices = result.filter(i => i.status !== 'Cancelled'); // filter out cancelled
          if (this.invoices.length > 0) {
            // this.invoiceItems = this.invoices.map(i => {

            //   // todo map the status - return params.value === 'Converted' ? 'Saved' : 'Needs Review';
            //   if (this.batch.stage !== 'Exported') {
            //     i.status = i.status === 'New' ? 'Needs Review' : 'Saved';
            //     if (i.status === 'Needs Review') {
            //       this.allInvoicesProcessed = false;
            //     }
            //   }





            //   // map the dropdowns
            //   const farm = this.growerList.find(g => g.id.toString() === i.growerId.toString());
            //   const vendor = this.vendorList.find(v => v.vnumb.toString() === i.vendorId.toString());
            //   const item = {
            //     invoice: i,
            //     farmName: !!farm ? (farm.id + ' - ' + farm.farmName) : 'Invalid',
            //     vendorName: !!vendor ? (vendor.vnumb + ' - ' + vendor.vname) : 'Invalid',
            //     approval: '',
            //     isFileViewed: false,
            //    } as IInvoicePaymentRequestVM;
            //    console.log(item);

            //    return item;
            // });
            this.invoiceItems = [];
            this.invoices.forEach(i => {

              // todo map the status - return params.value === 'Converted' ? 'Saved' : 'Needs Review';
              if (this.batch.stage !== 'Exported') {
                i.status = i.status === 'New' ? 'Needs Review' : 'Saved';
                if (i.status === 'Needs Review') {
                  this.allInvoicesProcessed = false;
                }
              }

              const match = this.apInvoices.find(ap => ap.id.toString() === i.apinvoiceId);





              // map the dropdowns
              const gid = !!match ? match.growerId : i.growerId;
              const vid = !!match ? match.vendorId : i.vendorId;
              const farm = this.growerList.find(g => g.id.toString() === gid.toString());
              const vendor = this.vendorList.find(v => v.vnumb.toString() === vid.toString());
              const item = {
                invoice: i,
                farmName: !!farm ? (farm.id + ' - ' + farm.farmName) : 'Invalid',
                vendorName: !!vendor ? (vendor.vnumb + ' - ' + vendor.vname) : 'Invalid',
                approval: '',
                isFileViewed: false,
                apInvoice: match,
                description: !!match ? match.description : i.description,
               } as IInvoicePaymentRequestVM;

               if (!!match) {
                item.apAmount = match.amount;
               }

               this._accountService.getAccountById(i.account).subscribe(acct => {
                 switch (acct.accountType) {
                    case 1:
                      item.accountName = 'Regular - ' + acct.accountSuffix;
                      break;
                    case 2:
                      item.accountName = 'Construction - ' + acct.accountSuffix;
                      break;
                    case 3:
                      item.accountName = 'Special - ' + acct.accountSuffix;
                      break;
                    case 4:
                      item.accountName = 'Unique - ' + acct.accountSuffix;
                      break;
                    case 5:
                      item.accountName = 'Miscellaneous - ' + acct.accountSuffix;
                      break;
                 }
                // "accountType": 1,
                // "accountSuffix": "A",
                this.invoiceItems.push(item);
                if (this.invoiceItems.length === this.invoices.length) {
                 this.invoicesLoaded = true;
                }
               }, error => {
                 console.error(error);
               });


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

  public exportInvoiceBatch() {
    this.postBatchSubmitted = true;
    const iVmApInvoicePaymentRequestBatch = this.batch as IVmApInvoicePaymentRequestBatch;
    this._processService.postBatch(iVmApInvoicePaymentRequestBatch).subscribe(
      result => {
        if (result.statusCode === 200) {
          this._messageService.successToast('You have successfully posted the batch');
          setTimeout(() => {
            this.postBatchSubmitted = false;
            this.postBatchModal = false;
            this._router.navigateByUrl(
              'DashboardComponent'
            );
          }, 1000);

        } else {
          this._messageService.errorToast(result.data);
          this.postBatchSubmitted = false;
        }

      }, error => {
        this._messageService.errorToast(error);
        console.error(error);
      }
    );
    this.postBatchModal = false;
  }

  public unlockInvoiceBatch() {
    this.resetBatchSubmitted = true;
    this._processService.unlockInvoiceBatch(this.batch.id).subscribe(
      result => {
        if (result.statusCode === 200) {
          this._messageService.successToast('You have successfully unlocked the batch');
          setTimeout(() => {
            this.resetBatchSubmitted = false;
            this.resetBatchModel = false;
            this._router.navigate(['/ViewInvoiceBatchComponent'], { queryParams: { Id: this.id } });
          }, 1000);

        } else {
          this._messageService.errorToast(result.data);
          this.resetBatchSubmitted = false;
        }

      }, error => {
        this._messageService.errorToast(error);
        console.error(error);
      }
    );
    this.resetBatchModel = false;
  }

  public deleteInvoiceBatch() {
    this.postBatchSubmitted = true;
    this._processService.deleteInvoiceBatch(this.batch.id).subscribe(
      result => {
        if (result.statusCode === 200) {
          this._messageService.successToast('You have successfully deleted the batch');
          setTimeout(() => {
            this.postBatchSubmitted = false;
            this.deleteBatchModal = false;
            this._router.navigateByUrl(
              'DashboardComponent'
            );
          }, 1000);

        } else {
          this._messageService.errorToast(result.data);
          this.deleteBatchModal = false;
        }

      }, error => {
        this._messageService.errorToast(error);
        console.error(error);
        this.deleteBatchModal = false;
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


    // filterInstance.selectValue('New');
    // filterInstance.selectValue('Error');
    this.gridApi.onFilterChanged();


    const sort = [
      {
        colId: 'vendorName',
        sort: 'asc'
      }
    ];

    // todo - should we pre filter status?
    this.gridApi.setSortModel(sort);


  }

  /***************************************************
   * Print Batch
   **************************************************/

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
