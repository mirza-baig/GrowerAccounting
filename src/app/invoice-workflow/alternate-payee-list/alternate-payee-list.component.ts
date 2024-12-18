import { AlternatePayeeListService } from './alternate-payee-list.service';
import { AllModules, ColDef, Column, ColumnApi, GridApi } from '@ag-grid-enterprise/all-modules';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/shared/toast.service';
import { AlternatePayeeItemActionsComponent } from './alternate-payee-item-actions/alternate-payee-item-actions.component';
import { IVwApvendorMaster } from 'src/app/models/vw-apvendor-master.interface';
import { IApInvoiceAlternatePayeeVM } from 'src/app/models/ap-invoice-alternate-payee-vm.interface';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import {currencyFormatter} from '../../shared/grid-formatters/currency-formatter';
import {dateFormatter} from '../../shared/grid-formatters/date-formatter';

@Component({
  selector: 'app-alternate-payee-list',
  templateUrl: './alternate-payee-list.component.html',
  styleUrls: ['./alternate-payee-list.component.css']
})
export class AlternatePayeeListComponent implements OnInit {
  pageTitle = 'Invoices with Alternate Check Recipients';
  moduleTitle = 'Invoice';
  innerWidth: number;
  innerHeight: number;
  printReady: boolean = false;
  printname: string;

  // grid stuff
  modules = AllModules;
  public frameworkComponents = {
    actionsRenderer: AlternatePayeeItemActionsComponent,
    // invoiceRenderer: ShowInvoiceTotalComponentComponent,
    // fileRenderer: InvoiceFileRendererComponent,
  };
  public gridApi: GridApi;
  public gridColumnApi: ColumnApi;
  public invoicesLoaded: boolean = false;
  public invoices: IApInvoiceAlternatePayeeVM[] = [];
  columnDefs: ColDef[] = [

    // {
    //   headerName: 'Farm',
    //   field: 'farmName',
    //   width: 500,
    //   sortable: true,
    //   cellRenderer: 'growerRenderer',
    //   filter: 'agTextColumnFilter',
    //   filterParams: {
    //     debounceMs: 0,
    //     caseSensitive: false,
    //   }
    // },
    {
      headerName: 'Vendor',
      field: 'vendorName',
      width: 300,
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      }
    },
    {
      headerName: 'Invoice #',
      field: 'invoice.invoiceNumber',
      width: 200,
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      }
    },
    {
      headerName: 'Voucher #',
      field: 'invoice.apvoucherId',
      width: 300,
      sortable: true,
      hide: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      }
    },
    {
      headerName: 'Description',
      field: 'invoice.description',
      width: 300,
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      }
    },
    {
      headerName: 'Send Check To',
      field: 'invoice.payTo',
      width: 180,
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      }
    },
    {
      headerName: 'Amount',
      field: 'invoice.amount',
      width: 200,
      valueFormatter: params => currencyFormatter(params, ''),
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        debounceMs: 0,
      }
    },
    {
      headerName: 'Posted Date',
      valueFormatter: dateFormatter,
      field: 'datePosted',
      width: 150,
      sortable: true,
      filter: true
    },


    {
      headerName: 'Actions',
      cellRenderer: 'actionsRenderer',
      field: 'id',
      width: 350,
      sortable: false,
      filter: false
    },


  ];

  // dropdowns
  vendorList: IVwApvendorMaster[] = [];

  constructor(
    private _toastService: ToastService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _paymentService: AlternatePayeeListService,
    private _http: HttpClient,
  ) { }

  ngOnInit() {
    // set dimensions
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

    this.loadVendorList();
  }

  private loadInvoices() {
    this._paymentService.getAlternatePayees().subscribe(result => {
      this.invoices = result.map(i => {
        const vendor = this.vendorList.find(v => v.vnumb.toString() === i.invoice.vendorId.toString());
        i.vendorName = !!!vendor ? '' : vendor.vnumb + ' - ' + vendor.vname;
        return i;
      });
      this.invoicesLoaded = true;
    }, error => {
      console.error(error);
      this._toastService.errorToast(error);
    });
  }

  /***************************************************
   * Dropdowns
   **************************************************/

  // load the vendor list from storage
  private loadVendorList() {
    if (this.vendorList.length === 0) {
      this.vendorList = JSON.parse(localStorage.getItem('APVendorList')) as IVwApvendorMaster[];
    }

    this.loadInvoices();
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
      this.printname = 'Invoices with Checks to Pay for ' + moment(new Date()).format('MM/DD/YYYY');
      popupWin.document.write(`
        <html>
          <head>
            <title>${this.printname}</title>
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

  /** export the grid to excel */
  public exportData() {
    this.gridApi.exportDataAsExcel(
      {
        fileName: 'Invoices with Checks to Pay for ' + moment(new Date()).format('MM/DD/YYYY'),
        columnKeys: [
          'vendorName',
          'invoice.invoiceNumber',
          'invoice.apvoucherId',
          'invoice.payTo',
          'invoice.description',
          'invoice.amount',
          'invoice.datePosted',
        ],
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
     const sort = [
       {
         colId: 'vendorName',
         sort: 'asc'
       }
     ];
     this.gridApi.setSortModel(sort);

   }


}
