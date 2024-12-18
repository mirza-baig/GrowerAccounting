import { IGrowerAccount } from 'src/app/models/grower-account.interface';
import { AgGridAngular } from '@ag-grid-community/angular';
import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IGrowerMaster } from 'src/app/models/grower-master.interface';
import { AllModules, GridApi, ColumnApi } from '@ag-grid-enterprise/all-modules';
import { IAccountType } from 'src/app/models/account-type.interface';
import { AccountMaintenanceService } from 'src/app/account-maintenance/account-maintenance.service';
import { EditGrowerMasterService } from 'src/app/account-maintenance/edit-grower-master/edit-grower-master.service';
import { DropdownService } from '../dropdown.service';
import { AccountSelectActionComponent } from './account-select-action/account-select-action.component';
import {currencyFormatter} from '../grid-formatters/currency-formatter';

@Component({
  selector: 'app-account-search',
  templateUrl: './account-search.component.html',
  styleUrls: ['./account-search.component.css']
})
export class AccountSearchComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  innerWidth: any;
  innerHeight: any;

  // inputs and outputs
  @Input() id: number;

  @Output() growerSelectedEvent = new EventEmitter<IGrowerAccount>();

  private gridApi: GridApi;
  private gridColumnApi: ColumnApi;

  accounts: IGrowerAccount[] = [];
  currentlySelectedAccount: IGrowerAccount;

  accountTypes: IAccountType[] = [];
  loadingAccount: boolean = true;
  accountSelected: boolean = false;

  columnDefs = [


    {
      headerName: 'Account Type',
      // valueFormatter: this.accountTypeFormatter,
      field: 'accountType',
      width: 300,
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Suffix',
      field: 'accountSuffix',
      width: 100,
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Balance Fwd',
      valueFormatter: currencyFormatter,
      field: 'balanceForward',
      width: 300,
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        debounceMs: 0,
      }
    },
    {
      headerName: 'Amount Due',
      valueFormatter: currencyFormatter,
      field: 'amountDue',
      width: 300,
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        debounceMs: 0,
      }
    },
    {
      headerName: 'Select',
      cellRenderer: 'actionsTransactionRenderer',
      field: 'id',
      width: 200,
      sortable: false,
      filter: false
    }
  ];

  modules = AllModules;


  frameworkComponents = {
    actionsTransactionRenderer: AccountSelectActionComponent
  };


  constructor(
    private _accountService: AccountMaintenanceService,
    private _editGrowerService: EditGrowerMasterService,
    private _utilityService: DropdownService,
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

    this.loadAccountTypes();

  }

  private loadAccounts(id: number) {
    this._accountService
    .getGrowerAccounts(id)
    .subscribe(
      data => {
        try {
          // todo - save accounts
          this.accounts = data
          .map(a => {
            switch (a.accountType) {
              case '1':
                a.accountType = 'Regular';
                break;
              case '2':
                a.accountType = 'Construction';
                break;
              case '3':
                a.accountType = 'Special';
                break;
              case '4':
                a.accountType = 'Unique';
                break;
              case '5':
                a.accountType = 'Miscellaneous';
                break;
            }
            return a;
          })
          .sort(function(a, b) {
            return a.accountType.localeCompare(b.accountType) || a.accountSuffix.localeCompare(b.accountSuffix);
          });



          // // compute a few fields
          // if (data.length > 0) {
          //   this.totalYTDInterestPaid = data.map(a => a.ytdinterestPaid).reduce((a, b) => a + b);
          //   this.totalYTDInterestCharged = data.map(a => a.ytdinterestCharged).reduce((a, b) => a + b);
          //   this.totalARBalance = data.map(a => a.amountDue).reduce((a, b) => a + b);
          // }

          this.loadingAccount = false;

        } catch (e) {
          console.error(e);
        }
      },
      error => {

        console.error(error);

      }
    );
  }

  private loadAccountTypes() {
    this._utilityService
    .getAccountTypes()
    .subscribe(
      data => {
        try {
          this.accountTypes = data;
          this.loadAccounts(this.id);
        } catch (e) {
          console.error(e);
        }
      },
      error => {

        console.error(error);
      }
    );
  }

  onSelectionChanged() {
    // confirmChoice
    const selectedRows = this.gridApi.getSelectedRows();
    this.currentlySelectedAccount = selectedRows[0];
    this.accountSelected = true;
    // since we're circumventing the confirm button and using selection list buttons, go to confirm
    this.growerSelectedEvent.emit(this.currentlySelectedAccount);
  }

  resetChoice() {
    this.accountSelected = false;
    this.currentlySelectedAccount = null;
    this.growerSelectedEvent.emit(null);
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

     this.gridApi.sizeColumnsToFit();
   }

   private getAccountTypeInt(id: number): string {
     switch (id) {
       case 1:
         return 'Regular';
       case 2:
         return 'Construction';
       case 3:
         return 'Special';
       case 4:
         return 'Unique';
       case 5:
         return 'Miscellaneous';
     }
   }

  /** get the account type string for cell format */
  public accountTypeFormatter(params: any) {
    // ! how do we handle this with it being delayed data?
    switch (params.value.toString()) {
      case '1':
        return 'Regular';
      case '2':
        return 'Construction';
      case '3':
        return 'Special';
      case '4':
        return 'Unique';
      case '5':
        return 'Miscellaneous';
    }
    return 'Invalid';
  }


}
