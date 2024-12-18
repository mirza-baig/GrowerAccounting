import { IGLAccountMaster } from './../../models/gl-account-master.interface';
import { ITransactionTypeTotal } from './transaction-type-total.interface';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { fade, slide } from 'src/fieldale-animations';
import { AgGridAngular } from '@ag-grid-community/angular';
import { ViewBatchService } from './view-batch.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ITransactionVM } from 'src/app/models/transaction-vm.interface';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { TransactionsActionButtonsComponent } from './transactions-action-buttons/transactions-action-buttons.component';
import { GrowerTransactionsService } from '../grower-transactions.service';
import { IGrowerTransactionVM } from 'src/app/models/grower-transaction-vm.interface';
import { IGrowerTransaction } from 'src/app/models/grower-transaction.interface';
import * as moment from 'moment';
import { ITransactionType } from 'src/app/models/transaction-type.interface';
import { DropdownService } from 'src/app/shared/dropdown.service';
import { EditAccountService } from 'src/app/account-maintenance/edit-account/edit-account.service';
import { IAccountType } from 'src/app/models/account-type.interface';
import { BatchTotal } from './batch-total-model';
import { HttpClient } from '@angular/common/http';
import { IGrowerTransactionBatch } from 'src/app/models/grower-transaction-batch.interface';
import { ICurrentUser } from 'src/app/user-management/current-user.interface';
import { UtilityService } from 'src/app/shared/utility.service';
import { GrowerMasterListService } from 'src/app/account-maintenance/grower-master-list/grower-master-list.service';
import { IGrowerMaster } from 'src/app/models/grower-master.interface';
import { AccountNameCellRendererComponent } from 'src/app/shared/account-name-cell-renderer/account-name-cell-renderer.component';
import { ITransaction } from 'src/app/models/transaction.interface';
import { ITransactionBatchGldistributions } from 'src/app/models/transaction-batch-gl-distributions.interface';
import {currencyFormatter} from '../../shared/grid-formatters/currency-formatter';
import {dateFormatter} from '../../shared/grid-formatters/date-formatter';
@Component({
  selector: 'app-view-batch',
  templateUrl: './view-batch.component.html',
  styleUrls: ['./view-batch.component.css'],
  animations: [fade, slide]
})
export class ViewBatchComponent implements OnInit {

  @ViewChild('agGrid') agGrid: AgGridAngular;

  pageTitle = 'Grower Transactions for Batch';
  moduleTitle = 'Transactions';
  public id: number;
  public showErrorsOnly: boolean = false;
  public isPcsBatch: boolean = false;
  public hasTransfers: boolean = false;

  innerWidth: number;
  innerHeight: number;
  lockSettlements: boolean = true;
  lockLoaded: boolean = false;
  postSubmitted: boolean = false;
  undoSubmitted: boolean = false;

  // Transactions
  transactions: IGrowerTransaction[] = [];
  corneliaTransactions: IGrowerTransaction[] = [];
  lavoniaTransactions: IGrowerTransaction[] = [];
  transactionsLoaded = false;
  transactionTypeList: ITransactionType[] = [];
  accountTypeList: IAccountType[] = [];
  batchTotals: BatchTotal[] = [];
  transactionTypeTotals: ITransactionTypeTotal[] = [];
  corneliaTypeTotals: ITransactionTypeTotal[] = [];
  lavoniaTypeTotals: ITransactionTypeTotal[] = [];
  glDists: ITransactionBatchGldistributions[] = [];
  batchHasErrors: boolean = false;
  showAllTransactions: boolean = true;

  // Totals
  totalRegular: number = 0;
  totalSpecial: number = 0;
  totalNotesPayable: number = 0;
  totalConstruction: number = 0;
  totalUnique: number = 0;
  totalBatch: number = 0;
  totalCornelia: number = 0;
  totalLavonia: number = 0;
  vendorAccountTotals: string[] = [
    '9994',
    '9996',
    '9997',
    '9918',
    '9987',
    '9988',
    '9989',
    '9900',
    '9902',
    '9906',
    '9999'
  ];

