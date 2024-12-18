import { Component, OnInit, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { GrowerTransactionsService } from './grower-transactions.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { fade, slide } from 'src/fieldale-animations';
import { AgGridAngular } from '@ag-grid-community/angular';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { GrowerTransactionsEditButtonComponent } from './grower-transactions-edit-button/grower-transactions-edit-button.component';
import { IBatchVM } from '../models/batch-vm.interface';
import { IGrowerTransactionBatch } from '../models/grower-transaction-batch.interface';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ICurrentUser } from '../user-management/current-user.interface';
import {dateFormatter} from '../shared/grid-formatters/date-formatter';
import {currencyFormatter} from '../shared/grid-formatters/currency-formatter';

@Component({
  selector: 'app-grower-transactions',
  templateUrl: './grower-transactions.component.html',
  styleUrls: ['./grower-transactions.component.css'],
  animations: [fade, slide]
})
export class GrowerTransactionsComponent implements OnInit, OnDestroy {
  @ViewChild('agGrid') agGrid: AgGridAngular;

  pageTitle = 'Grower Batch List';
  moduleTitle = 'Transactions';
  showAllBatches: boolean = false;
  // grid vars
  columnDefs = [


    {
      headerName: 'Batch',
      field: 'Id',
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
      headerName: 'Description',
      field: 'Description',
      width: 150,
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      }
    },
    {
      headerName: 'Status',
      field: 'Status',
      width: 120,
      sortable: true,
      filter: true,
      hide: true,
    },
    {
      headerName: 'Created By',
      field: 'CreatedBy',
      width: 120,
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      }
    },
    {
      headerName: 'Date Opened',
      valueFormatter: dateFormatter,
      field: 'CreatedDate',
      width: 120,
      sortable: true,
      filter: true
    },
    {
      headerName: 'Posted By',
      field: 'PostedBy',
      width: 120,
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      }
    },
    {
      headerName: 'Posted Date',
      valueFormatter: dateFormatter,
      field: 'PostedDate',
      width: 120,
      sortable: true,
      filter: true
    },
    {
      headerName: 'Total',
      valueFormatter: currencyFormatter,
      field: 'Total',
      width: 120,
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        debounceMs: 0,
      }
    },
    {
      headerName: 'Edit',
      cellRenderer: 'editTransactionRenderer',
      field: 'Id',
      width: 300,
      sortable: false,
      filter: false
    }
  ];

  modules = AllModules;

  innerWidth: number;
  innerHeight: number;
  public frameworkComponents = {
    editTransactionRenderer: GrowerTransactionsEditButtonComponent
  };

  batches: IBatchVM[] = [];
  batchTransactions: IGrowerTransactionBatch[] = [];
  batchesLoading = true;
  batchForm: FormGroup;
  batchFormLoaded: boolean = false;
  newBatchModal: boolean = false;
  public gridColumnApi;
  public gridApi;


  batchIds: number[] = [];

  constructor(
    private messageService: MessageService,
    private _transactionService: GrowerTransactionsService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;



    this.buildBatchForm();

    this.loadBatches();
  }

  ngOnDestroy() {
  }

  private buildBatchForm() {
    this.batchForm = this._formBuilder.group({
      Description: new FormControl({
        value: '',
      }, [ Validators.required])}
    );
    this.batchForm.patchValue({ Description: '' });
    this.batchFormLoaded = true;
  }

  private loadBatches() {

    this._transactionService
    .getGrowerTransactionsBatches()
    .subscribe(
      data => {
        try {
          // first save the full list
          this.batchTransactions = data.map(b => {
            b.status = b.status.trim();
            return b;
          });
          this.batches = this.batchTransactions.map(bt => {
            const batch = {
              Id: bt.id,
              BatchId: bt.id,
              Batch: bt.id,
              CreatedBy: bt.createdBy,
              CreatedDate: bt.createdDate,
              Total: 0,
              Description: bt.description,
              Status: bt.status,
              PostedBy: bt.postedBy,
              PostedDate: bt.postedDate,
            } as IBatchVM;

            this._transactionService
            .getGrowerTransactionsByBatchId(bt.id)
            .subscribe(
              transactions => {
                // ! wtf is one of them null
                transactions = transactions.filter(t => !!t);
                 try {

                  // sum the total
                  if (transactions.length > 0) {
                    batch.Total = transactions
                    .map(t => t.transactionAmount)
                    .reduce((a, b) => {
                      return a + b;
                    });
                  }

                  const templist = [];
                  templist.push(batch);

                  // // this.relatedGrowerGridApi.redrawRows();
                  // // ! - unfortunately this seems to be the only way to get it to work right
                  this.gridApi.updateRowData({ update: templist});
                } catch (e) {
                  console.error(e);
                }
              },
              error => {
                console.error(error);
                this.errorToast(error);
              }
            );

            return batch;
          });


          setTimeout(() => {
            const filterInstance = this.gridApi.getFilterInstance('Status');
            filterInstance.selectNothing();
            if (this.batches.filter(b => b.Status === 'New').length > 0)  {

              filterInstance.selectValue('New');
            }

            if (this.batches.filter(b => b.Status === 'Error').length > 0)  {
              filterInstance.selectValue('Error');
            }

            filterInstance.applyModel();
            this.gridApi.sizeColumnsToFit();
            this.gridApi.onFilterChanged();
          }, 10);

          setTimeout(() => {
            this.batchesLoading = false;
          }, 10);
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

  /** create a new transaction batch */
  public addNewTransactionBatch() {
    // const max = Math.max(...this.batchIds);

    // get the user
    const user = JSON.parse(localStorage.getItem('ActiveDirectoryUser')) as ICurrentUser;

    const newBatch = {
      id: 0,
      createdBy: user.username, // todo - pull in current username
      createdDate: new Date(),
      status: 'New',
      description: this.batchForm.value.Description,
    } as IGrowerTransactionBatch;


    this._transactionService.postTransactionBatch(newBatch).subscribe(
      result => {

        // New transaction batch #16 added.
        const batchId = result.data.split(' ')[3].substring(1);

        this.newBatchModal = false;
        this.successToast('You have successfully created a new batch!');
        // data.data
        setTimeout(() => {
          this._router.navigateByUrl(
            'ViewBatchComponent?Id=' + batchId
          );
        }, 1000);
      },
      error => {
        console.error(error);
        this.errorToast(error);
      }
    );
  }

  public showHideBatches() {
    this.showAllBatches = !this.showAllBatches;

    const filterInstance = this.gridApi.getFilterInstance('Status');
    filterInstance.selectNothing();

    if (this.showAllBatches) {
      filterInstance.selectEverything();

    } else {
      if (this.batches.filter(b => b.Status === 'New').length > 0)  {
        filterInstance.selectValue('New');
      }

      if (this.batches.filter(b => b.Status === 'Error').length > 0)  {
        filterInstance.selectValue('Error');
      }
    }

    filterInstance.applyModel();
    this.gridApi.onFilterChanged();

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
    this.innerHeight = window.innerHeight;
  }

  onColumnResized() {
    this.gridApi.resetRowHeights();
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.gridApi.sizeColumnsToFit();

    // filter out posted by default
    const filterInstance = this.gridApi.getFilterInstance('Status');
    filterInstance.selectNothing();
    filterInstance.applyModel();
    this.gridApi.onFilterChanged();


    const sort = [
      {
        colId: 'Id',
        sort: 'desc'
      }
    ];

    // todo - should we pre filter status?
    this.gridApi.setSortModel(sort);
  }




}
