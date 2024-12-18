import { AgGridAngular } from '@ag-grid-community/angular';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AccountInquiryService } from 'src/app/account-inquiry/account-inquiry.service';
import { AccountMaintenanceService } from 'src/app/account-maintenance/account-maintenance.service';
import { GrowerMasterListService } from 'src/app/account-maintenance/grower-master-list/grower-master-list.service';
import { IGrowerAccountType } from 'src/app/models/grower-account-type.interface';
import { IGrowerAccount } from 'src/app/models/grower-account.interface';
import { IGrowerMaster } from 'src/app/models/grower-master.interface';
import { IGrowerTransaction } from 'src/app/models/grower-transaction.interface';
import { ITransactionType } from 'src/app/models/transaction-type.interface';
import { AccountNameCellRendererComponent } from 'src/app/shared/account-name-cell-renderer/account-name-cell-renderer.component';
import { DropdownService } from 'src/app/shared/dropdown.service';
import { ToastService } from 'src/app/shared/toast.service';
import { TaxExemptListService } from './tax-exempt-list.service';
import {dateFormatter} from '../../shared/grid-formatters/date-formatter';
import {currencyFormatter} from '../../shared/grid-formatters/currency-formatter';

@Component({
  selector: 'app-tax-exempt-list',
  templateUrl: './tax-exempt-list.component.html',
  styleUrls: ['./tax-exempt-list.component.css']
})
export class TaxExemptListComponent implements OnInit {

  @ViewChild('agGrid') agGrid: AgGridAngular;
  pageTitle = 'Tax Exempt Transactions';
  moduleTitle = 'Transactions';
  innerWidth: any;
  innerHeight: any;

  transactions: IGrowerTransaction[] = [];
  accounts: IGrowerAccount[] = [];
  accountTypeList: IGrowerAccountType[] = [];
  transactionsLoaded: boolean = false;

  // todo - also need to show balance fwd, cur charges, cur credits, cash advance, amt due, ytd interest charged, ytd int paid
  columnDefs = [
    {
      headerName: 'Type',
      field: 'transactionCode',
      valueFormatter: this.getTransactionType,
      width: 200,
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      }
    },
    {
      headerName: 'Grower',
      field: 'growerName',
      width: 250,
      sortable: true,
      filter: true
      // cellRenderer: 'accountNameRenderer',
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
    // {
    //   headerName: 'Status',
    //   field: 'transactionStatus',
    //   width: 150,
    //   sortable: true,
    //   filter: true
    //   // cellRenderer: 'accountNameRenderer',
    // }
  ];

  public frameworkComponents = {
    accountNameRenderer: AccountNameCellRendererComponent,
  };

  public gridColumnApi;
  public gridApi;
  modules = AllModules;

  growerList: IGrowerMaster[] = [];
  transactionTypeList: ITransactionType[] = [];

  // search form
  dateForm: FormGroup;
  datesSubmitted: boolean = false;
  dropdownsLoaded: boolean = false;

  constructor(
    private messageService: ToastService,
    private _accountService: AccountInquiryService,
    private _dropdownService: DropdownService,
    private _accountListService: AccountMaintenanceService,
    private _growerService: GrowerMasterListService,
    private _transactionService: TaxExemptListService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    // set width
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

    // build the date form
    this.dateForm = this._formBuilder.group({
      StartDate: new FormControl({
        value: '',
      }, [ Validators.required]),
      EndDate: new FormControl({
        value: '',
      }, [ Validators.required]),
    });

    const currentYear = new Date().getFullYear();
    this.dateForm.patchValue({ StartDate: new Date(currentYear, 0, 1),
      EndDate: new Date(currentYear + 1, 0, 1)});


    this.loadGrowers();
  }

  private loadGrowers() {
    this._growerService.getGrowers(true).subscribe(
      result => {
        this.growerList = result;
        this.loadTransactionTypeList();
      }, error => {
        console.error(error);
        this.messageService.errorToast(error);
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
          this.loadAccountTypes();
        } catch (e) {
          console.error(e);
        }
      },
      error => {
        console.error(error);
        this.messageService.errorToast(error);
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
          this.dropdownsLoaded = true;
        } catch (e) {
          console.error(e);
        }
      },
      error => {
        console.error(error);
        this.messageService.errorToast(error);
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

  public submitDates() {
    this.datesSubmitted = true;
    const vals = this.dateForm.value;
    this._transactionService.getTaxExemptGrowerTransactionsForDateRange(vals.StartDate, vals.EndDate).subscribe(
      result => {
        this.transactions = result.map(t => {
          const grower = this.growerList.find(g => g.id.toString() === t.growerId.toString());
          t.growerName = t.growerId.toString() + ' - ' + grower.farmName;
          // const ttype = this.transactionTypeList.find(tt => tt.code === t.transactionCode);
          // t.transactionCode = ttype.transactionType;
          switch (t.artype) {
            case 'R':
              t.transactionAccountName = 'Regular - ' + t.accountSuffix;
              break;
            case 'C':
              t.transactionAccountName = 'Construction - ' + t.accountSuffix;
              break;
            case 'S':
              t.transactionAccountName = 'Special - ' + t.accountSuffix;
              break;
            case 'U':
              t.transactionAccountName = 'Unique - ' + t.accountSuffix;
              break;
            case 'M':
              t.transactionAccountName = 'Misc - ' + t.accountSuffix;
              break;
          }
          return t;
        });
        this.transactionsLoaded = true;
      }, error => {
        console.error(error);
        this.messageService.errorToast(error);
      }
    );
  }

  public exportToExcel() {
    this.gridApi.exportDataAsExcel(
      {
        fileName: 'Tax Exempt Transactions ' + new Date(this.dateForm.value.StartDate).getFullYear(),
        // columnKeys: [
        //   'farmName',
        //   'vendorName',
        //   'invoice.description',
        //   'invoice.company',
        //   'invoice.amount',
        // ],
      }
    );
  }

  public printTable() {
    this.gridApi.setDomLayout('print');

    const api = this.gridApi;
    this.setPrinterFriendly(api);
    setTimeout(function () {
      print();
      this.setNormal(api);
    }, 2000);

    // when print closes, set domLayout to null
  }

  public setPrinterFriendly(api) {
    const eGridDiv = document.querySelector('#agGrid');
    // eGridDiv.style.height = '';
    api.pagination = false;
    api.setDomLayout('print');
  }
  public setNormal(api) {
    const eGridDiv = document.querySelector('#agGrid');
    api.pagination = true;
    // eGridDiv.style.width = '700px';
    // eGridDiv.style.height = '200px';
    api.setDomLayout(null);
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
