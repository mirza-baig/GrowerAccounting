import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { AgGridAngular } from '@ag-grid-community/angular';
import { ISettlementItemVM } from 'src/app/models/settlement-item-vm.interface';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { SettlementListService } from './settlement-list.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SettlementListEditButtonComponent } from './settlement-list-edit-button/settlement-list-edit-button.component';
import { SettlementListTransferButtonComponent } from './settlement-list-transfer-button/settlement-list-transfer-button.component';
import { SettlementInfoDetailPanelComponent } from './settlement-info-detail-panel/settlement-info-detail-panel.component';
import { IGrowerMaster } from 'src/app/models/grower-master.interface';
import { ISettlementBatch } from 'src/app/models/settlement-batch.interface';
import { ISettlement } from 'src/app/models/settlement.interface';
import { GrowerMasterListService } from 'src/app/account-maintenance/grower-master-list/grower-master-list.service';
import { ISettlementTransfer } from 'src/app/models/settlement-transfer.interface';
import { DropdownService } from 'src/app/shared/dropdown.service';
import { ISettlementWithCounts } from 'src/app/models/settlement-with-counts.interface';
import {currencyFormatter} from '../../shared/grid-formatters/currency-formatter';


@Component({
  selector: 'app-settlement-list',
  templateUrl: './settlement-list.component.html',
  styleUrls: ['./settlement-list.component.css']
})
export class SettlementListComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  pageTitle = 'Settlement List';
  moduleTitle = 'Settlement';
  innerWidth: any;
  innerHeight: any;
  id: number;
  private rowHeight;
  public gridApi;
  public gridColumnApi;
  posted: boolean = false;

  // grower
  growerSelected: IGrowerMaster;
  isGrowerSelected: boolean = false;
  dateSelected: boolean = false;
  settlementDate: Date;
  growerList: IGrowerMaster[] = [];

  // transfers
  toSettlement: ISettlement;
  fromSettlement: ISettlement;
  enableTransfer: boolean = false;
  addTransferModal: boolean = false;
  toRevised: number;
  fromRevised: number;
  transferAmount: number = 0;
  transferForm: FormGroup;
  blockTransferSubmit: boolean = true;

  // settlements
  settlements: ISettlementItemVM[] = [];
  settlementList: ISettlementWithCounts[] = [];
  settlementsLoaded: boolean = false;
  columnDefs = [
    // {headerName: '',  field: 'Id', width: 50, sortable: true, filter: true },
    // {headerName: 'Edit', cellRenderer: 'agGroupCellRenderer', field: 'Id', width: 100, sortable: true, filter: true },
    // {headerName: 'Transfer', autoHeight: true, cellRenderer: 'transferSettlementRenderer', field: 'Id', width: 100, sortable: true, filter: true },
    {
      headerName: 'Entity',
      field: 'entity',
      width: 200,
      sortable: true,
      cellRenderer: 'agGroupCellRenderer',
      filter: 'agTextColumnFilter',
      checkboxSelection: function(params) {
        // disable transfers if posted
        return params.data.status.trim() !== 'Posted' && params.data.status.trim() !== 'Duplicate';
      },
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      }
    },
    // {
    //   headerName: 'Farm',
    //   field: 'growerId',

    //   sortable: true,
    //   filter: 'agTextColumnFilter',
    // },
    {
      headerName: 'Farm',
      field: 'growerName',
      width: 200,
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      }
    },
    // {headerName: 'Farm', field: 'FarmName', width: 100, sortable: true, filter: true },
    {
      headerName: 'Group',
      width: 90,
      field: 'groupCode',
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
      valueFormatter: currencyFormatter,
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
      filter: 'agNumberColumnFilter',
      filterParams: {
        debounceMs: 0,
      }
    },
    // todo - should this exist up here (we'll need it passed over),
    // {
    //   headerName: 'Regular',
    //   field: 'RegularOriginalDeduction',
    //   valueFormatter: this.currencyFormatter,
    //   sortable: true,
    //   filter: true
    // },
    // {
    //   headerName: 'Special',
    //   field: 'SpecialOriginalDeduction',
    //   valueFormatter: this.currencyFormatter,
    //   sortable: true,
    //   filter: true
    // },
    // {
    //   headerName: 'Unique',
    //   field: 'UniqueOriginalDeduction',
    //   valueFormatter: this.currencyFormatter,
    //   sortable: true,
    //   filter: true
    // },
    // {headerName: 'Unique Int', field: 'UniqueOriginalDeductionInterest', valueFormatter: this.currencyFormatter, width: 300, sortable: true, filter: true },
    // {headerName: 'Const', field: 'Const', valueFormatter: this.currencyFormatter, width: 300, sortable: true, filter: true },
    // {
    //   headerName: 'Net',
    //   field: 'Net',
    //   sortable: true,
    //   filter: true
    // },
    // {
    //   headerName: 'Note Payment',
    //   field: 'NotePayment',
    //   valueFormatter: this.currencyFormatter,
    //   sortable: true,
    //   filter: true
    // },
    {
      headerName: 'Net Grower',
      field: 'netGrowerPayment',
      width: 100,
      valueFormatter: currencyFormatter,
      sortable: true,
      filter: 'agNumberColumnFilter',
      cellStyle: function(params) {

        if (params.value < 10 && params.data.status.trim() !== 'Posted' && params.data.status.trim() !== 'Duplicate') {
          return  {
            'border': '2px solid black',
            'background-color': '#F02020',
            'color': 'white',
          };
        } else {
          return {
            'font-weight' : '900'
          };
        }
      },
      filterParams: {
        debounceMs: 0,
      }
    },


  ];
  modules = AllModules;
  public selectMode = 'multiple';

  public detailRowHeight = 1250; // todo - can i do this at a sub level?
  public detailCellRenderer = 'myDetailCellRenderer';
  public rowClassRules;
    // this.frameworkComponents = {  };
    public frameworkComponents = {
    editSettlementRenderer: SettlementListEditButtonComponent,
    transferSettlementRenderer: SettlementListTransferButtonComponent,
    myDetailCellRenderer: SettlementInfoDetailPanelComponent,
  };

  public getRowHeight;



  // private detailCellRendererParams = {
  //   detailGridOptions: {
  //     columnDefs: [
  //       { field: 'NotePayment' },
  //       { field: 'NetGrower' }
  //     ],
  //     onFirstDataRendered: function(params) {
  //       // params.api.sizeColumnsToFit();
  //     }
  //   },
  //   getDetailRowData: function(params) {
  //     // console.log(params);
  //     // let blah = [];
  //     // blah.push({NotePayment: this.randomNumber(5), NetGrower: this.randomNumber(5)});
  //     // blah.push({NotePayment: this.randomNumber(5), NetGrower: this.randomNumber(5)});
  //     // blah.push({NotePayment: this.randomNumber(5), NetGrower: this.randomNumber(5)});
  //     // blah.push({NotePayment: this.randomNumber(5), NetGrower: this.randomNumber(5)});
  //     // blah.push({NotePayment: this.randomNumber(5), NetGrower: this.randomNumber(5)});
  //     // params.successCallback(blah);
  //     console.log(params);
  //     params.successCallback(params.data.value);
  //   }};


  constructor(
    private messageService: MessageService,
    private _settlementListService: SettlementListService,
    private _growerService: GrowerMasterListService,
    private _dropdownService: DropdownService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
  ) {
    this.getRowHeight = function(params) {
      if (params.node && params.node.detail) {
        let base = 200;
        base += params.data.deductionCount * 50 + 50;
        base += params.data.notePaymentCount * 50 + 50;
        base += params.data.transferCount * 50 + 50;

        // if (params.data.deductionCount > 0) {
        //   base += 500;
        // }
        // if (params.data.notePaymentCount > 0) {
        //   base += 300;
        // }
        // if (params.data.transferCount > 0) {
        //   base += 300;
        // }
        // console.log(params);
        // console.log('row height ');
        return base;
      } else {
        return 50;
      }

    };
   }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

    // build the transfer form
    this.transferForm = this._formBuilder.group({
      Amount: new FormControl({
        value: '',
      }, [ Validators.required])});

    // parse the url
    // parse the URL?
    this._route.queryParams.subscribe(params => {
      this.id = params['id'];
    });

    sessionStorage.setItem('batchId', this.id.toString());

    this.loadAccountTypes();
    this.loadGrowers();


  }

  /** save the account types to use below */
  private loadAccountTypes() {
    this._dropdownService
      .getAccountTypes()
      .subscribe(
        data => {
          try {
            sessionStorage.setItem('AccountTypes', JSON.stringify(data));
          } catch (e) {
            console.error(e);
          }
        },
        error => {
          console.error(error);
        }
      );

  }

  public returnToList() {
    this._router.navigateByUrl('SettlementBatchListComponent');
  }


  public loadGrowers() {
    this._growerService
    .getGrowersForSettlementBatch(this.id)
    .subscribe(
      data => {
        try {
          this.growerList = data;
          // save for use in edit panels
          // tabled for now
          sessionStorage.setItem('GrowerList', JSON.stringify(data.map(g => {
            g.farmName = g.id + ' - ' + g.farmName;
            return g;
          })));
          this.loadSettlements(this.id);

        } catch (e) {
          console.error(e);
        }
      },
      error => {

        console.error(error);
        this.errorToast(error);
      });

  }

  public loadSettlements(id: number) {

    this._settlementListService
    .getSettlementsByBatchId(id)
    .subscribe(
      data => {
        try {
          this.settlementList = data
          // todo - should we filter out duplicate settlements?
          // .filter(s => s.status.trim() === 'InProcess')
          .map(s => {
            const gmatch = this.growerList.find(g => g.id.toString() === s.growerId.toString());
            s.growerName = !!gmatch ? gmatch.farmName : 'Invalid';
            s.transferSelect = false;
            return s;
          });
          this.posted = data[0].status.trim() === 'Posted';
          this.settlementsLoaded = true;


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

  public netValueChanged(event: any) {
    this.settlementsLoaded = false;
    this.loadSettlements(this.id);
  }


  public onSettlementSelectionChanged(event: any) {
    // check the selection
    const selected = this.gridApi.getSelectedRows();
    // this will allow 1 or 2 to be selected. If a third is clicked it resets back to one.
    this.selectMode = selected.length < 2 ? 'multiple' : 'none';
    if (selected.length === 0) {
      const filterInstance = this.gridApi.getFilterInstance('groupCode');
      filterInstance.setModel({
        type: 'equals',
        filter: '',
        filterTo: null
      });
      this.gridApi.onFilterChanged();
      this.enableTransfer = false;
    } else if (selected.length === 1) {
      // if 1 is selected, highlight the matching group codes?
      this.toSettlement = selected[0];
      this.fromSettlement = null;
      // what if we filter down the matches?
      const filterInstance = this.gridApi.getFilterInstance('groupCode');
      filterInstance.setModel({
        type: 'equals',
        filter: this.toSettlement.groupCode,
        filterTo: null
      });
      this.gridApi.onFilterChanged();
      this.enableTransfer = false;
    } else if (selected.length === 2) {
      // remove all row styling?
      this.toSettlement = selected[0];
      this.fromSettlement = selected[1];
      this.enableTransfer = true;
    }

    event.api.refreshCells({
      force: true // this updates the whole column, not only the clicked cell
    });

  }


  public getSettlementRowClass(params: any) {
    const selected = params.api.getSelectedRows();
    // params.data.GroupCode
    if (selected.length % 2 === 0) {
      return null;
    } else {
      // mark all the matches
      const code = selected[0].groupCode;
      const css = params.data.groupCode === code ? 'settlement-group' : '';
      return css;
    }
    // console.log(params);
    // return null;
  }


  public addTransfer() {
    this.toRevised = this.toSettlement.netGrowerPayment;
    this.fromRevised = this.fromSettlement.netGrowerPayment;
    this.addTransferModal = true;


  }

  /** switch the to and from */
  public reverseTransfer() {
    const tempSettle = this.toSettlement;
    this.toSettlement = this.fromSettlement;
    this.fromSettlement = tempSettle;
    this.toRevised = this.toSettlement.netGrowerPayment;
    this.fromRevised = this.fromSettlement.netGrowerPayment;
  }

  public submitTransfer() {
    // save the info and generate the model
    const transfer = {
      id: 0,
      fromSettlementId: this.fromSettlement.id,
      toSettlementId: this.toSettlement.id,
      transferAmount: parseFloat(this.transferAmount.toString()),
      status: 'InProcess',
    } as ISettlementTransfer;

    const transferList = [];
    transferList.push(transfer);

    this._settlementListService
    .postSettlementTransfers(transferList)
    .subscribe(
      data => {
        try {
          if (data.statusCode === 200) {
            // now we have to update in line the settlements
            const toSettle = this.settlementList.find(s => s.id === this.toSettlement.id);
            toSettle.netGrowerPayment = this.toRevised;
            const fromSettle = this.settlementList.find(s => s.id === this.fromSettlement.id);
            fromSettle.netGrowerPayment = this.fromRevised;
            const updatelist = [];
            updatelist.push(toSettle);
            updatelist.push(fromSettle);
            this.gridApi.updateRowData({ update: updatelist });
            this.successToast('You have successfully transferred funds between the settlements');

            this.addTransferModal = false;
          }

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

  /** change the UI as they enter the transfer amount */
  public onTransferAmountChange(event: any) {
    this.transferAmount = this.transferForm.value.Amount;
    this.toRevised = this.toSettlement.netGrowerPayment + this.transferAmount;
    this.fromRevised = this.fromSettlement.netGrowerPayment - this.transferAmount;
    // we need to block the submission if amount is 0, if either payout is < 10, or if amount exceeds from balance

    this.blockTransferSubmit = this.transferAmount <= 0
                            || this.toRevised < 10
                            || this.fromRevised < 10
                            || this.transferAmount > this.fromSettlement.netGrowerPayment;

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

  public randomNumber(digits: number) {
    // add 2, then divide by 100
    return Math.random() * Math.pow(10, 2 + digits) * 0.01;
  }

  onColumnResized() {
    this.gridApi.resetRowHeights();
  }
  onGridReady(params) {
    if (params.api) {


      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;

      this.gridApi.sizeColumnsToFit();
    }
  }
  onFirstDataRendered(params) {
    // params.api.sizeColumnsToFit();
    // setTimeout(function() {
    //    params.api.getDisplayedRowAtIndex(1).setExpanded(true);
    // }, 0);
    // setTimeout(function(){api.refreshView(),0})
  }

}