  // ? is farm growerid or groweraccountid?
  // grid vars
  columnDefs = [


    {
      headerName: 'Farm',
      field: 'growerName',
      width: 200,
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      },
      cellStyle: function(params) {
        if (!!params.value && (params.value.trim().includes('Invalid'))) {
          return  {
            'border': '2px solid black',
            'background-color': '#F02020',
            'color': 'white',
          };
        } else {
          return null;
        }
      }
    },
    {
      headerName: 'Account',
      // field: 'growerAccountId',
      field: 'transactionAccountName',
      width: 150,
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      },
      // cellRenderer: 'accountNameRenderer',
      cellStyle: function(params) {
        if (params.data.growerAccountId.toString() === '0'
        && params.data.transactionCode.toString().indexOf('35') === -1
         && params.data.transactionCode.toString().indexOf('70') === -1) {
          return  {
            'border': '2px solid black',
            'background-color': '#F02020',
            'color': 'white',
          };
        } else {
          return null;
        }
      }
    },
    {
      headerName: 'Type',
      field: 'transactionCode',
      width: 150,
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      },
    },
    {
      headerName: 'PCS Store',
      field: 'storeId',
      width: 150,
      sortable: true,
      filter: true,
      filterParams: {
        debounceMs: 0,
      },
    },

    // {headerName: 'Date', valueFormatter: this.dateFormatter, field: 'transactionDate', width: 150, sortable: true, filter: true },
    {
      headerName: 'Date',
      valueFormatter: dateFormatter,
      field: 'transactionDate',
      width: 150,
      sortable: true,
      filter: true
    },
    {
      headerName: 'Description',
      field: 'transactionDescription',
      width: 300,
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      },
    },
    {
      headerName: 'Amount',
      valueFormatter: currencyFormatter,
      field: 'transactionAmount',
      width: 150,
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        debounceMs: 0,
      },
    },
    {
      headerName: 'Status',
      field: 'transactionStatus',
      width: 80,
      sortable: true,
      filter: true,
      hide: true,
    },
    {
      headerName: 'Actions',
      cellRenderer: 'actionsTransactionRenderer',
      field: 'id',
      width: 300,
      sortable: false,
      filter: false
    }
  ];
  modules = AllModules;
  public frameworkComponents = {
    actionsTransactionRenderer: TransactionsActionButtonsComponent,
    accountNameRenderer: AccountNameCellRendererComponent,
  };
  public gridApi;
  public gridColumnApi;

  // print stuff
  printReady: boolean = false;
  batchModel: IGrowerTransactionBatch;

  postBatchModal: boolean = false;

  undoBatchModal: boolean = false;

  growers: IGrowerMaster[] = [];
  glAccounts: IGLAccountMaster[] = [];

  constructor(
    private messageService: MessageService,
    private _batchService: ViewBatchService,
    private _growerService: GrowerMasterListService,
    private _transactionService: GrowerTransactionsService,
    private _accountService: EditAccountService,
    private _dropdownService: DropdownService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _http: HttpClient,
    private _utilityService: UtilityService,
  ) { }

  ngOnInit() {
    // set width
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;


    // parse the URL?
    this._route.queryParams.subscribe(params => {
      this.id = params['Id'];
    });

    // load the gl account list



    this.getLockStatus();

    this.checkFilterState();
    this.loadGLAccountList();
  }

  /** load the GL account list from the AS400 */
  private loadGLAccountList() {
    this._dropdownService
      .getGLAccounts()
      .subscribe(
        data => {
          try {
            this.glAccounts = data;

            this.pageTitle += ' #' + this.id.toString();
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

  /** checks to see if we need to set our filter to errors only */
  public checkFilterState() {
    // get the batch id
    const batchId = JSON.parse(sessionStorage.getItem('BatchId')) as number;
    if (!!batchId && this.id.toString() === batchId.toString()) {
      // if it is the same as the id in the URL, we can assume we returned to this page
      this.showAllTransactions = JSON.parse(sessionStorage.getItem('showAllTransactions')) as boolean;
    } else {
      // save an init state as reset
      sessionStorage.setItem('BatchId', JSON.stringify(this.id));
      sessionStorage.setItem('showAllTransactions', JSON.stringify(true));
    }

  }


  public loadGrowers() {
    this._growerService
    .getGrowers(this.batchModel.status.trim() === 'Posted')
    .subscribe(
      data => {
        try {
          this.growers = data.map(g => {
            g.status = g.status.trim();
            switch (g.farmType.toString()) {
              case 'B':
              case '1':
                g.farmType = 'Broiler';
                break;
              case 'H':
              case '2':
                g.farmType = 'Breeder';
                break;
              case 'M':
              case '3':
                g.farmType = 'Misc';
                break;
              case '4':
                g.farmType = 'Corporate';
                break;
              default:
                g.farmType = 'Invalid';
                break;
            }

            g.farmName = g.id.toString() + ' - ' + g.farmName;

            return g;
          });
          // filter out inactive growers if there were import errors
          if (this.batchModel.status === 'Error') {
            this.growers = this.growers.filter(g => g.status === 'Active');
          }

          this.loadAccountTypes();
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

  /** Check to see if the site needs to be locked down */
  public getLockStatus() {
    this._utilityService
      .isSettlementInProcess()
      .subscribe(
        data => {
          try {
            this.lockSettlements = data;
            sessionStorage.setItem('lockSettlements', JSON.stringify(data));
            this.lockLoaded = true;
          } catch (e) {
            console.error(e);
          }
        },
        error => {
          console.error(error);
        }
      );
  }

  public loadTransactionTypes() {

  }

  private loadBatch(id: number) {
    this._transactionService
    .getGrowerTransactionsBatches()
    .subscribe(
      data => {
        try {
          this.batchModel = data.find(b => b.id.toString() === id.toString());
          this.loadGrowers();
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

  private loadAccountTypes() {
    this._dropdownService
    .getAccountTypes()
    .subscribe(
      data => {
        try {
          this.accountTypeList = data.sort((a, b) => a.id - b.id);

          // save for the cell renderer
          sessionStorage.setItem('AccountTypeList', JSON.stringify(this.accountTypeList));

          // todo - change to map?
          for (let i = 0; i < data.length; i++) {
            this.batchTotals.push(new BatchTotal(data[i], 0));
          }



          this.loadTransactionTypeList();
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

  private loadTransactionTypeList() {
    this._dropdownService
    .getTransactionTypes()
    .subscribe(
      data => {
        try {
          this.transactionTypeList = data;
          this.transactionTypeTotals = data.map(tt => {
            return {
              type: tt,
              total: 0,
            } as ITransactionTypeTotal;
          });
          this.corneliaTypeTotals = data.map(tt => {
            return {
              type: tt,
              total: 0,
            } as ITransactionTypeTotal;
          });
          this.lavoniaTypeTotals = data.map(tt => {
            return {
              type: tt,
              total: 0,
            } as ITransactionTypeTotal;
          });
          this.loadTransactions(this.id);
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

  getTransactionType(code: string) {
    const match = this.transactionTypeList.find(t => t.code.toString() === code);

    return !!!match ? '' : match.code + ' - ' + match.transactionType;
  }

  /** load the list of transactions */
  private loadTransactions(id: number) {

    this._batchService
    .getGrowerTransactionsByBatchId(id)
    .subscribe(
      data => {
        try {
          let transactionCount = 0;

          this.hasTransfers = data.findIndex(t => t.growerId.toString() === '99990' || t.growerId.toString() === '99060') !== -1;
          if (data.length === 0) {
            this.transactionsLoaded = true;
          }
          this.transactions = data.map(t => {

            // add to the transaction type bucket
            const ttypeIndex = this.transactionTypeTotals.findIndex(ttt => ttt.type.code.toString() === t.transactionCode.toString());
            this.transactionTypeTotals[ttypeIndex].total += t.transactionAmount;

            // this.batchTotals[acctType.id - 1].total += t.transactionAmount;


            const match = this.transactionTypeList.find(type => type.code.toString() === t.transactionCode.toString());
            t.transactionCode = match.code + ' - ' + match.transactionType;
            const grower = this.growers.find(g => g.id.toString() === t.growerId.toString());
            t.growerName = !!grower ? grower.farmName : t.growerId + ' - Invalid';
            //
            // if (!!grower && grower.status.trim().includes('Inactive')) {
            //   t.growerName = t.growerId + ' - Inactive';
            // }
            // mark errors
            // todo - invalid grower account too and not just grower
            if (t.growerName.includes('Invalid')
                // || t.growerName.includes('Inactive')
                || (!!t.growerAccountId && t.growerAccountId.toString() === '0' && t.transactionCode.indexOf('70') === -1 && t.transactionCode.indexOf('35') === -1)) {


            }

            // todo - formalize this in the api
            if (this.batchModel.description === 'PCS') {
              this.isPcsBatch = true;
              if (!!t.storeId && t.storeId.toString() !== '0')  {
                // 1 is cornelia, 2 is lavonia
                t.storeId = t.storeId.toString() === '2' ? 'Lavonia' : 'Cornelia';
                if (t.storeId === 'Lavonia') {
                  this.lavoniaTypeTotals[ttypeIndex].total += t.transactionAmount;
                  this.totalLavonia += t.transactionAmount;
                } else {
                  this.corneliaTypeTotals[ttypeIndex].total += t.transactionAmount;
                  this.totalCornelia += t.transactionAmount;
                }

              } else {
                t.storeId = 'Invalid';
              }

            } else {

            }

            this.totalBatch += t.transactionAmount;
            if (t.growerAccountId > 0 && match.code !== '70' && match.code !== '35') {
              // figure out the account type
              const acctType = this.accountTypeList.find(at => at.accountCode === t.artype.trim());
              // set the name
              t.transactionAccountName = acctType.accountType + ' - ' + t.accountSuffix;
              // update the right total
              this.batchTotals[acctType.id - 1].total += t.transactionAmount;
              transactionCount++;
              // check if we need to bail
              if (transactionCount === data.length) {
                this.transactionsLoaded = true;
              }


            } else if (match.code === '70') {
              t.transactionAccountName = 'N/A';
              // update the right total
              transactionCount++;
              // check if we need to bail
              if (transactionCount === data.length) {
                this.transactionsLoaded = true;
              }
            }  else if (match.code === '35') {
              const acctType = this.accountTypeList.find(at => at.accountCode === t.artype.trim());
              if (!!!acctType) {
                t.transactionAccountName = 'Invalid';
              } else {
                // set the name
                t.transactionAccountName = acctType.accountType + ' - ' + t.accountSuffix;
                // update the right total
                this.batchTotals[acctType.id - 1].total += t.transactionAmount;
              }

              // update the right total
              transactionCount++;
              // check if we need to bail
              if (transactionCount === data.length) {
                this.transactionsLoaded = true;
              }
            } else {
              // invalid transaction but still add to the count
              transactionCount++;
              t.transactionAccountName = 'Invalid';
              // check if we need to bail
              if (transactionCount === data.length) {
                this.transactionsLoaded = true;
              }
            }

            if (t.storeId === 'Lavonia') {
              this.lavoniaTransactions.push(t);
            } else if (t.storeId === 'Cornelia') {
              this.corneliaTransactions.push(t);
            }

            return t;
          });



          this.loadGlDistributions(id);
          // reflect batch errors
          this.batchHasErrors = data.filter(t => t.growerName.trim().includes('Invalid') ||
            (!!t.transactionStatus && t.transactionStatus.trim() === 'Error')).length > 0;

          // check if we should "unlock" an error batch
          if (this.batchModel.status.trim() === 'Error' && !this.batchHasErrors) {

            this.batchModel.status = 'New';
            this._transactionService
              .postTransactionBatch(this.batchModel)
              .subscribe(
                updateResult => {
                  try {
                    if (updateResult.statusCode === 200) {
                      this.batchHasErrors = false;
                    }

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

  public getAccountName(id: number) {
    const gl = this.glAccounts.find(g => g.id.toString() === id.toString());
    return gl.glAccountName;
  }

  /** load the gl distributions for the batch */
  private loadGlDistributions(id: number) {
    this._batchService.getGrowerTransactionBatchGldistributions(id).subscribe(result => {
      this.glDists = result.map(d => {
        const gl = this.glAccounts.find(g => g.id.toString() === d.glaccount.toString());
        d.accountName = gl.glAccountName;
        return d;
      });
      // if none exist for the batch, make at least one for 1-118-00
      if (result.length === 0 && this.transactions.length > 0) {
        const dist = {
          id: 0,
          glaccount: 111800,
          transactionBatchId: parseInt(id.toString(), 10),
          amount: this.transactions.map(t =>  t.transactionAmount).reduce((a, b) => a + b),
        } as ITransactionBatchGldistributions;
        this.glDists.push(dist);
        this.postGlDistributions();
      }
    }, error => {
      this.errorToast(error);
      console.error(error);
    });
  }

  private postGlDistributions() {
    this._batchService.postGrowerTransactionBatchGldistributions(this.glDists).subscribe(result => {
      // reload to get any missing ids
      this.loadGlDistributions(this.id);
    }, error => {
      this.errorToast(error);
      console.error(error);
    });
  }

  public getGlAccountNoString(id: number) {
    const s = id.toString();
    return s.substr(0, 1) + '-' + s.substr(1, 3) + '-' + s.substring(4);
  }

  public getGlTotalByStoreId(glNo: number, storeId: string) {
    // filter down to the store
    const trans = this.transactions.filter(t => t.storeId.toString() === storeId);
    const trans99990 = this.transactions.filter(t => t.growerId.toString() === '99990').map(t => t.transactionAmount);
    const trans99060 = this.transactions.filter(t => t.growerId.toString() === '99060').map(t => t.transactionAmount);
    const total99990 = !!trans99990 && trans99990.length >= 1 ? trans99990.reduce((a, b) => a + b) : 0;
    const total99060 = !!trans99060 && trans99060.length >= 1 ? trans99060.reduce((a, b) => a + b) : 0;

    switch (glNo) {
      case 132500: {
        const values = trans.filter(t => t.transactionTaxExemptCode === 'N' && t.quantity.toString() === '0'
        && t.growerId.toString() !== '99990' && t.growerId.toString() !== '99060').map(t => t.transactionAmount);
        return !!values && values.length >= 1 ? values.reduce((a, b) => a + b) * -1 : 0;
      }
      case 111800: {
        const values = trans.filter(t => t.growerId.toString() !== '99990' && t.growerId.toString() !== '99060').map(t => t.transactionAmount);
        return !!values && values.length >= 1 ? values.reduce((a, b) => a + b) : 0;
      }
      case 150118:
      case 150119: {
        const values = trans.filter(t => t.growerId.toString() !== '99990' && t.growerId.toString() !== '99060').map(t => t.transactionAmount);
        const t1 = !!values && values.length >= 1 ? values.reduce((a, b) => a + b) : 0;
        const values2 = trans.filter(t => t.transactionTaxExemptCode === 'N' && t.quantity.toString() === '0'
        && t.growerId.toString() !== '99990' && t.growerId.toString() !== '99060').map(t => t.transactionAmount);
        const t2 = !!values2 && values2.length >= 1 ? values2.reduce((a, b) => a + b) : 0;
        return (t1 - t2) * -1;
      }
      // 99990 is CN to LV, 99060 is LV to CN
      case 160518: {
        // purchases pcs cornelia
        return total99060 - total99990;
      }
      case 160519: {
        // purchases pcs lavonia
        return total99990 - total99060;
      }
    }

    return 0;
    // todo - compute this
  }

  public goToAdd() {
    this._router.navigateByUrl(
      'AddGrowerTransactionComponent?BatchNumber=' + this.id
    );
    return;
  }

  public goHome() {
    this._router.navigateByUrl(
      'GrowerTransactionsComponent'
    );
    return;
  }

  public virtualRowRemoved(event: any) {
      this.validateTransactions();
  }

  private validateTransactions() {

    if (this.batchModel.status.trim() === 'Error') {
      // only validate if we need to
      let valid = true;
      const vals = [];
      this.gridApi.forEachNode((node: { data: ITransaction; }) => vals.push(node.data));
      vals.forEach(t => {
        // keep checking if any are invalid
        if (t.growerName.includes('Invalid')
        // || t.growerName.includes('Inactive')
        || t.growerAccountId.toString() === '0') {
          valid = false;
        }
      });

      // if still valid, then update the batch
      if (valid) {
        this.batchHasErrors = false;
        this.batchModel.status = 'New';
        this._transactionService.postTransactionBatch(this.batchModel)
          .subscribe(
            updateResult => {
              try {
                if (updateResult.statusCode === 200) {
                  this.batchHasErrors = false;
                }

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
    }
    /*
if (t.growerName.includes('Invalid')
                // || t.growerName.includes('Inactive')
                || t.growerAccountId.toString() === '0') {
              t.transactionStatus = 'Error';
            }
    */
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
            <title>Batch #${this.batchModel.id} - ${this.batchModel.description}</title>
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

  public printCornelia() {
    this.printReady = true;
    this._http.get('assets/tablestyle.json').subscribe(res => {
      const tableStyle = res['style'];
      let printContents, popupWin;
      printContents = document.getElementById('print-section-cornelia').innerHTML;
      popupWin = window.open(
        '',
        '_blank',
        'top=0,left=0,height=100%,width=auto'
      );
      popupWin.document.open();
      popupWin.document.write(`
        <html>
          <head>
            <title>Batch #${this.batchModel.id} - ${this.batchModel.description} Cornelia Transactions</title>
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

  public printLavonia() {
    this.printReady = true;
    this._http.get('assets/tablestyle.json').subscribe(res => {
      const tableStyle = res['style'];
      let printContents, popupWin;
      printContents = document.getElementById('print-section-lavonia').innerHTML;
      popupWin = window.open(
        '',
        '_blank',
        'top=0,left=0,height=100%,width=auto'
      );
      popupWin.document.open();
      popupWin.document.write(`
        <html>
          <head>
            <title>Batch #${this.batchModel.id} - ${this.batchModel.description} Lavonia Transactions</title>
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

  public getGrowerAccountTotals(growerId: string, storeId: string) {
    // first determine the working set
    let transactions = [] as IGrowerTransaction[];
    if (storeId === 'cornelia') {
      transactions = this.corneliaTransactions;
    } else if (storeId === 'lavonia') {
      transactions = this.lavoniaTransactions;
    } else {
      // full
      transactions = this.transactions;
    }

    // then determine which group to get
    if (growerId === 'intracompany') {
      const values = transactions.filter(t => parseInt(t.growerId.toString(), 10) < 10000).map(t => t.transactionAmount);
      return !!values && values.length >= 1 ? values.reduce((a, b) => a + b) : 0;
    } else if (growerId === 'outside') {
      // grower not less than 10000
      // outside growers are non company accounts that end with a 0
      const outsideGrowers = this.growers.filter(g =>  // these are always misc
      g.id > 10000 // filter out company accts
      && g.id.toString().endsWith('0')
      && this.vendorAccountTotals.findIndex(v => v === g.vendorId.toString()) === -1); // check against the "special" accounts
      const values = transactions.filter(t => outsideGrowers.findIndex(g => g.id.toString() === t.growerId.toString()) !== -1).map(t => t.transactionAmount);
      // vendorAccountTotals
      return !!values && values.length >= 1 ? values.reduce((a, b) => a + b) : 0;
    } else {
      const gid = growerId + '0';
      const values = transactions.filter(t => t.growerId.toString() === gid).map(t => t.transactionAmount);
      return !!values && values.length >= 1 ? values.reduce((a, b) => a + b) : 0;
    }
  }

  /***************************************************
   * Post Batch
   **************************************************/
  public submitPostBatchModal() {
    this.postBatchModal = false;
    this.postSubmitted = true;

    this.infoToast('Please wait while the batch posts and processes.');

    this.batchModel.status = 'Posted';
    // get the user
    const user = JSON.parse(localStorage.getItem('ActiveDirectoryUser')) as ICurrentUser;
    this.batchModel.postedDate = new Date().toISOString();
    this.batchModel.postedBy = user.username;

    this._transactionService
    .postTransactionBatch(this.batchModel)
    .subscribe(
      data => {
        try {
          if (data.statusCode === 200) {
            this.successToast('You have successfully posted batch #' + this.batchModel.id);
            this.postSubmitted = false;
            setTimeout( () => {
              this._router.navigateByUrl(
                'GrowerTransactionsComponent'
              );
            }, 1000 );
          }

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

  /***************************************************
   * Undo Batch
   **************************************************/
   public undoBatchModalSubmit() {
    this.undoBatchModal = false;
    this.undoSubmitted = true;

    this.infoToast('Please wait while the batch reverses all transactions.');

    this.batchModel.status = 'New';

    this._batchService
    .undoTransactionBatch(this.batchModel.id)
    .subscribe(
      data => {
        try {
          if (data.statusCode === 200) {
            this.successToast('You have successfully undone batch #' + this.batchModel.id + ' and its transactions');
            this.postSubmitted = false;
            setTimeout( () => {
              this.transactionsLoaded = false;
              this.loadTransactions(this.batchModel.id);
            }, 1000 );
          }

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

  public showHideTransactions() {
    this.showAllTransactions = !this.showAllTransactions;
    sessionStorage.setItem('showAllTransactions', JSON.stringify(this.showAllTransactions));

    const filterInstance = this.gridApi.getFilterInstance('transactionStatus');
    filterInstance.selectNothing();

    if (this.showAllTransactions) {
      filterInstance.selectEverything();

    } else {
      filterInstance.selectValue('Error');
    }

    filterInstance.applyModel();
    this.gridApi.onFilterChanged();

  }



  /***************************************************
   * Misc utils
   **************************************************/
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.gridColumnApi.setColumnVisible('storeId', this.batchModel.description === 'PCS');

    const filterInstance = this.gridApi.getFilterInstance('transactionStatus');
    filterInstance.selectNothing();

    if (this.showAllTransactions) {
      filterInstance.selectEverything();

    } else {
      filterInstance.selectValue('Error');
    }

    filterInstance.applyModel();
    this.gridApi.onFilterChanged();

    // resize the cols
    this.gridApi.sizeColumnsToFit();

  }


}
