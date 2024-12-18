import { AgGridAngular } from '@ag-grid-community/angular';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IGrower1099VM } from '../models/grower-1099-batch.interface';
import { IGrower1099Item } from '../models/grower-1099-item.interface';
import { ToastService } from '../shared/toast.service';
import { Grower1099ManagementService } from './grower1099-management.service';
import {currencyFormatter} from '../shared/grid-formatters/currency-formatter';

@Component({
  selector: 'app-grower1099-management',
  templateUrl: './grower1099-management.component.html',
  styleUrls: ['./grower1099-management.component.css']
})
export class Grower1099ManagementComponent implements OnInit {

  @ViewChild('agGrid') agGrid: AgGridAngular;
  pageTitle = 'Grower 1099s';
  moduleTitle = 'Account Maintenance';
  innerWidth: any;
  innerHeight: any;

  public gridColumnApi;
  public gridApi;
  modules = AllModules;

  // data
  growerItems: IGrower1099Item[] = [];
  fullModel: IGrower1099VM;
  resultsLoaded: boolean = false;

  // add column defs
  columnDefs = [
    {
      headerName: 'Grower #',
      field: 'growerId',
      width: 150,
      sortable: true,
      filter: true,
      filterParams: {
        debounceMs: 0,
      }
    },
    {
      headerName: 'Name',
      field: 'growerName',
      width: 150,
      sortable: true,
      filter: true,
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      },
    },
    {
      headerName: 'Settlement Total',
      valueFormatter: currencyFormatter,
      field: 'settlementAmount',
      width: 200,
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        debounceMs: 0,
      }
    },
    {
      headerName: 'Transaction Total',
      valueFormatter: currencyFormatter,
      field: 'payAdjustmentAmount',
      width: 200,
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        debounceMs: 0,
      }
    },
    {
      headerName: 'Bonus Total',
      valueFormatter: currencyFormatter,
      field: 'bonusAmount',
      width: 200,
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        debounceMs: 0,
      }
    },
    {
      headerName: 'Total',
      valueFormatter: currencyFormatter,
      field: 'totalAmount',
      width: 200,
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        debounceMs: 0,
      },
      cellStyle: function(params) {
        return  {
          'font-weight': 'bold',
        };

      }
    },
  ];

  constructor(
    private _growerService: Grower1099ManagementService,
    private _toastService: ToastService,
    private _route: ActivatedRoute,
    private _router: Router,
  ) { }

  ngOnInit() {
    // set width
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

    this.load1099(new Date().getFullYear());
  }

  /** loads the 1099 data for all growers for a given year */
  private load1099(year: number) {
    this._growerService.getGrower1099ForYear(year).subscribe(
      result => {
        this.fullModel = result;
        this.growerItems = result.growerItems.map(g => {
          g.totalAmount = g.bonusAmount + g.payAdjustmentAmount + g.settlementAmount;
          return g;
        });
        this.resultsLoaded = true;
      }, error => {
        console.error(error);
        this._toastService.errorToast(error);
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

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // resize the cols
    this.gridApi.sizeColumnsToFit();

    const sort = [
      {
        colId: 'growerName',
        sort: 'asc'
      }
    ];

    // todo - should we pre filter status?
    this.gridApi.setSortModel(sort);
  }

}
