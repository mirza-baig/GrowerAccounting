import { Component, OnInit, HostListener } from '@angular/core';
import { fade, slide } from 'src/fieldale-animations';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { MessageService } from 'primeng/api';
import { InvoiceBatchListService } from './invoice-batch-list.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { IApInvoiceBatch } from 'src/app/models/ap-invoice-batch.interface';
import { ToastService } from 'src/app/shared/toast.service';
import { InvoiceBatchListActionsComponent } from './invoice-batch-list-actions/invoice-batch-list-actions.component';
import { IApinvoicePaymentRequestBatch } from 'src/app/models/ap-invoice-payment-request-batch.interface';
import * as moment from 'moment';
import { ICurrentUser } from 'src/app/user-management/current-user.interface';
import { Router } from '@angular/router';
import { StatusRendererComponent } from '../status-renderer/status-renderer.component';
import {dateFormatter} from '../../shared/grid-formatters/date-formatter';

@Component({
  selector: 'app-invoice-batch-list',
  templateUrl: './invoice-batch-list.component.html',
  styleUrls: ['./invoice-batch-list.component.css'],
  animations: [fade, slide]
})
export class InvoiceBatchListComponent implements OnInit {
  pageTitle = 'Invoice Payment Request Batch List';
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
    actionsRenderer: InvoiceBatchListActionsComponent,
    statusRenderer: StatusRendererComponent,
  };
  public gridApi;
  public gridColumnApi;

  // new batch
  newBatchModal: boolean = false;
  newBatchForm: FormGroup;
  newBatchFormLoaded: boolean = false;

  constructor(
    private messageService: ToastService,
    private _invoiceService: InvoiceBatchListService,
    private _formBuilder: FormBuilder,
    private _router: Router,
  ) { }

  ngOnInit() {
    // set dimensions
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;



    // build the batch form
    this.buildBatchForm();

    // load the invoice batches
    this.loadInvoiceBatches();


  }


  /** build a form for creating a new batch */
  private buildBatchForm() {
    this.newBatchForm = this._formBuilder.group({
      Description: new FormControl({
        value: '',
      }, [ Validators.required])}
    );
    this.newBatchForm.patchValue({ Description: new Date().toDateString() + ' invoices' });
    this.newBatchFormLoaded = true;
  }

  private loadInvoiceBatches() {
    this._invoiceService.getInvoiceBatches().subscribe(result => {
      this.batches = result.filter(b => b.stage !== 'Settlement Export');
      this.batchesLoaded = true;
    }, error => {
      console.error(error);
      this.messageService.errorToast(error);
    });
  }

  public addNewBatch() {
    this.newBatchModal = false;
    const vals = this.newBatchForm.value;

    // get the user
    const user = JSON.parse(localStorage.getItem('ActiveDirectoryUser')) as ICurrentUser;

    const batch = {
      id: 0,
      description: vals.Description,
      createdDate: new Date(),
      createdBy: user.username,
      postedDate: null,
      postedBy: null,
      lastReviewedBy: null,
      lastReviewDate: null,
      status: 'New',
      stage: 'New',
      approverId: null,
      batchCreatorEmail: user.email,
    } as IApinvoicePaymentRequestBatch;
    // create our new batch
    this._invoiceService.postInvoiceBatch(batch).subscribe(
      result => {
        if (result.statusCode === 200) {
          // apiResponse.data = "Payment request batch #" + paymnetRequestBatch.Id + " updated.";
          this.messageService.successToast('You have successfully created a new invoice batch!');
          const batchId = result.data.split(' ')[3].substring(1);
          setTimeout(() => {
            this._router.navigateByUrl(
              'ViewInvoiceBatchComponent?Id=' + batchId
            );
          }, 1000);
        }
      }, error => {
        console.error(error);
        this.messageService.errorToast(error);
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
        colId: 'id',
        sort: 'desc'
      }
    ];

    // todo - should we pre filter status?
    this.gridApi.setSortModel(sort);
  }

}
