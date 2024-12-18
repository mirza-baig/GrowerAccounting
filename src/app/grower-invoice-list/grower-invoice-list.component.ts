import { Component, OnInit, HostListener } from '@angular/core';
import { fade, slide, fadeInSlideOutRight } from 'src/fieldale-animations';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { IGrowerAccount } from '../models/grower-account.interface';
import { IAccountType } from '../models/account-type.interface';
import { IVwApvendorMaster } from '../models/vw-apvendor-master.interface';
import { GrowerInvoiceListService } from './grower-invoice-list.service';
import { MessageService } from 'primeng/api';
import { AccountMaintenanceService } from '../account-maintenance/account-maintenance.service';
import { DropdownService } from '../shared/dropdown.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IGrowerMaster } from '../models/grower-master.interface';
import { IDropdownListItem } from '../models/dropdown-list-item.interface';
import { IInvoiceItem } from './invoice-item.interface';
import { IApinvoice } from '../models/apinvoice.interface';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { GrowerInvoiceListActionsComponent } from './grower-invoice-list-actions/grower-invoice-list-actions.component';
import { UtilityService } from '../shared/utility.service';
import { AddGrowerTransactionService } from '../grower-transactions/add-grower-transaction/add-grower-transaction.service';
import { IGrowerTransactionBatch } from '../models/grower-transaction-batch.interface';
import { ICurrentUser } from '../user-management/current-user.interface';
import { GrowerTransactionsService } from '../grower-transactions/grower-transactions.service';
import { IGrowerTransaction } from '../models/grower-transaction.interface';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AddGrowerInvoiceService } from '../grower-invoice/add-grower-invoice/add-grower-invoice.service';
import { AccountNameCellRendererComponent } from '../shared/account-name-cell-renderer/account-name-cell-renderer.component';
import { IApInvoiceSearchVM } from '../models/ap-invoice-search-vm.interface';
import { IApInvoiceTall } from '../models/ap-invoice-tall.interface';
import { GrowerMasterListService } from '../account-maintenance/grower-master-list/grower-master-list.service';
import {dateFormatter} from '../shared/grid-formatters/date-formatter';
import {currencyFormatter} from '../shared/grid-formatters/currency-formatter';

@Component({
  selector: 'app-grower-invoice-list',
  templateUrl: './grower-invoice-list.component.html',
  styleUrls: ['./grower-invoice-list.component.css'],
  animations: [
    fade,
    slide,
    fadeInSlideOutRight,
    trigger('detailExpand', [
      state(
        'collapsed',
        style({ height: '0px', minHeight: '0', display: 'none' })
      ),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      )
    ])
  ]
})
export class GrowerInvoiceListComponent implements OnInit {
  [x: string]: any;
  pageTitle = 'AP Invoices';
  moduleTitle = 'Invoice';
  innerWidth: any;
  innerHeight: any;

  // url params
  growerId: number;

  // flags
  dropdownsLoaded: boolean = false;
  growerSelected: boolean = false;
  lockSettlements: boolean = true;
  filterSubmitted: boolean = false;
  searchFormLoaded: boolean = false;

  // search form
  searchForm: FormGroup;

  // lists
  vendorList: IVwApvendorMaster[] = [];
  accountList: IGrowerAccount[] = [];
  accountTypes: IAccountType[] = [];
  companyList: IDropdownListItem[] = [];
  growerList: IGrowerMaster[] = [];

  // misc
  selectedFarm: IGrowerMaster;
  postSubmitted: boolean = false;

