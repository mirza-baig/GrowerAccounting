import { GridApi, ColumnApi, AllModules } from '@ag-grid-enterprise/all-modules';
import { IAPComparisonVM } from './../../models/ap-comparison-vm.interface';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/shared/toast.service';
import { APBalanceCompareService } from './apbalance-compare.service';
import { AgGridColumn } from '@ag-grid-community/angular';

@Component({
  selector: 'app-apbalance-compare',
  templateUrl: './apbalance-compare.component.html',
  styleUrls: ['./apbalance-compare.component.css']
})
export class APBalanceCompareComponent implements OnInit {

  pageTitle = 'AP Comparisons';
  moduleTitle = 'Invoice';
  innerWidth: number;
  innerHeight: number;

  dataLoaded: boolean = false;
  lockReset: boolean = false;
  data: IAPComparisonVM;

  // some grid stuff
  distColumnDefs = [
    {
      headerName: 'Active',
      field: 'dactiv',
    },
    {
      headerName: 'Vendor #',
      field: 'dvend',
    },
    {
      headerName: 'Voucher #',
      field: 'dvouch',
    },
    {
      headerName: 'GL Account',
      field: 'dglact',
    },
    {
      headerName: 'Distribution Amount',
      field: 'damt',
    },
    {
      headerName: 'Distribution Volume',
      field: 'dvol',
    },
    {
      headerName: 'Hold Code',
      field: 'dhold',
    },
    {
      headerName: 'Utility Code 1',
      field: 'ducd1',
    },
    {
      headerName: 'Utility Code 2',
      field: 'ducd2',
    },
    {
      headerName: 'Utility Code 3',
      field: 'ducd3',
    },
    {
      headerName: 'Utility Code 4',
      field: 'ducd4',
    },
    {
      headerName: 'Utility Code 5',
      field: 'ducd5',
    },
    {
      headerName: 'Utility Amount 1',
      field: 'duam1',
    },
    {
      headerName: 'Utility Amount 2',
      field: 'duam2',
    },
    {
      headerName: 'Utility Amount 3',
      field: 'duam3',
    },
    {
      headerName: 'Utility Amount 4',
      field: 'duam4',
    },
    {
      headerName: 'Utility Amount 5',
      field: 'duam5',
    },

  ];
  openColumnDefs = [
    {
      headerName: 'Active',
      field: 'iactiv',
    },
    {
      headerName: 'Company',
      field: 'icmpny',
    },
    {
      headerName: 'Vendor',
      field: 'ivend',
    },
    {
      headerName: 'Voucher #',
      field: 'ivouch',
    },
    {
      headerName: 'P.O. #',
      field: 'iponum',
    },
    {
      headerName: 'date to pay - julian',
      field: 'ijdate',
    },
    {
      headerName: 'Manual/Void Check',
      field: 'imanvd',
    },
    {
      headerName: 'check number - if m/v',
      field: 'imvchk',
    },
    {
      headerName: 'check date jul-if m/v',
      field: 'ijmvdt',
    },
    {
      headerName: 'print seperate check seq.',
      field: 'isepck',
    },
    {
      headerName: 'capital job number',
      field: 'ijobno',
    },
    {
      headerName: 'capital job locator',
      field: 'iloctr',
    },
    {
      headerName: 'capital job classification  ',
      field: 'iclass',
    },
    {
      headerName: 'utility account',
      field: 'iutact',
    },
    {
      headerName: 'amt. qualified for discount ',
      field: 'idsqal',
    },
    {
      headerName: 'taxable amount ',
      field: 'itaxbl',
    },
    {
      headerName: 'tax-exempt amount',
      field: 'iexmpt',
    },
    {
      headerName: 'invoice amount',
      field: 'iinvam',
    },
    {
      headerName: 'check amount',
      field: 'ickamt',
    },
    {
      headerName: 'vendor invoice reference',
      field: 'ivref',
    },
    {
      headerName: 'taxing county',
      field: 'icnty',
    },
    {
      headerName: 'taxing state',
      field: 'istate',
    },
    {
      headerName: 'taxes array',
      field: 'itaxes',
    },
    {
      headerName: 'calculated discount amount',
      field: 'idsamt',
    },
    {
      headerName: 'hold code',
      field: 'ihold',
    },
    {
      headerName: 'printed',
      field: 'iprntd',
    },
    {
      headerName: 'volume',
      field: 'ivol',
    },
    {
      headerName: 'Utility Code 1',
      field: 'iucd1',
    },
    {
      headerName: 'Utility Code 2',
      field: 'iucd2',
    },
    {
      headerName: 'Utility Code 3',
      field: 'iucd3',
    },
    {
      headerName: 'Utility Code 4',
      field: 'iucd4',
    },
    {
      headerName: 'Utility Code 5',
      field: 'iucd5',
    },
    {
      headerName: 'Utility Amount 1',
      field: 'iuam1',
    },
    {
      headerName: 'Utility Amount 2',
      field: 'iuam2',
    },
    {
      headerName: 'Utility Amount 3',
      field: 'iuam3',
    },
    {
      headerName: 'Utility Amount 4',
      field: 'iuam4',
    },
    {
      headerName: 'Utility Amount 5',
      field: 'iuam5',
    },
    {
      headerName: 'repairs taxable % ',
      field: 'iprcnt',
    },
    {
      headerName: 'voucher desc',
      field: 'ivdsc',
    },
  ];
  modules = AllModules;
  public testDistGridApi: GridApi;
  public liveDistGridApi: GridApi;
  public testOpenGridApi: GridApi;
  public liveOpenGridApi: GridApi;

