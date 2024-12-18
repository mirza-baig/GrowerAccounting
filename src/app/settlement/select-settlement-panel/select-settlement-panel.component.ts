import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { AgGridAngular } from '@ag-grid-community/angular';
import { ISettlement } from 'src/app/models/settlement.interface';
import { IGrowerMaster } from 'src/app/models/grower-master.interface';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { SettlementSelectionActionComponent } from './settlement-selection-action/settlement-selection-action.component';
import {currencyFormatter} from '../../shared/grid-formatters/currency-formatter';
import {dateFormatter} from '../../shared/grid-formatters/date-formatter';

@Component({
  selector: 'app-select-settlement-panel',
  templateUrl: './select-settlement-panel.component.html',
  styleUrls: ['./select-settlement-panel.component.css']
})
export class SelectSettlementPanelComponent implements OnInit {

  @ViewChild('agGrid') agGrid: AgGridAngular;
  innerWidth: any;
  innerHeight: any;

  // inputs and outputs
  @Input() widthpx: number;
  @Input() heightpx: number;
  @Input() startingId: number;
  @Input() grower: IGrowerMaster;
  @Input() settlements: ISettlement[];

  @Output() settlementSelectedEvent = new EventEmitter<ISettlement>();

  currentlySelectedSettlement: ISettlement;
  settlementSelected: boolean = false;

  // settlement selection grid
  private settlementGridApi;
  private settlementGridColumnApi;
  modules = AllModules;

  private frameworkComponents = {
    actionRenderer: SettlementSelectionActionComponent
  };

  private settlementColumnDefs = [
    {
      headerName: 'Entity',
      field: 'entity',
      width: 200,
      sortable: true,
      cellRenderer: 'agGroupCellRenderer',
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
      headerName: 'Grower Payment',
      field: 'settlementAmount',
      width: 120,
      valueFormatter: params => currencyFormatter(params, '$0'),
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        debounceMs: 0,
      },
      cellStyle: function(params) {
        return {
          'font-weight' : '900'
        };
      }
    },
    {
      headerName: 'Dozen Eggs',
      field: 'dozenEggs',
      width: 100,
      sortable: true,
      hide: true, // todo - show this column if the grower is a broiler
      filter: 'agNumberColumnFilter',
      filterParams: {
        debounceMs: 0,
      }
    },
    {
      headerName: 'Net Grower',
      field: 'netGrowerPayment',
      width: 100,
      valueFormatter: params => currencyFormatter(params, '$0'),
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        debounceMs: 0,
      }
    },
    {
      headerName: 'Actions',
      width: 200,
      cellRenderer: 'actionRenderer',
      field: 'id',
      sortable: false,
      filter: false
    }
  ];

  constructor() { }

  ngOnInit() {
    if (this.startingId > 0) {
      this.currentlySelectedSettlement = this.settlements.find(g => g.id.toString() === this.startingId.toString());

      if (!!this.currentlySelectedSettlement) {
        this.settlementSelected = true;
        this.settlementSelectedEvent.emit(this.currentlySelectedSettlement);
      }
    }
  }

  onSelectionChanged() {
    const selectedRows = this.settlementGridApi.getSelectedRows();
    this.currentlySelectedSettlement = selectedRows[0];
    this.settlementSelected = true;
    // since we're circumventing the confirm button and using selection list buttons, go to confirm
    this.settlementSelectedEvent.emit(this.currentlySelectedSettlement);
  }

  resetChoice() {
    this.settlementSelected = false;
    this.settlementSelectedEvent.emit(null);
  }

  onSettlementGridReady(params) {
    this.settlementGridApi = params.api;
    this.settlementGridColumnApi = params.columnApi;
    if (!!this.grower) {
      this.settlementGridColumnApi.setColumnVisible('dozenEggs', this.grower.farmType === 'Breeder');
    }

    this.settlementGridApi.sizeColumnsToFit();
  }


}
