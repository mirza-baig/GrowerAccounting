import { Component, OnInit, ViewChild, HostListener, Output, EventEmitter, Input } from '@angular/core';
import { AgGridAngular } from '@ag-grid-community/angular';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { GrowerSelectionPanelService } from './grower-selection-panel.service';
import { IGrowerMaster } from '../models/grower-master.interface';
import { GrowerSelectActionComponent } from './grower-select-action/grower-select-action.component';

@Component({
  selector: 'app-grower-selection-panel',
  templateUrl: './grower-selection-panel.component.html',
  styleUrls: ['./grower-selection-panel.component.css']
})
export class GrowerSelectionPanelComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  innerWidth: any;
  innerHeight: any;

  // inputs and outputs
  @Input() widthpx: number;
  @Input() heightpx: number;
  @Input() startingId: number;
  @Input() lock: boolean;
  @Input() hideSelectAnother: boolean;
  @Input() showAllGrowers: boolean;
  @Input() settlementsOnly: boolean;
  @Input() filterIds: number[];

  @Output() growerSelectedEvent = new EventEmitter<IGrowerMaster>();

  currentlySelectedGrower: IGrowerMaster;

  // to emit, this.editEvent.emit(this.budgetItem);

  // some page flags
  growersLoaded: boolean = false;
  growerSelected: boolean = false;
  growerConfirmed: boolean = false;

  // growers
  growers: IGrowerMaster[] = [];
  columnDefs = [
    {
      headerName: 'Farm #',
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
      headerName: 'Farm Name',
      width: 200,
      field: 'farmName',
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {

        debounceMs: 0,
        caseSensitive: false,

      }
    },
    {
      headerName: 'Type',
      width: 80,
      field: 'farmType',
      // valueFormatter: this.farmTypeRenderer,
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Address',
      width: 100,
      field: 'farmAddress1',
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {

        debounceMs: 0,
        caseSensitive: false,

      }
    },
    {
      headerName: 'Status',
      width: 100,
      field: 'status',
      // valueFormatter: this.farmTypeRenderer,
      sortable: true,
      filter: true,
      cellStyle: function(params) {
        if (!!params.value && (params.value.trim().includes('Invalid') || params.value.trim().includes('Inactive'))) {
          return  {
            'color': 'red',
          };
        } else {
          return null;
        }
      }
    },
    {
      headerName: 'Actions',
      width: 200,
      cellRenderer: 'actionsTransactionRenderer',
      field: 'id',
      sortable: false,
      filter: false
    }
  ];

  // more grid
  public gridApi;
  public gridColumnApi;
  modules = AllModules;

  private frameworkComponents = {
    actionsTransactionRenderer: GrowerSelectActionComponent
  };


  constructor(
    private _growerService: GrowerSelectionPanelService,
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    if (this.settlementsOnly) {
      this.getSettlementGrowers();
    } else {
      this.loadGrowers();
    }

  }

  /** only get growers with settlements */
  private getSettlementGrowers() {
    this._growerService
    .getSettlementGrowers()
    .subscribe(
      data => {
        try {
          this.growers = data
          .map(g => {
            g.status = g.status.trim();
            switch (g.farmType.toString()) {
              case 'B':
              case '1':
                g.farmType = 'Broiler';
                break;
              case 'H':
              case '2':
                g.farmType = 'Breeder';
                break;
              case 'M':
              case '3':
                g.farmType = 'Misc';
                break;
              case '4':
                g.farmType = 'Corporate';
                break;
              default:
                g.farmType = 'Invalid';
                break;
            }
            return g;
          });



          this.growersLoaded = true;
          if (this.startingId > 0) {
            this.currentlySelectedGrower = this.growers.find(g => g.id.toString() === this.startingId.toString());

            if (!!this.currentlySelectedGrower) {
              this.growerSelected = true;
              this.growerConfirmed = true;
              this.growerSelectedEvent.emit(this.currentlySelectedGrower);
            } else {
              // this.growerSelectedEvent.emit(null);
              return;
            }


          }
        } catch (e) {
          console.error(e);
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  private loadGrowers() {
    this._growerService
    .getGrowers(this.showAllGrowers)
    .subscribe(
      data => {
        try {
          this.growers = data
          .filter(g => !!!this.filterIds || !this.filterIds.includes(g.id))
          .map(g => {
            g.status = g.status.trim();
            switch (g.farmType.toString()) {
              case 'B':
              case '1':
                g.farmType = 'Broiler';
                break;
              case 'H':
              case '2':
                g.farmType = 'Breeder';
                break;
              case 'M':
              case '3':
                g.farmType = 'Misc';
                break;
              case '4':
                g.farmType = 'Corporate';
                break;
              default:
                g.farmType = 'Invalid';
                break;
            }
            return g;
          });

          this.growersLoaded = true;
          if (this.startingId > 0) {
            this.currentlySelectedGrower = this.growers.find(g => g.id.toString() === this.startingId.toString());

            if (!!this.currentlySelectedGrower) {
              this.growerSelected = true;
              this.growerConfirmed = true;
              this.growerSelectedEvent.emit(this.currentlySelectedGrower);
            } else {
              // this.growerSelectedEvent.emit(null);
              return;
            }


          }
        } catch (e) {
          console.error(e);
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  public farmTypeRenderer(params: any) {
    switch (params.value.toString()) {
      case 'B':
        return 'Broiler';
      case 'H':
        return 'Breeder';
      case 'M':
        return 'Misc';
      case '1':
        return 'Broiler';
      default:
        return'Invalid';
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
  }


  onSelectionChanged() {
    const selectedRows = this.gridApi.getSelectedRows();
    this.currentlySelectedGrower = selectedRows[0];
    this.growerSelected = true;
    // since we're circumventing the confirm button and using selection list buttons, go to confirm
    this.confirmChoice();
  }

  resetChoice() {
    this.growerConfirmed = false;
    this.growerSelected = false;
    this.growerSelectedEvent.emit(null);
  }

  confirmChoice() {
    this.growerConfirmed = true;
    // emit the event
    this.growerSelectedEvent.emit(this.currentlySelectedGrower);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // resize the cols
    this.gridApi.sizeColumnsToFit();

    const filterInstance = this.gridApi.getFilterInstance('status');
    filterInstance.selectNothing();
    filterInstance.selectValue('Active');
    filterInstance.applyModel();
    this.gridApi.onFilterChanged();

    const sort = [
      {
        colId: 'farmType',
        sort: 'asc'
      }
    ];
    this.gridApi.setSortModel(sort);
  }
}