  public testDistGridColumnApi: ColumnApi;
  public liveDistGridColumnApi: ColumnApi;
  public testOpenGridColumnApi: ColumnApi;
  public liveOpenGridColumnApi: ColumnApi;

  constructor(
    private _apService: APBalanceCompareService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _messageService: ToastService,
  ) { }

  ngOnInit() {

    // set dimensions
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

    this.loadData();
  }

  private loadData() {
    this._apService.getApInvoiceComparisons().subscribe(result => {
      this.data = result;
      this.dataLoaded = true;
    }, error => {
      this._messageService.errorToast(JSON.stringify(error));
      console.error(error);
    });
  }

  private resetData() {
    this.lockReset = true;
    this._apService.resetTestAPFiles().subscribe(result => {
      this._messageService.successToast('You have successfully reset the AP test files. The page will now reload');
      this.dataLoaded = false;
      this.loadData();
    }, error => {
      this._messageService.errorToast(JSON.stringify(error));
      console.error(error);
    });
  }

  public onTestDistGridReady(params) {
    this.testDistGridApi = params.api;
    this.testDistGridColumnApi = params.columnApi;
  }

  public onLiveDistGridReady(params) {
    this.liveDistGridApi = params.api;
    this.liveDistGridColumnApi = params.columnApi;
  }

  public onTestOpenGridReady(params) {
    this.testOpenGridApi = params.api;
    this.testOpenGridColumnApi = params.columnApi;
  }

  public onLiveOpenGridReady(params) {
    this.liveOpenGridApi = params.api;
    this.liveOpenGridColumnApi = params.columnApi;
  }

  public exportData() {

    this.liveDistGridApi.exportDataAsExcel(
      {
        fileName: 'AS400 Live AP Distributions',
        columnKeys: this.distColumnDefs.map(d => d.field),
      }
    );
    this.testDistGridApi.exportDataAsExcel(
      {
        fileName: 'AS400 Test AP Distributions',
        columnKeys: this.distColumnDefs.map(d => d.field),
      }
    );

    this.liveOpenGridApi.exportDataAsExcel(
      {
        fileName: 'AS400 Live AP Invoice Open File',
        columnKeys: this.openColumnDefs.map(d => d.field),
      }
    );
    this.testOpenGridApi.exportDataAsExcel(
      {
        fileName: 'AS400 Test AP Invoice Open File',
        columnKeys: this.openColumnDefs.map(d => d.field),
      }
    );

    // tslint:disable-next-line:max-line-length
    this._messageService.successToast('You have successfully generated 4 excel spreadsheets containing the test and live file data for AP. Please check your file downloads folder');
  }
}
