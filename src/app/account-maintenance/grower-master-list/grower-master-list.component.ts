import { DropdownService } from 'src/app/shared/dropdown.service';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { MessageService } from 'primeng/api';
import { GrowerMasterListService } from './grower-master-list.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { AgGridAngular } from '@ag-grid-community/angular';
import { GrowerMasterEditButtonComponent } from './grower-master-edit-button/grower-master-edit-button.component';
import { IGrowerMaster } from 'src/app/models/grower-master.interface';
import { UtilityService } from 'src/app/shared/utility.service';
import { IDropdownListItem } from 'src/app/models/dropdown-list-item.interface';

@Component({
  selector: 'app-grower-master-list',
  templateUrl: './grower-master-list.component.html',
  styleUrls: ['./grower-master-list.component.css']
})
export class GrowerMasterListComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  pageTitle = 'Grower Master List';
  moduleTitle = 'Account Maintenance';
  innerWidth: any;
  innerHeight: any;

  columnDefs = [
    {
      headerName: 'Farm #',
      field: 'id',
      width: 70,
      sortable: true,
      filter: 'agTextColumnFilter',
      // filterParams: {
      //   defaultOption: { startsWith: '' }
      // }
      filterParams: {
        filterOptions: ['startsWith', 'contains'],

        debounceMs: 0,
        caseSensitive: false,

      }
    },
    {
      headerName: 'Farm Name',
      width: 100,
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
      width: 80,
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
      width: 320,
      cellRenderer: 'actionsTransactionRenderer',
      field: 'id',
      sortable: false,
      filter: false
    }
  ];


  private frameworkComponents = {
    actionsTransactionRenderer: GrowerMasterEditButtonComponent
  };

  // api.sizeColumnsToFit()

  accounts: IGrowerMaster[] = [];
  accountsLoaded: boolean = false;
  lockSync: boolean = false;
  lockVendors: boolean = false;
  private gridApi;
  private gridColumnApi;

  farmTypes: IDropdownListItem[] = [];

  constructor(
    private messageService: MessageService,
    private _growerService: GrowerMasterListService,
    private _dropdownService: DropdownService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _utilityService: UtilityService,
  ) { }

  modules = AllModules;

  ngOnInit() {
    // set width
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

    this.getLockStatus();

    this.loadAccounts();
  }

  public getLockStatus() {
    this._utilityService
      .isSettlementInProcess()
      .subscribe(
        data => {
          try {
            sessionStorage.setItem('lockSettlements', JSON.stringify(data));
            // this.lockSettlements = data;
          } catch (e) {
            console.error(e);
          }
        },
        error => {
          console.error(error);
        }
      );
  }

  /** Load the account list for grower master */
  private loadAccounts() {
    this._growerService
    .getGrowers(false)
    .subscribe(
      data => {
        try {
          this.accounts = data.map(g => {
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
          this.accountsLoaded = true;


        } catch (e) {
          console.error(e);
        }
      },
      error => {
        console.error(error);
        this.errorToast(error);
      }
    );

    // temp bypass



  }

  private addMiscGrower() {
    this._router.navigateByUrl('EditGrowerMasterComponent?Id=0');
  }

  public syncGrowers() {
    this.lockSync = true;
    this._utilityService.updateGrowerData().subscribe(result => {
      this.lockSync = false;
      if (result.statusCode === 200) {
        this.successToast('You have successfully reloaded the grower list!');
        setTimeout(() => {
          this.accountsLoaded = false;
          this.loadAccounts();
        }, 3000);
      } else {
        console.error(result);
        this.errorToast(result.data);
      }
    }, error => {
      console.error(error);
    });
  }

  public syncVendors() {
    // we also need to cache some dropdown lists because of how slow they are to load
    this.lockVendors = true;
    this._dropdownService.getAPVendors().subscribe(vendors => {
      localStorage.setItem('APVendorList', JSON.stringify(vendors));
      this.successToast('You have successfully refreshed the vendor list!');
      this.lockVendors = false;
    }, error => {
      console.error(error);
      this.errorToast(error);
    });

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

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // resize the cols
    this.gridApi.sizeColumnsToFit();

    const sort = [
      {
        colId: 'farmType',
        sort: 'asc'
      }
    ];
    this.gridApi.setSortModel(sort);
  }


}
