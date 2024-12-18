import { Component, OnInit, HostListener } from '@angular/core';
import { ISettlementBatch } from 'src/app/models/settlement-batch.interface';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { SettlementBatchListService } from './settlement-batch-list.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { SettlementBatchActionsComponent } from './settlement-batch-actions/settlement-batch-actions.component';
import * as moment from 'moment';
import { UtilityService } from 'src/app/shared/utility.service';
import {currencyFormatter} from '../../shared/grid-formatters/currency-formatter';
import {dateFormatter} from '../../shared/grid-formatters/date-formatter';

@Component({
  selector: 'app-settlement-batch-list',
  templateUrl: './settlement-batch-list.component.html',
  styleUrls: ['./settlement-batch-list.component.css']
})
export class SettlementBatchListComponent implements OnInit {
  pageTitle = 'Settlement Batch List';
  moduleTitle = 'Settlements';
  innerWidth: any;
  innerHeight: any;
  lockSettlements: boolean = true;
  lockTransactions: boolean = true;


  // the list
  settlementBatches: ISettlementBatch[] = [];
  settlementBatchesLoaded: boolean = false;
  modules = AllModules;
  columnDefs = [
    {
      headerName: 'Batch Id',
      field: 'id',
      width: 100,
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        filterOptions: ['startsWith', 'contains'],
        debounceMs: 0,
        caseSensitive: false,
      }
    },
    {
      headerName: 'Type',
      field: 'type',
      width: 150, // todo - don't we need a settlement type?
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      }
    },
    {
      headerName: 'Name',
      field: 'description',
      width: 150, // todo - don't we need a settlement type?
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      }
    },
    {
      headerName: 'Date',
      field: 'createdDate',
      valueFormatter: dateFormatter,
      width: 100,
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      }
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 100,
      sortable: true,
      valueFormatter: function (params) {
        return params.value.toString() === 'InProcess' ? 'In Process' : params.value;
      },
      filter: true,
      // filter: 'agTextColumnFilter',
    }, {
      headerName: 'Gross Amount',
      field: 'grossTotal',
      valueFormatter: params => currencyFormatter(params, '$0'),
      width: 120,
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        debounceMs: 0,
      }
    },
    {
      headerName: 'Net Amount',
      field: 'total',
      valueFormatter: params => currencyFormatter(params, '$0'),
      width: 120,
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        debounceMs: 0,
      }
    },
    {
      headerName: 'Actions',
      field: 'id',
      cellRenderer: 'actionsRenderer',
      width: 300,
    }
  ];
  public gridApi;
  public gridColumnApi;
  public frameworkComponents = {
    actionsRenderer: SettlementBatchActionsComponent
  };
  constructor(
    private messageService: MessageService,
    private _batchService: SettlementBatchListService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
  ) { }

  ngOnInit() {
    // set the dimensions
    this.innerHeight = window.innerHeight;
    this.innerWidth = window.innerWidth;

    // check lock status
    this.getLockStatus();

    // load the batches
    this.loadBatches();
  }

  /** Check to see if the site needs to be locked down */
  public getLockStatus() {
    // open settlements
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

    // open transaction batches
    this._utilityService
      .isTransactionInProcess()
      .subscribe(
        data => {
          try {
            this.lockTransactions = data;
          } catch (e) {
            console.error(e);
          }
        },
        error => {
          console.error(error);
        }
      );
  }

  /** pull down the batch list from the server */
  public loadBatches() {
    this._batchService
      .getSettlementsBatchList()
      .subscribe(
        data => {
          try {
            this.settlementBatches = data.filter(s => s.status.trim() !== 'Deleted');
            this.settlementBatchesLoaded = true;
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
  }

  /** null safe toLower */
  private toLowerNullable(value: string) {
    return value != null ? value.toLowerCase() : '';
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // resize the cols
    this.gridApi.sizeColumnsToFit();

  }

  /** change the status filter for the grid */
  public onStatusFilterChange(event: any) {
    const filterInstance = this.gridApi.getFilterInstance('status');
    filterInstance.selectNothing();

    const status = event.value.toString();


    if (status === 'All') {
      filterInstance.selectEverything();

    } else {
      filterInstance.selectValue(status);
    }


    filterInstance.applyModel();
    this.gridApi.onFilterChanged();
  }


}
