import { Component, OnInit, HostListener } from '@angular/core';
import { ISettlement } from 'src/app/models/settlement.interface';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { FixSettlementsService } from './fix-settlements.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { IGrowerMaster } from 'src/app/models/grower-master.interface';
import { IVwApvendorMaster } from 'src/app/models/vw-apvendor-master.interface';
import { ISettlementCorrectionItem } from './settlement-correction-item.interface';
import { GrowerMasterListService } from 'src/app/account-maintenance/grower-master-list/grower-master-list.service';
import { ISettlementBatch } from 'src/app/models/settlement-batch.interface';

@Component({
  selector: 'app-fix-settlements',
  templateUrl: './fix-settlements.component.html',
  styleUrls: ['./fix-settlements.component.css']
})
export class FixSettlementsComponent implements OnInit {
  pageTitle = 'Settlement Batch Errors';
  moduleTitle = 'Settlements';
  innerWidth: any;
  innerHeight: any;
  id: number;

  // lookup lists
  growers: IGrowerMaster[] = [];
  vendors: IVwApvendorMaster[] = [];

  // settlement list and grid vars
  settlementsFull: ISettlement[] = [];
  settlements: ISettlement[] = [];
  settlementList: ISettlementCorrectionItem[] = [];
  settlementsLoaded: boolean = false;
  showAllSettlements: boolean = false;
  public gridApi;
  public gridColumnApi;
  modules = AllModules;
  columnDefs = [
    {
      headerName: 'Errors',
      field: 'settlement.message',
      width: 100,
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      }
    },
    {
      headerName: 'Entity',
      field: 'settlement.entity',
      width: 100,
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      }
    },

    {
      headerName: 'Grower #',
      field: 'settlement.growerId',
      width: 100,
      sortable: true,
      filter: 'agTextColumnFilter',
      cellStyle: this.growerIdStyle,
      editable: function(params) {
        return params.data.settlement.message.includes('Invalid GrowerId');
      },
      filterParams: {
        filterOptions: ['startsWith', 'contains'],

        debounceMs: 0,
        caseSensitive: false,

      }
    },
    {
      headerName: 'Grower Name',
      field: 'growerName',
      width: 150,
      sortable: true,
      filter: 'agTextColumnFilter',
      cellStyle: this.growerNameStyle,
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      }
    },
    {
      headerName: 'Amount',
      field: 'settlement.settlementAmount',
      width: 150,
      sortable: true,
      editable: function(params) {
        return params.data.settlement.message.includes('Invalid Amount');
      },
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
      },
      cellStyle: this.amountStyle
    },
    {
      headerName: 'Dozen Eggs',
      field: 'settlement.dozenEggs',
      width: 150,
      sortable: true,
      editable: function(params) {
        return params.data.settlement.message.includes('Invalid Dozen Eggs');
      },
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
      }
      // cellStyle: this.dozenEggsPayStyle
    },
    {
      headerName: 'Status',
      field: 'settlement.status',
      width: 100,
      sortable: true,
      filter: true,
      hide: true,
    },
  ];

  // Submit modal
  showErrorModal: boolean = false;
  errorList: string[] = [];

  batch: ISettlementBatch;



  constructor(
    private messageService: MessageService,
    private _settlementService: FixSettlementsService,
    private _growerService: GrowerMasterListService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    // set the dimensions
    this.innerHeight = window.innerHeight;
    this.innerWidth = window.innerWidth;

    // parse the url
    this._route.queryParams.subscribe(params => {
      this.id = params['Id'];
    });

    this.loadBatch(this.id);

    this.loadVendorList();
    // this.loadSettlements(this.id);
  }

  /** save the batch so we can update it later */
  private loadBatch(id: number) {
    this._settlementService
    .getSettlementBatch(id)
    .subscribe(
      data => {
        try {
          this.batch = data;
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

  private loadVendorList() {
    // since the call takes 10 seconds, we just cached it on app init and retrieve it from there
    this.vendors = JSON.parse(localStorage.getItem('APVendorList')) as IVwApvendorMaster[];


    this.loadGrowerList();
  }

  private loadGrowerList() {
    this._growerService
    .getGrowers(false)
    .subscribe(
      data => {
        try {
          this.growers = data.map(g => {
            g.status = g.status.trim();
            return g;
          }).filter(g => g.status === 'Active');

          this.loadSettlements(this.id);
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

  public getGrower(id: number) {
    // 'Invalid'
    const match = this.growers.find(g => g.id.toString() === id.toString());
    return !!match ? match.farmName : 'Invalid';
  }




  public loadSettlements(id: number) {
    this._settlementService
    .getSettlementsByBatchId(id)
    .subscribe(
      data => {
        try {
          this.settlementsFull = data;
          // we'll apply the filter on a column
          this.settlements = data; // .filter(s => s.status.trim() === 'Error');
          this.settlementList = this.settlements.map(s => {
            const grower = this.growers.find(g => g.id.toString() === s.growerId.toString());
            // s.dozenEggs = 1;
            // s.message = 'Invalid Dozen Eggs';
            // const vendor = this.vendors.find(v => v.vnumb.toString() === s.id.toString());
            s.status = s.status.trim();
            return {
              settlement: s,
              growerName: !!grower ? grower.farmName : 'Invalid',
              // vendorName: 'Invalid',

            } as ISettlementCorrectionItem;
          });
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
    // for (let i = 0; i < 30; i++) {
    //   const gid = i % 3 === 0 ? this.growers[this.randomInt(2)].id : this.randomInt(5);
    //   this.settlementList.push({
    //     settlement: {
    //       growerId: gid,
    //       entity: this.randonEntity(),
    //     } as ISettlement,
    //     growerName: this.getGrower(gid)
    //   } as ISettlementCorrectionItem);
    // }
    // this.settlementsLoaded = true;

  }

  public onCellChange(event: any) {
    if (!!!event.event.target.value) {
      return;
    }
    // only do our event if it is the first column (AD) for matching account name
    if (event.colDef.field === 'settlement.growerId')  {

      // search the GL account list
      // event.RowIndex will tell us which line to modify
      const attempt = this.growers.find(a => a.id.toString() === event.event.target.value.toString());
      if (!!attempt) {
        const name = attempt.farmName.trim();
        event.node.setDataValue('growerName', name);
        // event.api.setFocusedCell(event.rowIndex, 'growerName', null);
        const focusedCell =  event.api.getFocusedCell();
        focusedCell.cellStyle = {
          backgroundColor: '#7eff75',
          color: 'black',
        };
        event.api.refreshCells({
            force: true // this updates the whole column, not only the clicked cell
        });

        // event.rowIndex;

      } else {
        // input is invalid
        event.node.setDataValue('growerName', 'Invalid');
        const focusedCell =  event.api.getFocusedCell();
        // console.log(focusedCell);
        focusedCell.cellStyle = {
          backgroundColor: 'red',
          color: 'white',
        };

        event.api.refreshCells({
          force: true // this updates the whole column, not only the clicked cell
        });



    }


  } }

  public showHideSettlements() {
    this.showAllSettlements = !this.showAllSettlements;
    const filterInstance = this.gridApi.getFilterInstance('settlement.status');
    filterInstance.selectNothing();
    filterInstance.selectValue('Error');
    if (this.showAllSettlements) {
      filterInstance.selectValue('New');
    }
    filterInstance.applyModel();
    this.gridApi.onFilterChanged();

  }

  public returnToList() {
    this._router.navigateByUrl('SettlementBatchListComponent');
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

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    // by default let's filter out the non-error entries
    const filterInstance = this.gridApi.getFilterInstance('settlement.status');
    filterInstance.selectNothing();
    filterInstance.selectValue('Error');
    filterInstance.applyModel();
    this.gridApi.onFilterChanged();


    // resize the cols
    this.gridApi.sizeColumnsToFit();

  }

  public randomNumber(digits: number) {
    // add 2, then divide by 100
    return Math.floor(Math.random() * Math.pow(10, 2 + digits)) * 0.01;
  }

  public randomInt(digits: number) {
    // add 2, then divide by 100
    return Math.floor(Math.random() * Math.pow(10, digits));
  }

  public randonEntity() {
    return this.randomInt(4) + '-' + this.randomInt(2) + '-' + this.randomInt(2);
    // 2589-11-01
  }

  /***************************************************
   * Cell styles
   **************************************************/

  /** handles CSS for when the dozen eggs payment is invalid */
  public dozenEggsPayStyle(params) {
    // todo - determine error message
    if (params.data.settlement.status.toString() === 'Error' && params.data.settlement.message.includes('Invalid Dozen Eggs')) {
      if (!!!params.value || parseInt(params.value, 10) === 0) {
        return {
          backgroundColor: 'red',
          color: 'white',
        };
      } else {
        return {
          backgroundColor: '#7eff75',
          color: 'black',
        };

      }
    } else {
      // bypass if not applicable
      return null;
    }
  }

  /** handles CSS for when the settlement amount is invalid */
  public amountStyle(params) {
    // todo - determine error message
    if (params.data.settlement.status.toString() === 'Error' && params.data.settlement.message.includes('Invalid Amount')) {
      if (!!!params.value || parseFloat(params.value) === 0) {
        return {
          backgroundColor: 'red',
          color: 'white',
        };
      } else {
        return {
          backgroundColor: '#7eff75',
          color: 'black',
        };

      }
    } else {
      // bypass if not applicable
      return null;
    }
  }

  /** Styler for grower name */
  public growerNameStyle(params) {
    if (params.data.settlement.status.toString() === 'Error' && params.data.settlement.message.includes('Invalid GrowerId')) {
      if (!!!params.value || params.value === 'Invalid') {
        return {
          backgroundColor: 'red',
          border: '2px solid black',
          color: 'white',
        };
      } else {
        return {
          backgroundColor: '#7eff75',
          border: '2px solid black',
          color: 'black',
        };

      }
    } else {
      // bypass if not applicable
      return null;
    }
  }

  public growerIdStyle(params) {
    if (params.data.settlement.status.toString() === 'Error' && params.data.settlement.message.includes('Invalid GrowerId')) {
      if (!!!params.value || params.data.growerName === 'Invalid') {
        return {
          backgroundColor: 'red',
          border: '2px solid black',
          color: 'white',
        };
      } else {
        return {
          backgroundColor: '#7eff75',
          border: '2px solid black',
          color: 'black',
        };

      }
    } else {
      // bypass if not applicable
      return null;
    }
  }



  public submitFixes() {

    // todo - close active focused cell on the grid
    this.errorList = [];
    let valid = true;



    this.settlementList.forEach(settlement => {
      // check for all the error types
      // grower id
      if (settlement.settlement.status === 'Error' && settlement.settlement.message.includes('Invalid GrowerId')
          && settlement.growerName === 'Invalid') {
            this.errorList.push(settlement.settlement.entity + ': Invalid Grower Id ' + settlement.settlement.growerId);
            valid = false;
      }

      // amount
      // if (settlement.settlement.status === 'Error' && settlement.settlement.message.includes('Invalid Amount')
      //     && !!!settlement.settlement.settlementAmount) {
      //       this.errorList.push(settlement.settlement.entity + ': Invalid Settlement Amount ' + settlement.settlement.settlementAmount);
      //       valid = false;
      // }

      // dozen eggs
      // if (settlement.settlement.status === 'Error' && settlement.settlement.message.includes('Invalid Dozen Eggs')
      //     && !!!settlement.settlement.dozenEggs) {
      //       this.errorList.push(settlement.settlement.entity + ': Invalid Dozen Eggs ' + settlement.settlement.dozenEggs);
      //       valid = false;
      // }

    });
    this.errorList = this.settlementList.filter(settlement =>
        settlement.settlement.status === 'Error'
      && settlement.settlement.message.includes('Invalid GrowerId')
      && settlement.growerName === 'Invalid')
    .map(settlement => {
      return settlement.settlement.entity + ': Invalid Grower Id ' + settlement.settlement.growerId;
    });
    valid = this.errorList.length === 0;
    // loop through each settlement
    this.showErrorModal  = !valid;

    // only submit if the whole page is valid
    if (valid) {
      /*
      0. for each settlement reset the status to new
      1. build a list of the settlements to submit (or submit them all)
      2. update the batch to New instead of Error?


      */

      // update each of the settlements with their fixes
      const errorList = this.settlementList.filter(s => s.settlement.status === 'Error');
      for (let i = 0; i < errorList.length; i++) {
        errorList[i].settlement.status = 'New';
        errorList[i].settlement.message = '';
        // update the settlement
        this._settlementService.postSettlement(errorList[i].settlement)
        .subscribe(
          data => {
            if (data.statusCode !== 200) {
              this.errorToast('Error posting settlement ' + errorList[i].settlement.entity + ' : ' + data.errors.toString());
              valid = false;
            }
          },
          error => {
            console.error(error);
          }
        );

      }

      // if they all succeeded then move on to the batch itself
      if (valid) {
        this.batch.status = 'New';
        this._settlementService.postSettlementBatch(this.batch)
        .subscribe(
          data => {
            if (data.statusCode === 200) {
              this.successToast('You have successfully submitted the changes to the settlements');
              setTimeout( () => {
                this._router.navigateByUrl('SettlementBatchListComponent');
              }, 2000 );
            }
          },
          error => {
            console.error(error);
          }
        );
      } else {
        this.errorToast('Errors occured submitting the fixes. Please try again');
      }

      // then update the batch
      if (errorList && errorList.length > 0) {
        console.error(errorList);
      }
    }
  }
}
