import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { AgGridAngular } from '@ag-grid-community/angular';
import { ITransactionVM } from '../models/transaction-vm.interface';

import {AllModules} from '@ag-grid-enterprise/all-modules';
import { MessageService } from 'primeng/api';
import { AccountInquiryService } from './account-inquiry.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { IGrowerMaster } from '../models/grower-master.interface';
import { IGrowerTransaction } from '../models/grower-transaction.interface';
import { DropdownService } from '../shared/dropdown.service';
import { ITransactionType } from '../models/transaction-type.interface';
import { AccountNameCellRendererComponent } from '../shared/account-name-cell-renderer/account-name-cell-renderer.component';
import { IGrowerAccount } from '../models/grower-account.interface';
import { IGrowerAccountType } from '../models/grower-account-type.interface';
import { AccountMaintenanceService } from '../account-maintenance/account-maintenance.service';
import {dateFormatter} from '../shared/grid-formatters/date-formatter';
import {currencyFormatter} from '../shared/grid-formatters/currency-formatter';

@Component({
  selector: 'app-account-inquiry',
  templateUrl: './account-inquiry.component.html',
  styleUrls: ['./account-inquiry.component.css']
})

export class AccountInquiryComponent implements OnInit {

  @ViewChild('agGrid') agGrid: AgGridAngular;
  pageTitle = 'Grower Transaction History';
  moduleTitle = 'Transactions';
  innerWidth: any;
  innerHeight: any;

  growersLoaded: boolean = false;
  selectedGrower: IGrowerMaster;
  isGrowerSelected: boolean = false;

  transactions: IGrowerTransaction[] = [];
  accounts: IGrowerAccount[] = [];
  accountTypeList: IGrowerAccountType[] = [];
  transactionsLoaded: boolean = false;

  // todo - also need to show balance fwd, cur charges, cur credits, cash advance, amt due, ytd interest charged, ytd int paid
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
      headerName: 'Account',
      field: 'transactionAccountName',
      width: 150,
      sortable: true,
      filter: true
      // cellRenderer: 'accountNameRenderer',
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

  public frameworkComponents = {
    accountNameRenderer: AccountNameCellRendererComponent,
  };

  public gridColumnApi;
  public gridApi;
  modules = AllModules;


  transactionTypeList: ITransactionType[] = [];

  constructor(
    private messageService: MessageService,
    private _accountService: AccountInquiryService,
    private _dropdownService: DropdownService,
    private _accountListService: AccountMaintenanceService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    this.loadAccountTypes();
    this.loadTransactionTypeList();
    // this.loadTransactions();
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
          this.accountTypeList = data;
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

  public onGrowerSelected(event: any) {
    if (!!!event) {
      // todo ? event is null, reset ?
      this.selectedGrower = event;
      this.isGrowerSelected = false;
    } else {
      this.selectedGrower = event;
      this.isGrowerSelected = true;

      // load accounts
      this._accountListService
      .getGrowerAccounts(this.selectedGrower.id)
      .subscribe(
        accounts => {
          this.accounts = accounts.map(a => {
            const match = this.accountTypeList.find(at => at.id.toString() === a.accountType.toString());
            a.accountType = match.accountType + ' - ' + a.accountSuffix;
            return a;
          });

          // load the transactions

          this._accountService
          .getGrowerTransactionsByGrowerId(this.selectedGrower.id)
          .subscribe(
            data => {
              try {
                // map a few extra fields
                this.transactions = data.map(trans => {
                  trans.transactionStatus = trans.transactionStatus.trim();
                  trans.transactionCode = this.getTransactionTypeHelper(trans.transactionCode);
                  trans.transactionAccountName = this.accounts.find(a => a.id.toString() === trans.growerAccountId.toString()).accountType;
                  return trans;
                  }
                );
                // then build the form
                this.transactionsLoaded = true;
              } catch (e) {
                console.error(e);
              }
            },
            error => {
              console.error(error);
              this.errorToast(error);
            }
          );

        }, error => {
          console.error(error);
        }
      );
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

}
