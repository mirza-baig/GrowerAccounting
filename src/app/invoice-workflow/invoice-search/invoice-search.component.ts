import { InvoiceSearchActionsComponent } from './invoice-search-actions/invoice-search-actions.component';
import { IInvoiceSearchVM } from './../../models/invoice-search-vm.interface';
import { AllModules, ColDef, Column, ColumnApi, GridApi } from '@ag-grid-enterprise/all-modules';
import { IVwApinvoiceWithRequest } from 'src/app/models/vw-ap-invoice-with-request.interface';
import { IGrowerMaster } from './../../models/grower-master.interface';
import { IVwApvendorMaster } from './../../models/vw-apvendor-master.interface';
import { InvoiceSearchService } from './invoice-search.service';
import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/shared/toast.service';
import { GrowerMasterListService } from 'src/app/account-maintenance/grower-master-list/grower-master-list.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import {currencyFormatter} from '../../shared/grid-formatters/currency-formatter';

@Component({
  selector: 'app-invoice-search',
  templateUrl: './invoice-search.component.html',
  styleUrls: ['./invoice-search.component.css']
})
export class InvoiceSearchComponent implements OnInit {
  pageTitle = 'Invoice Search';
  moduleTitle = 'Invoice';
  innerWidth: any;
  innerHeight: any;

  // dropdowns
  vendorList: IVwApvendorMaster[] = [];
  growerList: IGrowerMaster[] = [];
  filteredFarms: Observable<IGrowerMaster[]>;
  selectedGrower: IGrowerMaster;
  dropdownsLoaded: boolean = false;

  // misc flags
  checksReloading: boolean = false;
  filterSubmitted: boolean = false;
  invoicesLoaded: boolean = false;

  // grid
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  invoices: IVwApinvoiceWithRequest[] = [];
  showGrid: boolean = false;
  modules = AllModules;
  colDefs: ColDef[] = [
    {
      headerName: 'Farm',
      field: 'farmName',
      width: 300,
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      }
    },
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
      field: 'invoiceNumber',
      width: 200,
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
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
      headerName: 'Check #',
      field: 'checkNumber',
      width: 200,
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      }
    },
    {
      headerName: 'Amount',
      field: 'amount',
      width: 200,
      valueFormatter: params => currencyFormatter(params, '$0'),
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        debounceMs: 0,
      }
    },
    {
      headerName: 'Actions',
      cellRenderer: 'actionsRenderer',
      field: 'id',
      width: 200,
      sortable: false,
      filter: false
    },
  ];
  public frameworkComponents = {
    actionsRenderer: InvoiceSearchActionsComponent,
  };

  // search form
  searchForm: FormGroup;
  searchFormLoaded: boolean = false;
  searching: boolean = false;
  searchModel: IInvoiceSearchVM;

  constructor(
    private _toastService: ToastService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _searchService: InvoiceSearchService,
    private _growerService: GrowerMasterListService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    // set width
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

    // load some dropdowns
    this.loadGrowerList();

    // build the form
    this.buildSearchForm();
  }

  /** Load the vendor dropdown list */
  private loadVendorList() {
    // since the call takes 10 seconds, we just cached it on app init and retrieve it from there
    this.vendorList = JSON.parse(localStorage.getItem('APVendorList')) as IVwApvendorMaster[];
    this.dropdownsLoaded = true;
  }

  /**  */
  private buildSearchForm() {
    this.searchForm = this._formBuilder.group({
      CheckNumber: new FormControl({
        value: '',
      }),
      InvoiceNumber: new FormControl({
        value: '',
      }),
      Description: new FormControl({
        value: '',
      }),
      GrowerName: new FormControl({
        value: '',
      }),
      StartDate: new FormControl({
        value: '',
      }),
      EndDate: new FormControl({
        value: '',
      }),
    });
    this.resetFilters();

    this.filteredFarms = this.searchForm.valueChanges.pipe(
      startWith(''),
      map(() =>
        this.filterGrowers(this.searchForm.controls['GrowerName'].value)
      )
    );

    this.searchFormLoaded = true;
  }

  public resetFilters() {
    this.searchForm.patchValue({
      CheckNumber: '',
      InvoiceNumber: '',
      Description: '',
      GrowerName: '',
      StartDate: '',
      EndDate: '',
    });
  }

  /** filter the vendor list for the autocomplete */
  private filterGrowers(value: Object): IGrowerMaster[] {
    if (value != null) {
      const list = this.growerList.filter(grower =>
        this.toLowerNullable(grower.farmName).includes(
          this.toLowerNullable(value.toString())
        )
      );
      if (list.length === 1) {
        this.selectedGrower = list[0];
      }
      return list;
    }
  }

  // CLEANUP: remove dead code
  /** reset for selecting a grower */
  /*public selectAnotherGrower() {
    // this.isGrowerSelected = false;
  }*/

  /** event for autocomplete open for the grower */
  public growerAutocompleteOpen() {
    this.selectedGrower = null;
  }

  /** Confirming the selected vendor */
  public confirmGrowerSelection() {
    // if (!!this.selectedGrower) {
    //   this._messageService.infoToast('You have selected grower #' + this.selectedGrower.id + ' - ' + this.selectedGrower.farmName);
    //   this.isGrowerSelected = true;
    // } else {
    //   this._messageService.errorToast('You must select a valid grower!');
    // }
  }

  public growerAutocompleteSelected(event: any) {
    const val = this.searchForm.value.GrowerName;
    const match = this.growerList.find(f => f.farmName.toString() === val.toString());
    this.selectedGrower = match;
  }

  public syncCheckData() {
    this.checksReloading = true;
    this._searchService.syncInvoiceCheckData().subscribe(result => {
      this.checksReloading = false;
      this._toastService.successToast('You have successfully refreshed the check data for invoices');
    });
  }

  private loadGrowerList() {
    this._growerService
    .getGrowers(true)
    .subscribe(
      data => {
        try {
          this.growerList = data
          .filter(g => g.farmType.toString() !== '3') // ? should we filter out misc farms?
          .map(g => {
            g.farmName = g.farmName.trim();
            return g;
          });
          this.loadVendorList();
        } catch (e) {
          console.error(e);
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  public searchInvoices() {
    this.searching = true;
    this.invoicesLoaded = false;
    const vals = this.searchForm.value;
    this.searchModel = {
      growerName: vals.GrowerName,
      checkNumber: vals.CheckNumber,
      description: vals.Description,
      startDate: !!vals.StartDate ? new Date(vals.StartDate) : null,
      endDate: !!vals.EndDate ? new Date(vals.EndDate) : null,
      invoiceNumber: vals.InvoiceNumber,
      fileData: null,
    } as IInvoiceSearchVM;

    this._searchService.searchInvoices(this.searchModel).subscribe(result => {
      this.invoices = result.map(i => {
        const match = this.vendorList.find(v => v.vnumb.toString() === i.vendorId.toString());
        i.vendorName = !!!match ? '' : match.vnumb + ' - ' + match.vname.trim();
        return i;
      });
      this.invoicesLoaded = true;
      this.searching = false;
    }, error => {
      console.error(error);
      this._toastService.errorToast(error);
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

   onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // resize the cols
    this.gridApi.sizeColumnsToFit();

  }

  private toLowerNullable(value: string) {
    return value != null ? value.toLowerCase() : '';
  }

  trackByGrower(index, item: IGrowerMaster) {
    return item.farmName;
  }
}