  // the grid
  private gridApi;
  private gridColumnApi;
  public invoiceItems: IInvoiceItem[] = [];
  public selectedInvoiceRows: IInvoiceItem[] = [];
  public invoices: IApInvoiceTall[] = [];
  public invoicesLoaded: boolean = false;
  modules = AllModules;
  colDefs = [
    // {
    //   headerName: '',
    //   field: 'invoice.invoiceNumber',
    //   valueFormatter: function (params) { return ''; },
    //   checkboxSelection: function(params) {
    //     return params.data.invoice.status.trim() !== 'Exported';
    //   },
    //   width: 50,
    // },
    {
      headerName: 'Invoice #',
      field: 'invoice.InvoiceNumber',
      filter: 'agTextColumnFilter',
      sortable: true,
      width: 100,
      filterParams: {
        filterOptions: ['startsWith', 'contains'],
        debounceMs: 0,
        caseSensitive: false,
      }
    },
    {
      headerName: 'Vendor',
      field: 'vendorName',
      filter: 'agTextColumnFilter',
      sortable: true,
      width: 150,
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      }
    },
    {
      headerName: 'Company',
      field: 'companyName',
      filter: 'agTextColumnFilter',
      sortable: true,
      width: 150,
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      }
    },
    // {
    //   headerName: 'Account',
    //   // field: 'accountName',
    //   field: 'invoice.Account',
    //   // filter: 'agTextColumnFilter', // todo - fix me
    //   cellRenderer: 'accountNameRenderer',
    //   sortable: true,
    //   width: 125,
    // },
    {
      headerName: 'Grower',
      field: 'growerName',
      filter: 'agTextColumnFilter',
      sortable: true,
      width: 150,
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      }
    },
    {
      headerName: 'Pay Date',
      valueFormatter: dateFormatter,
      field: 'invoice.PayDate',
      width: 100,
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      }
    },
    {
      headerName: 'Invoice Date',
      valueFormatter: dateFormatter,
      field: 'invoice.InvoiceDate',
      width: 100,
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      }
    },
    {
      headerName: 'Amount',
      field: 'invoice.Amount',
      valueFormatter: params => currencyFormatter(params, '$0'),
      width: 100,
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        debounceMs: 0,
      }
    },
    {
      headerName: 'Actions',
      field: 'invoice.Id',
      width: 120,
      cellRenderer: 'actionRenderer'
    },
  ];
  public frameworkComponents = {
    actionRenderer: GrowerInvoiceListActionsComponent,
    accountNameRenderer: AccountNameCellRendererComponent,
  };

  batchForm: FormGroup;
  batchFormLoaded: boolean = false;
  newBatchModal: boolean = false;

  constructor(
    private messageService: MessageService,
    private _invoiceService: GrowerInvoiceListService,
    private _addInvoiceService: AddGrowerInvoiceService,
    private _growerService: GrowerMasterListService,
    private _accountService: AccountMaintenanceService,
    private _dropdownService: DropdownService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _utilityService: UtilityService,
    private _transactionService: AddGrowerTransactionService,
    private _batchService: GrowerTransactionsService,
  ) { }

  ngOnInit() {
    // set width
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

    // parse the URL?
    this._route.queryParams.subscribe(params => {
      this.growerId = params['GrowerId'];
    });

    this.buildSearchForm();

    this.buildBatchForm();

    this.getLockStatus();

    this.loadGrowers();



    // see if we have a grower ready
    // this.growerSelected = !!this.growerId;
    // if (this.growerSelected) {
    //   this.loadGrowerAccounts(this.growerId);
    // }


  }

  // CLEANUP: delete dead method after testing
  /*public hideExtraFields(params: any) {
    return false;
  }*/

  /** create a form to handle searching */
  private buildSearchForm() {
    this.searchForm = this._formBuilder.group({
      DaysBack: new FormControl({
        value: 30,
      }, [ Validators.required])}
    );
    this.searchForm.patchValue({ DaysBack: 30 });
    this.searchFormLoaded = true;
  }

  /** create a form for submitting batches */
  private buildBatchForm() {
    this.batchForm = this._formBuilder.group({
      Description: new FormControl({
        value: '',
      }, [ Validators.required])}
    );
    this.batchForm.patchValue({ Description: '' });
    this.batchFormLoaded = true;
  }

  /** Check to see if the site needs to be locked down */
  public getLockStatus() {
    this._utilityService
      .isSettlementInProcess()
      .subscribe(
        data => {
          try {
            this.lockSettlements = data;
          } catch (e) {
            console.error(e);
          }
        },
        error => {
          console.error(error);
        }
      );
  }


  /** selection event for the grower */
  public onGrowerSelected(event: any) {
    if (!!!event) {
      this.growerSelected = false;
      this.selectedFarm = null;
      this.invoicesLoaded = false;
    } else {
      this.selectedFarm = event;
      this.growerId = this.selectedFarm.id;
      this.growerSelected = true;
      // load the accounts
      this.loadGrowerAccounts(this.selectedFarm.id);
    }

  }

  public onInvoiceSelectionChanged(event: any) {
    this.selectedInvoiceRows = this.gridApi.getSelectedRows();
  }

  /** submit the invoices into transaction */
  public confirmPostInvoices() {

    this.postSubmitted = true;

    // get user
    const user = JSON.parse(localStorage.getItem('ActiveDirectoryUser')) as ICurrentUser;

    // build a batch
    // tslint:disable-next-line:prefer-const
    let batch = {
      id: 0,
      createdBy: user.displayName,
      createdDate: new Date(),
      postedDate: new Date(),
      description: 'APInvoice - ' + this.batchForm.value.Description,
      postedBy: user.displayName,
      status: 'New'
    } as IGrowerTransactionBatch;

    // post the new batch
    // this._batchService.postTransactionBatch(batch).subscribe(batchResult => {
    //   if (batchResult.statusCode === 200) {
    //     // New transaction batch #{number} added.
    //     const batchId = parseInt(batchResult.data.split(' ')[3].substring(1), 10);
    //     batch.id = batchId;

    //     let itemsProcessed = 0;
    //     this.selectedInvoiceRows.forEach(invoice => {
    //       // get matching account
    //       const account = this.accountList.find(a => a.id.toString() === invoice.invoice.account.toString());

    //       // make a transaction
    //       const transaction = {
    //         id: 0,
    //         growerId: invoice.invoice.growerId,
    //         growerAccountId: invoice.invoice.account,
    //         transactionCode: '35', // misc invoice (need to verify),
    //         accountSuffix: account.accountSuffix,
    //         artype: account.accountType.substring(0, 1),
    //         transactionDate: invoice.invoice.invoiceDate,
    //         quantity: 0,
    //         transactionAmount: invoice.invoice.amount,
    //         transactionDescription: invoice.invoice.description,
    //         transactionAccountName: account.accountType,
    //         vendorId: invoice.invoice.vendorId.toString(),
    //         referenceNumber: invoice.invoice.id.toString(),
    //         transactionStatus: 'New',
    //         batchId: batchId,
    //       } as IGrowerTransaction;

    //       // update the invoice
    //       invoice.invoice.status = 'Posted';
    //       this._addInvoiceService.postInvoice(invoice.invoice).subscribe(invoiceResult => {
    //         // post the transaction
    //         this._transactionService.postTransaction(transaction).subscribe(transactionResult => {
    //           itemsProcessed++;
    //           console.log('transaction and invoice posted ' + itemsProcessed);
    //           if (itemsProcessed === this.selectedInvoiceRows.length) {
    //             // update the batch to posted.
    //             batch.status = 'Posted';

    //             this._batchService.postTransactionBatch(batch).subscribe(final => {
    //               if (final.statusCode === 200) {
    //                 this.successToast('You have successfully posted the invoice and generated transactions');
    //                 this.newBatchModal = false;
    //                 // let's show them their batch?
    //                 setTimeout(() => {
    //                   this.postSubmitted = false;
    //                   this._router.navigateByUrl(
    //                     'ViewBatchComponent?Id=' + batchId
    //                   );
    //                 }, 1000);
    //               }
    //             }, error => {
    //               console.log(error);
    //               this.errorToast(error);
    //             });

    //           }
    //         }, error => {
    //           console.log(error);
    //           this.errorToast(error);
    //         });

    //       }, error => {
    //         console.log(error);
    //         this.errorToast(error);
    //       });



    //     });
    //   }
    // }, error => {
    //   console.log(error);
    //   this.errorToast(error);
    // });

  }

  /** load the accounts for a grower (by id) */
  public loadGrowerAccounts(id: number) {
    this._accountService
      .getGrowerAccounts(id)
      .subscribe(
        data => {
          try {
            this.accountList = data
            .sort(function(a, b) {
              return a.accountType.localeCompare(b.accountType) || a.accountSuffix.localeCompare(b.accountSuffix);
            })
            .map(a => {
              a.accountType = this.getAccountType(a.accountType).accountType + ' - ' + a.accountSuffix;
              return a;
            });

            // this.loadInvoices(id);

          } catch (e) {
            console.error(e);
          }
        },
        error => {
          console.error(error);
          this.errorToast(error);
        }
      );
  }

  /** submit handler for invoice search */
  public searchInvoices() {
    const val = this.searchForm.value;
    this.invoicesLoaded = false;
    this.filterSubmitted = true;

    const model = {
      daysBackFromToday: val.DaysBack,
    } as IApInvoiceSearchVM;
    this.loadInvoices(model);
  }

  /** load the invoices for the grower */
  public loadInvoices(model: IApInvoiceSearchVM) {
    this._invoiceService.searchInvoices(model)
    .subscribe(data => {
      try {
        this.invoices = data;
        if (this.invoices.length === 0) {
          this.invoiceItems = [];
          this.invoicesLoaded = true;
          this.filterSubmitted = false;
          return;
        } else {
          this.invoiceItems = this.invoices.map(i => {
            i.Status = i.Status.trim();
            const vmatch = this.vendorList.find(v => v.vnumb.toString() === i.VendorId.toString());
            const grower = this.growerList.find(g => g.id.toString() === i.GrowerId.toString());
            const item = {
              invoice: i,
              // accountName: this.accountList.find(a => a.id.toString() === i.account.toString()).accountType,
              companyName: this.companyList.find(c => c.Value.toString() === i.Company.toString()).Text,
              vendorName: vmatch.vnumb + ' - ' + vmatch.vname,
              growerName: !!!grower ? 'Invalid' : (grower.id.toString() + ' - ' + grower.farmName),
            } as IInvoiceItem;
            return item;
          });
          this.invoicesLoaded = true;
          this.filterSubmitted = false;
        }
      } catch (e) {
        console.error(e);
      }
    },
    error => {
      console.error(error);
      this.errorToast(error);
    });
  }

  public addInvoice() {
    this._router.navigateByUrl(
      'AddGrowerInvoiceComponent'
    );
    return;
  }

  /***************************************************
   * Dropdowns
   **************************************************/

  /** helper to get the account type */
  public getAccountType(id: string) {
    return this.accountTypes.find(at => at.id.toString() === id);
  }

   /** centralize the dropdown loading */
  private loadDropdowns() {
    this.loadAccountTypeList().then(() => {
      this.loadCompanyList();
      this.loadVendorList();
      this.dropdownsLoaded = true;
      this.searchInvoices();
    });
  }

  private loadGrowers() {
    this._growerService
    .getGrowers(true)
    .subscribe(
      data => {
        try {
          this.growerList = data;
          // CLEANUP: delete dead code after testing
          // .map(g => {
          //   switch (g.farmType.toString()) {
          //     case 'B':
          //     case '1':
          //       g.farmType = 'Broiler';
          //       break;
          //     case 'H':
          //     case '2':
          //       g.farmType = 'Breeder';
          //       break;
          //     case 'M':
          //     case '3':
          //       g.farmType = 'Misc';
          //       break;
          //     case '4':
          //       g.farmType = 'Corporate';
          //       break;
          //     default:
          //       g.farmType = 'Invalid';
          //       break;
          //   }
          //   return g;
          // });
          this.loadDropdowns();


        } catch (e) {
          console.error(e);
        }
      },
      error => {
        console.error(error);
        this.errorToast(error);
      }
    );


  }

  /* load the account type list */
  private loadAccountTypeList(): Promise<any> {
    return new Promise((res, rej) => {
      this._dropdownService
      .getAccountTypes()
      .subscribe(
        data => {
          try {
            this.accountTypes = data;
            // save for the cell renderer
            sessionStorage.setItem('AccountTypeList', JSON.stringify(this.accountTypes));
            // save to json
          } catch (e) {
            console.error(e);
          }
        },
        error => {
          console.error(error);
          this.errorToast(error);
        }
      );

      res();
    });

  }

    /** Load the company list */
    private loadCompanyList() {
      this._dropdownService
        .getCompanies()
        .subscribe(
          data => {
            try {
              this.companyList = data;
            } catch (e) {
              console.error(e);
            }
          },
          error => {
            console.error(error);
            this.errorToast(error);
          }
        );
    }

    /** Load the vendor dropdown list */
    private loadVendorList() {
      // since the call takes 10 seconds, we just cached it on app init and retrieve it from there
      this.vendorList = JSON.parse(localStorage.getItem('APVendorList')) as IVwApvendorMaster[];
    }

  /***************************************************
   * Modals/Dialogs
   **************************************************/

  /** Show a toast popup for an error message */
  private errorToast(error: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: error
    });
  }

  /** Show a toast popup for a success message */
  private successToast(msg: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: msg
    });
  }
  /** Show a toast popup for an info message */
  private infoToast(msg: string) {
    this.messageService.add({
      severity: 'info',
      summary: 'Information',
      detail: msg
    });
  }


  /***************************************************
   * Misc utils
   **************************************************/
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.columnResizeHiding();
  }

  /** null safe toLower */
  private toLowerNullable(value: string) {
    return value != null ? value.toLowerCase() : '';
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    // hide some columns if needed
    this.columnResizeHiding();

    // resize the cols
    this.gridApi.sizeColumnsToFit();

  }

  public columnResizeHiding() {
    this.gridColumnApi.setColumnVisible('invoice.invoiceDate', window.innerWidth > 1500);
    this.gridColumnApi.setColumnVisible('companyName', window.innerWidth > 1300);
  }
}
