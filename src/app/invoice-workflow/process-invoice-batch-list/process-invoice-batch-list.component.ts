import { Component, OnInit, HostListener } from '@angular/core';
import { fade, slide } from 'src/fieldale-animations';
import { ProcessInvoiceBatchListActionsComponent } from './process-invoice-batch-list-actions/process-invoice-batch-list-actions.component';
import { IApinvoicePaymentRequestBatch } from 'src/app/models/ap-invoice-payment-request-batch.interface';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { ToastService } from 'src/app/shared/toast.service';
import { InvoiceBatchListService } from '../invoice-batch-list/invoice-batch-list.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { StatusRendererComponent } from '../status-renderer/status-renderer.component';
import {dateFormatter} from '../../shared/grid-formatters/date-formatter';

@Component({
  selector: 'app-process-invoice-batch-list',
  templateUrl: './process-invoice-batch-list.component.html',
  styleUrls: ['./process-invoice-batch-list.component.css'],
  animations: [fade, slide]
})
export class ProcessInvoiceBatchListComponent implements OnInit {
  pageTitle = 'Process Invoice Batch List';
  moduleTitle = 'Invoice';
  innerWidth: number;
  innerHeight: number;

  // batch list fields
  batchesLoaded: boolean = false;
  batches: IApinvoicePaymentRequestBatch[] = [];
  columnDefs = [
    {
      headerName: 'Batch',
      field: 'id',
      width: 150,
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        debounceMs: 0,
      }
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
    {
      headerName: 'Last Reviewer',
      field: 'lastReviewedBy',
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
      headerName: 'Posted Date',
      field: 'postedDate',
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
      headerName: 'Status',
      field: 'stage',
      width: 200,
      sortable: true,
      filter: true,
      filterParams: {
        debounceMs: 0,
      },
      cellRenderer: 'statusRenderer',
    },

    {
      headerName: 'Actions',
      cellRenderer: 'actionsRenderer',
      field: 'id',
      width: 200,
      sortable: false,
      filter: false
    }
  ];
  modules = AllModules;
  public frameworkComponents = {
    actionsRenderer: ProcessInvoiceBatchListActionsComponent,
    statusRenderer: StatusRendererComponent,
  };
  public gridApi;
  public gridColumnApi;

  constructor(
    private messageService: ToastService,
    private _invoiceService: InvoiceBatchListService,
    private _router: Router,
  ) { }

  ngOnInit() {
    // set dimensions
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;




    // load the invoice batches
    this.loadInvoiceBatches();


  }

  private loadInvoiceBatches() {
    this._invoiceService.getInvoiceBatches().subscribe(result => {
      this.batches = result.filter(b => b.stage === 'Exported' || b.stage === 'Invoice Processing');
      this.batchesLoaded = true;
    }, error => {
      console.error(error);
      this.messageService.errorToast(error);
    });
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
        colId: 'id',
        sort: 'desc'
      }
    ];

    // todo - should we pre filter status?
    this.gridApi.setSortModel(sort);
  }
}
