import { ToastService } from 'src/app/shared/toast.service';
import { IGrowerAccount } from 'src/app/models/grower-account.interface';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { IGrowerMaster } from 'src/app/models/grower-master.interface';
import { AgGridAngular } from '@ag-grid-community/angular';
import { IGrowerAccountType } from 'src/app/models/grower-account-type.interface';
import { IGrowerTransaction } from 'src/app/models/grower-transaction.interface';
import { GridApi, ColumnApi } from '@ag-grid-community/all-modules';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { AccountInquiryService } from 'src/app/account-inquiry/account-inquiry.service';
import { AccountMaintenanceService } from 'src/app/account-maintenance/account-maintenance.service';
import { DropdownService } from 'src/app/shared/dropdown.service';
import { ITransactionType } from 'src/app/models/transaction-type.interface';
import {dateFormatter} from '../../shared/grid-formatters/date-formatter';
import {currencyFormatter} from '../../shared/grid-formatters/currency-formatter';

@Component({
  selector: 'app-account-inquiry',
  templateUrl: './account-inquiry.component.html',
  styleUrls: ['./account-inquiry.component.css']
})
export class AccountInquiry2Component implements OnInit {

  @ViewChild('agGrid') agGrid: AgGridAngular;
  pageTitle = 'Account Transaction Inquiry';
  moduleTitle = 'Transactions';
  innerWidth: any;
  innerHeight: any;

  growersLoaded: boolean = false;
  selectedGrower: IGrowerMaster;
  isGrowerSelected: boolean = false;

  selectedAccount: IGrowerAccount;
  isAccountSelected: boolean = false;

  transactions: IGrowerTransaction[] = [];
  accountTransactions: IGrowerTransaction[] = [];
  accounts: IGrowerAccount[] = [];
  accountTypeList: IGrowerAccountType[] = [];
  transactionTypeList: ITransactionType[] = [];
  transactionsLoaded: boolean = false;

  columnDefs = [
    {
      headerName: 'Type',
      field: 'transactionCode',
      // valueFormatter: this.getTransactionType,
      width: 200,
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      }
    },
    {
      headerName: 'Date',
      field: 'transactionDate',
      valueFormatter: dateFormatter,
      width: 200,
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
      }
    },
    {
      headerName: 'Quantity',
      field: 'quantity',
      width: 150,
      sortable: true,
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: 'Amount',
      valueFormatter: currencyFormatter,
      field: 'transactionAmount',
      width: 200,
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        debounceMs: 0,
      }
    },
    {
      headerName: 'Reference',
      field: 'referenceNumber',
      width: 200,
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      },

    },
    {
      headerName: 'Status',
      field: 'transactionStatus',
      width: 150,
      sortable: true,
      filter: true
      // cellRenderer: 'accountNameRenderer',
    }
  ];

  modules = AllModules;
  private gridApi: GridApi;
  private gridColumnApi: ColumnApi;



  constructor(
    private _toastService: ToastService,
    private _accountService: AccountInquiryService,
    private _dropdownService: DropdownService,
    private _accountListService: AccountMaintenanceService,
  ) { }

  ngOnInit() {

    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    this.loadAccountTypes();
    this.loadTransactionTypeList();
  }

  private loadTransactionTypeList() {
    this._dropdownService
    .getTransactionTypes()
    .subscribe(
      data => {
        try {
          this.transactionTypeList = data;
        } catch (e) {
          console.error(e);
        }
      },
      error => {
        console.error(error);
        this._toastService.errorToast(error);
      }
    );
  }

  private loadAccountTypes() {
    this._dropdownService
    .getAccountTypes()
    .subscribe(
      data => {
        try {
          this.accountTypeList = data;
        } catch (e) {
          console.error(e);
        }
      },
      error => {
        console.error(error);
        this._toastService.errorToast(error);
      }
    );
  }

  public onGrowerSelected(event: any) {
    if (!!!event) {
      // todo ? event is null, reset ?
      this.selectedGrower = event;
      this.isGrowerSelected = false;
      this.selectedAccount = null;
      this.isAccountSelected = false;
    } else {
      this.selectedGrower = event;
      this.isGrowerSelected = true;

      this._accountService
        .getGrowerTransactionsByGrowerId(this.selectedGrower.id)
        .subscribe(
          data => {
            try {
              // map a few extra fields
              this.transactions = data
              .filter(t => t.transactionStatus === 'Posted')
              .map(trans => {
                trans.transactionStatus = trans.transactionStatus.trim();
                trans.transactionCode = this.getTransactionTypeHelper(trans.transactionCode);
                return trans;
                }
              ).sort((a, b) => new Date(b.transactionDate.toString()).getTime() - new Date(a.transactionDate.toString()).getTime());
              // then build the form
              this.transactionsLoaded = true;
            } catch (e) {
              console.error(e);
            }
          },
          error => {
            console.error(error);
            this._toastService.errorToast(error);
          }
        );
    }
  }

  public onAccountSelected(event: any) {
    if (!!!event) {
      this.selectedAccount = null;
      this.isAccountSelected = false;
    } else {
      this.selectedAccount = event;
      this.accountTransactions = this.transactions.filter(t => t.growerAccountId.toString() === this.selectedAccount.id.toString());
      this.isAccountSelected = true;
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

   onGridReady(params) {
     this.gridApi = params.api;
     this.gridColumnApi = params.columnApi;
     // resize the cols
     this.gridApi.sizeColumnsToFit();
   }


  /** hardcoded transaction type list for conversion */
  public getTransactionType(params: any) {
    switch (params.value.toString()) {
      case '10': return '10 -	Warehouse Ticket';
      case '12': return '12 -	Poultry Purchase';
      case '15': return '15 -	LP Gas Ticket';
      case '20': return '20 -	A/P Advice Slip';
      case '25': return '25 -	Labor Advance';
      case '30': return '30 -	Cash Advance';
      case '35': return '35 -	Misc Invoices';
      case '40': return '40 -	Cash Receipts';
      case '45': return '45 -	Misc Entries';
      case '46': return '46 -	Transfer';
      case '50': return '50 -	Flock Settlement';
      case '55': return '55 -	Interest Charged';
      case '60': return '60 -	Interest Paid';
      case '65': return '65 -	Note Payment';
      default: return params.value + ' - Invalid';
    }
  }

  private getTransactionTypeHelper(val: string) {
    switch (val) {
      case '10': return '10 -	Warehouse Ticket';
      case '12': return '12 -	Poultry Purchase';
      case '15': return '15 -	LP Gas Ticket';
      case '20': return '20 -	A/P Advice Slip';
      case '25': return '25 -	Labor Advance';
      case '30': return '30 -	Cash Advance';
      case '35': return '35 -	Misc Invoices';
      case '40': return '40 -	Cash Receipts';
      case '45': return '45 -	Misc Entries';
      case '46': return '46 -	Transfer';
      case '50': return '50 -	Flock Settlement';
      case '55': return '55 -	Interest Charged';
      case '60': return '60 -	Interest Paid';
      case '65': return '65 -	Note Payment';
      default: return val + ' - Invalid';
    }
  }
}
