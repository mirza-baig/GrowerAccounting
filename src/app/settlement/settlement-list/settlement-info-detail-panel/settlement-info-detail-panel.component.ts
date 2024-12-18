import { Component, OnDestroy, ViewChild } from '@angular/core';
import { ICellRendererAngularComp, AgGridAngular } from '@ag-grid-community/angular';
import { Router } from '@angular/router';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ISettlementDeduction } from 'src/app/models/settlement-deduction.interface';
import { ISettlementTransfer } from 'src/app/models/settlement-transfer.interface';
import { ISettlementNotePayment } from 'src/app/models/settlement-note-payment.interface';
import { ISettlement } from 'src/app/models/settlement.interface';
import { SettlementInfoDetailPanelService } from './settlement-info-detail-panel.service';
import { MessageService } from 'primeng/api';
import { AccountMaintenanceService } from 'src/app/account-maintenance/account-maintenance.service';
import { IGrowerMaster } from 'src/app/models/grower-master.interface';
import { IGrowerAccount } from 'src/app/models/grower-account.interface';
import { IDeductionDetailRow } from './deduction-detail-row.interface';
import { IAccountType } from 'src/app/models/account-type.interface';
import { DropdownService } from 'src/app/shared/dropdown.service';
import { IGrowerBankNote } from 'src/app/models/grower-bank-note.interface';
import { IBankNoteDeductionDetail } from 'src/app/bank-note/add-bank-note/bank-note-deduction-detail.interface';
import { BankNoteListService } from 'src/app/bank-note-list/bank-note-list.service';
import { ISettlementTransferItem } from './settlement-transfer-item.interface';
import { SettlementListService } from '../settlement-list.service';
import { GrowerMasterListService } from 'src/app/account-maintenance/grower-master-list/grower-master-list.service';
import { IVwApvendorMaster } from 'src/app/models/vw-apvendor-master.interface';
import { NumericEditorComponent } from 'src/app/numeric-editor/numeric-editor.component';
import { ISettlementWithCounts } from 'src/app/models/settlement-with-counts.interface';
import {ToastService} from '../../../shared/toast.service';
import {currencyFormatter} from '../../../shared/grid-formatters/currency-formatter';

@Component({
  selector: 'app-settlement-info-detail-panel',
  templateUrl: './settlement-info-detail-panel.component.html',
  styleUrls: ['./settlement-info-detail-panel.component.css']
})
export class SettlementInfoDetailPanelComponent implements ICellRendererAngularComp, OnDestroy {
  public params: any;
  public settlement: ISettlementWithCounts;
  public relatedGrowerSettlements: ISettlement[] = [];
  public batchSettlements: ISettlementWithCounts[] = [];
  public growerList: IGrowerMaster[] = [];
  // the main groups of data
  public deductions: ISettlementDeduction[] = [];

  public deductionsLoaded: boolean = false;
  public transfers: ISettlementTransfer[] = [];
  public oldTransfers: ISettlementTransfer[] = [];
  public transfersLoaded: boolean = false;
  public bankNotePayments: ISettlementNotePayment[] = [];
  public bankNotes: IGrowerBankNote[] = [];
  public bankNotesLoaded: boolean = false;
  public grower: IGrowerMaster;
  public growerLoaded: boolean = false;
  public accounts: IGrowerAccount[] = [];
  public accountsLoaded: boolean = false;
  public accountTypes: IAccountType[] = [];
  public vendorList: IVwApvendorMaster[] = [];

  public addTransferModal: boolean = false;
  public showErrorsModal: boolean = false;


  public deductionRows: IDeductionDetailRow[] = [];
  public bankNoteRows: IBankNoteDeductionDetail[] = [];
  public transferRows: ISettlementTransferItem[] = [];
  public deductionErrorList: string[] = [];
  public bankNoteErrorList: string[] = [];
  public transferErrorList: string[] = [];
  @ViewChild('deductionGrid') deductionGrid: AgGridAngular;
  @ViewChild('noteGrid') noteGrid: AgGridAngular;
  @ViewChild('transferGrid') transferGrid: AgGridAngular;
  public deductionDomLayout = 'autoHeight';
  public noteDomLayout = 'autoHeight';
  public transferDomLayout = 'autoHeight';
  public notePage = false;
  public changesMade: boolean = false;
  public submitted: boolean = false;

  private deductionGridApi;
  private deductionGridColumnApi;

  private noteGridApi;
  private noteGridColumnApi;

  private transferGridApi;
  private transferGridColumnApi;

  private relatedSettlementGridApi;
  private relatedSettlementGridColumnApi;
  // deduction rows
  // columnDefs = [
  //   {headerName: 'Type', field: 'Type', width: 150, sortable: true, filter: true },

  //   {headerName: 'Regular', field: 'Regular', valueFormatter: this.currencyFormatter, width: 150, sortable: true, filter: true, editable: true },
  //   {headerName: 'Special', field: 'Special', valueFormatter: this.currencyFormatter, width: 150, sortable: true, filter: true },
  //   {headerName: 'Unique', field: 'Unique', valueFormatter: this.currencyFormatter, width: 150, sortable: true, filter: true },
  //   {headerName: 'Const', field: 'Const', valueFormatter: this.currencyFormatter, width: 150, sortable: true, filter: true },


  // ];

  deductionColumnDefs = [
    {headerName: 'Type', field: 'growerAccountName', width: 150, sortable: true, filter: true},
    {headerName: 'Balance', field: 'growerAccount.amountDue', width: 150, sortable: true, filter: true, valueFormatter: params => currencyFormatter(params, '0')  },
    {
      headerName: 'Original Deductions',
      children: [
        {
          headerName: 'Total',
          field: 'deduction.originalDeduction',
          valueFormatter: params => currencyFormatter(params, '0'),
          width: 150,
          sortable: true,
          filter: true,
        },
        {
          headerName: 'Interest',
          field: 'deduction.originalInterest',
          valueFormatter: this.currencyFormatterInterest,
          width: 150,
          sortable: true,
          filter: true
        },
      ]
    },
    {
      headerName: 'Adjusted Deductions',
      children: [
        {
          headerName: 'Total',
          field: 'deduction.adjustedDeduction',
          valueFormatter: params => currencyFormatter(params, '0'),
          width: 150,
          sortable: true,
          filter: true,
          cellEditor: 'numericEditor',
          cellEditorParams: {
            allowNegative: true
          },
          editable: function(params) {
            return params.data.deduction.status.trim() !== 'Posted';
          },

          // onCellValueChanged : function(params) {
          //   console.log('changed cell value');
          //   console.log(params);
          //   // ? how do i manipulate outside vars?
          // },
          // onCellValueChanged : this.adjustedTotalEdit,
          cellStyle: function(params) {
            if (params.data.deduction.status.trim() === 'Posted') {
              return null;
            } else {
              return  {
                'border': '2px solid black',
                'background-color': '#f9ffe1',
              };
            }
          }
          // ,cellEditor: 'currencyEditorCellRenderer'
        },
        {
          headerName: 'Interest',
          field: 'deduction.adjustedInterest',
          valueFormatter: this.currencyFormatterInterest,
          width: 150,
          sortable: true,
          filter: true,
          // editable: true,
          cellEditor: 'numericEditor',
          editable: function(params) {
            // return params.node.rowIndex > 0;
            return params.data.deduction.status.trim() !== 'Posted' && (params.data.growerAccountName.includes('Special') || params.data.growerAccountName.includes('Unique'));
          },
          cellStyle: function(params) {
            if (params.data.deduction.status.trim() !== 'Posted' && (params.data.growerAccountName.includes('Special') || params.data.growerAccountName.includes('Unique'))) {


              return  {
                'background-color': '#f9ffe1',

                'border': '2px solid black',
              };
            } else {
              return null;
            }
          }
          // ,cellEditor: 'currencyEditorCellRenderer'
        },
      ]
    },
  ];

  bankNoteColumnDefs = [
    {
      headerName: 'Loan #',
      field: 'bankNote.noteLoanNumber',
      width: 150,
      sortable: true,
      filter: true
    },
    {
      headerName: 'Vendor',
      field: 'vendorName',
      width: 150,
      sortable: true,
      filter: true
    },
    // vendorName
    // todo - how do we get the vendor name?
    {
      headerName: 'Original Payment',
      field: 'notePayment.originalPayment',
      valueFormatter: params => currencyFormatter(params, '0'),
      width: 150,
      sortable: true,
      filter: true,

    },
    {
      headerName: 'Adjusted',
      field: 'notePayment.adjustedPayment',
      valueFormatter: params => currencyFormatter(params, '0'),
      width: 150,
      sortable: true,
      editable: function(params) {
        return params.data.notePayment.status.trim() !== 'Posted';
      },
      cellEditor: 'numericEditor',
      filter: true,
      cellStyle: function(params) {
        if (params.data.notePayment.status.trim() === 'Posted') {
          return null;
        } else {
          return  {
            'border': '2px solid black',
            'background-color': '#f9ffe1',
          };
        }
      }
    },


  ];

  transferColumnDefs = [
    {
      headerName: 'Type',
      field: 'type',
      width: 50,
      sortable: true,
      filter: true
    },
    {
      headerName: 'From',
      field: 'fromSettlement.entity',
      width: 100,
      sortable: true,
      filter: true
    },
    {
      headerName: 'From Grower',
      field: 'fromGrower.farmName',
      width: 150,
      sortable: true,
      filter: true
    },
    {
      headerName: 'To',
      field: 'toSettlement.entity',
      width: 100,
      sortable: true,
      filter: true
    },
    {
      headerName: 'To Grower',
      field: 'toGrower.farmName',
      width: 150,
      sortable: true,
      filter: true
    },
    {
      headerName: 'Amount',
      field: 'transferModel.transferAmount',
      valueFormatter: params => currencyFormatter(params, '0'),
      width: 150,
      sortable: true,
      cellEditor: 'numericEditor',
      editable: function(params) {
        return params.data.transferModel.status.trim() !== 'Posted';
      },
      filter: true,
      cellStyle: function(params) {
        // if (parseInt(params.value.toString(), 10) > 0) {
          if (params.data.type.toString().trim() === 'To') {
          return  {
            'border': '2px solid black',
            'color': 'green',
          };
        } else {
          return  {
            'border': '2px solid black',
            'color': 'red',
          };
        }


      }
    },
  ];


  public deductionFrameworkComponents = {
    numericEditor: NumericEditorComponent,
  };
  public bankNoteFrameworkComponents = {
    numericEditor: NumericEditorComponent,
  };
  public transferFrameworkComponents = {
    numericEditor: NumericEditorComponent,
  };
  modules = AllModules;

  public visible = false;
  innerWidth: any;

  // edit settlement info form
  settlementForm: FormGroup;

  private masterGridApi;
  private masterRowIndex;

  private batchId: number;

  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private messageService: MessageService,
    private _growerService: AccountMaintenanceService,
    private _growerListService: GrowerMasterListService,
    private _dropdownService: DropdownService,
    private _bankNoteService: BankNoteListService,
    private _settlementListService: SettlementListService,
    private _settlementDetailService: SettlementInfoDetailPanelService
  ) { }

  agInit(params: any): void {
    // used pinned to only run this 1 time
    if (!!params && !!!params.pinned) { // && !!!this.params.pinned) {
      this.params = params; // has the full model
      this.settlement = params.data;
      this.innerWidth = window.innerWidth;

      this.masterGridApi = params.api;
      this.masterRowIndex = params.rowIndex;

      this.batchId = JSON.parse(sessionStorage.getItem('batchId')) as number;



      // load some "dropdowns"
      this.vendorList = JSON.parse(localStorage.getItem('APVendorList')) as IVwApvendorMaster[];
      // load growers, load batch settlements, load account types
      this.loadGrowers();



      this.loadAccountTypes();
    }

  }

  public ngOnDestroy() {
    // only bother destroying the one we're using
    if (!!this.params && this.settlement.status.trim() !== 'Posted' && !!!this.params.pinned) {
      // go ahead and submit
      // ! nevermind, we won't do this because it seems to break things
      // this.submitForm();
    }

  }

  /** validate the deductions and then compute the net grower payment */
  public deductionValueChange(event: any)  {
    // reset
    this.deductionErrorList = [];
    // validate the deductions, but first parse the data
    this.deductionRows = this.deductionRows.map(d => {
      d.deduction.adjustedDeduction = !!d.deduction.adjustedDeduction ? parseFloat(d.deduction.adjustedDeduction.toString()) : 0;
      d.deduction.adjustedInterest = !!d.deduction.adjustedInterest ? parseFloat(d.deduction.adjustedInterest.toString()) : 0;
      return d;
    });

    // validate deductions (0 <= adjusted <= original)
    // TODO: clean up after testing
    /*const deductionErrors = this.deductionRows.filter(d => d.deduction.adjustedDeduction < 0);

    if (deductionErrors.length > 0) {
      this.deductionErrorList = deductionErrors.map(e => {
        return 'Invalid adjusted deduction of ' + e.growerAccountName +
        ' - Amount must be at least $0 and at most the account\'s amount due of '
        + this.currencyFormatterSimple(e.growerAccount.amountDue);
      });
    }*/
    // validate interest
    const deductionInterestErrors = this.deductionRows.filter(d =>
      !!d.deduction.originalInterest
      && d.deduction.originalInterest > 0
      && (d.deduction.originalInterest < 0
      || d.deduction.adjustedInterest > d.deduction.originalInterest));
    if (deductionInterestErrors.length > 0) {
      this.deductionErrorList = this.deductionErrorList.concat(deductionInterestErrors.map(e => {
        return 'Invalid adjusted interest of ' + e.growerAccountName +
        ' - Amount must be at least $0 and at most the original interest of '
        + this.currencyFormatterSimple(e.deduction.originalInterest);
      }));
    }
    this.changesMade = true;
    // compute net grower
    this.computeNetGrower();
  }

  /** validate the note payments and then compute the net grower payment */
  public bankNoteValueChange(event: any) {
    // reset
    this.bankNoteErrorList = [];
    // validate
    this.bankNoteRows = this.bankNoteRows.map(bn => {
      bn.notePayment.originalPayment = !!bn.notePayment.originalPayment ? parseFloat(bn.notePayment.originalPayment.toString()) : 0;
      bn.notePayment.adjustedPayment = !!bn.notePayment.adjustedPayment ? parseFloat(bn.notePayment.adjustedPayment.toString()) : 0;
      return bn;
    });

    // validate the note payments
    const noteErrors = this.bankNoteRows.filter(bn =>
      bn.notePayment.originalPayment < 0
      || bn.notePayment.adjustedPayment < 0
      // && bn.notePayment.adjustedPayment > bn.notePayment.originalPayment
      // todo - figure out net proceeds logic here
    );

    if (noteErrors.length > 0) {
      this.bankNoteErrorList = noteErrors.map(e => {
        return 'Invalid Note Payment - ' + e.vendorName
        + ' - Amount must be greater than $0'; // and at most ' + this.currencyFormatterSimple(e.notePayment.originalPayment);
      });
    }

    this.changesMade = true;

    this.computeNetGrower();
  }

  public transferValueChange(event: any) {
    this.changesMade = true;
    this.computeNetGrower();
  }

  /** compute the net grower payment based on any updates to the above */
  public computeNetGrower() {
    let total = 0;
    // deductions
    if (this.deductionRows.length > 0) {
      total +=
        this.deductionRows.map(d => {
          // TODO: remove after testing allows negative numbers
/*          if (!!!d.deduction.adjustedDeduction) {
            d.deduction.adjustedDeduction = 0;
          }*/
          if (!!!d.deduction.adjustedInterest) {
            d.deduction.adjustedInterest = 0;
          }
          return d.deduction.adjustedDeduction + d.deduction.adjustedInterest;
        }).reduce((a, b) => a + b);
    }

    // todo - does interest also get counted?

    // bank notes
    if (this.bankNoteRows.length > 0) {
      total +=
        this.bankNoteRows.map(b => {
          if (!!!b.notePayment.adjustedPayment) {
            b.notePayment.adjustedPayment = 0;
          }
          return parseFloat(b.notePayment.adjustedPayment.toString());
        }).reduce((a, b) => a + b);
    }

    // transfers
    if (this.transferRows.length > 0) {
      total +=
        this.transferRows.map(t => {
          if (!!!t.transferModel.transferAmount) {
            t.transferModel.transferAmount = 0;
          }
          // invert if needed
          let val = parseFloat(t.transferModel.transferAmount.toString());
          if (t.type === 'To') {
            val *= -1;
          }
          return val;
        }).reduce((a, b) => a + b);
    }

    this.settlement.netGrowerPayment = this.settlement.settlementAmount - total;
  }


  /** load growers for lookups */
  public loadGrowers() {
    // tabled the caching into local storage for now
    this.growerList = JSON.parse(sessionStorage.getItem('GrowerList')) as IGrowerMaster[];
    this.loadBatchSettlements();
    // this._growerListService.getGrowersForSettlementBatch(this.batchId).subscribe(
    //   result => {
    //     this.growerList = result;
    //     this.loadBatchSettlements();
    //   }, error => {
    //     console.error(error);
    //   }
    // );


  }



  /** go ahead and load the rest of the batch's settlements */
  public loadBatchSettlements() {
    this._settlementListService
      .getSettlementsByBatchId(this.settlement.settlementBatchId)
      .subscribe(
        data => {
          try {
            this.batchSettlements = data.map(s => {
              const gmatch = this.growerList.find(g => g.id.toString() === s.growerId.toString());
              s.growerName = !!gmatch ? gmatch.farmName : 'Invalid';
              return s;
            });

            // now proceed onto the rest
            this.loadBankNotes(this.params.data.growerId);
            this.loadTransfers(this.settlement);
            this.loadOldTransfers(this.settlement);
          } catch (e) {
            console.error(e);
            this.errorToast(e);
          }
        },
        error => {
          console.error(error);
          this.errorToast(error);
        }
      );
  }

  /** load the account type dropdown list */
  private loadAccountTypes() {
    this.accountTypes = JSON.parse(sessionStorage.getItem('AccountTypes')) as IAccountType[];
    this.loadGrower(this.params.data.growerId);

  }

  /** load the grower */
  public loadGrower(id: number) {
     this.grower = this.growerList.find(g => g.id.toString() === id.toString());
     this.growerLoaded = true;
     this.loadAccounts(id);
  }

  /** load the grower accounts */
  public loadAccounts(id: number) {
    this._growerService.getGrowerAccounts(id)
    .subscribe(
      data => {
        try {
          this.accounts = data;
          this.loadDeductions(this.settlement);

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

  /** load the settlement deductions for this settlement */
  public loadDeductions(settlement: ISettlement) {

    this._settlementDetailService.getSettlementDeductions(this.settlement.id)
    .subscribe(
      data => {
        try {

          this.deductions = data;
          // transform the object

          this.deductionRows = this.deductions.map(d => {
            const acct = this.accounts.find(a => a.id.toString() === d.growerAccountId.toString());
            return {
              deduction: d,
              order: this.getAccountOrder(acct),
              growerAccountName: this.getAccountName(acct),
              growerAccount: acct,
            } as IDeductionDetailRow;
          });



          // sort the final product
          this.deductionRows = this.deductionRows.sort((a, b) => a.order - b.order);

          this.deductionsLoaded = true;

          //

          // document.querySelector('#deductionGrid').style.height = '400px';
          // if (this.deductionRows.length  > 1 && this.deductionRows.length < 5) {
          //   this.deductionGridApi.setDomLayout('autoHeight');
          //   // document.getElementById('#deductionGrid').style.height = '400px';
          //   this.deductionDomLayout = 'autoHeight';
          //   console.log('auto deduction height');
          // }
          // if (this.deductionRows.length > 5) {
          //   this.deductionDomLayout = 'normal';
          //   this.deductionGridApi.setDomLayout('normal');
          //   document.getElementById('deductionGrid').style.height = '300px';
          // }
          // now resize the grid heightwise
          // this.deductionGridApi.setDomLayout('autoHeight');
          this.deductionGridApi.sizeColumnsToFit();

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
  public loadTransfers(settlement: ISettlement) {
    this._settlementDetailService.getSettlementTransfers(this.settlement.id, 'From')
    .subscribe(
      fromData => {
        try {
          this._settlementDetailService.getSettlementTransfers(this.settlement.id, 'To')
          .subscribe(
            toData => {
              this.transfers = fromData
              // .map(t => { t.transferAmount = t.transferAmount * -1.0; return t; }) // stupid hack to invert transfers as needed
              .concat(toData);

              this.transferRows = this.transfers.map(t => {

              const toSettle = this.batchSettlements.find(s => s.id === t.toSettlementId);
              const fromSettle = this.batchSettlements.find(s => s.id === t.fromSettlementId);
              // must get both settlements
              const row = {
                transferModel: t,
                type: t.fromSettlementId === this.settlement.id ? 'From' : 'To',
                toSettlement: toSettle,
                fromSettlement: fromSettle,
                toGrower: this.growerList.find(g => g.id === toSettle.growerId),
                fromGrower: this.growerList.find(g => g.id === fromSettle.growerId),
              } as ISettlementTransferItem;



              return row;
            });


            // if (this.transferRows.length > 5) {
            //   this.transferDomLayout = 'normal';
            //   this.transferGridApi.setDomLayout('normal');
            //   document.getElementById('transferGrid').style.height = '300px';
            // }
            // if (this.transferRows.length  > 1 && this.transferRows.length < 5) {
            //   this.transferGridApi.setDomLayout('autoHeight');
            //   document.querySelector('#transferGrid').setAttribute('style', '');
            //   this.transferDomLayout = 'autoHeight';
            //   console.log('auto transfer height');
            // }
            this.transfersLoaded = true;
            this.transferGridApi.sizeColumnsToFit();

            }, error => {

              console.error(error);
            }
          );



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

  /** save a secondary copy of transfers to compare for updates */
  public loadOldTransfers(settlement: ISettlement) {
    this._settlementDetailService.getSettlementTransfers(this.settlement.id, 'From')
    .subscribe(
      fromData => {
        try {
          this._settlementDetailService.getSettlementTransfers(this.settlement.id, 'To')
          .subscribe(
            toData => {
              this.oldTransfers = fromData
              // .map(t => { t.transferAmount = t.transferAmount * -1.0; return t; }) // stupid hack to invert transfers as needed
              .concat(toData);


            }, error => {

              console.error(error);
            }
          );



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

  public loadBankNotePayments(settlement: ISettlement) {
    this._settlementDetailService.getSettlementBankNotes(settlement.id)
    .subscribe(
      data => {
        try {
          this.bankNotePayments = data;
          this.bankNoteRows = data.map(bn => {
            const noteMatch = this.bankNotes.find(b => b.id.toString() === bn.bankNoteId.toString());
            const vendorMatch = this.vendorList.find(v => v.vnumb.toString() === noteMatch.noteVendorNumber.toString());
            return {
              bankNote: noteMatch,
              notePayment: bn,
              vendorName: !!vendorMatch ? vendorMatch.vnumb + ' - ' + vendorMatch.vname : 'Invalid',
            } as IBankNoteDeductionDetail;
          });


          this.bankNotesLoaded = true;
          this.visible = true;


          // is this.params.api the parent grid?
          // this.params.node.rowHeight =


          // ! note- this froze the page up
          // this.params.node.rowHeight = 700;
          this.params.api.gridOptionsWrapper.gridOptions.detailRowHeight = 700;

          this.noteGridApi.sizeColumnsToFit();
          this.deductionGridApi.sizeColumnsToFit();

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

  public loadBankNotes(id: number) {
    // this._settlementDetailService.getSettlementBankNotes(this.settlement.id)
    this._bankNoteService.getBankNotesByGrowerId(id)
    .subscribe(
      data => {
        try {
          this.bankNotes = data;
          this.loadBankNotePayments(this.settlement);

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



  public submitForm() {
    if (!this.changesMade || this.submitted || !!!this.deductionRows) {
      return;
    } else {
      this.submitted = true;
      const errors = [];
      let valid = true;
      // validate the deductions to make sure they meet the required rules
      // 1. payout >= $10


        // deductions
      this.deductionRows = this.deductionRows.map(d => {
        d.deduction.adjustedDeduction = !!d.deduction.adjustedDeduction ? parseFloat(d.deduction.adjustedDeduction.toString()) : 0;
        d.deduction.adjustedInterest = !!d.deduction.adjustedInterest ? parseFloat(d.deduction.adjustedInterest.toString()) : 0;
        return d;
      });
      const deductions = this.deductionRows.map(d => {
        return d.deduction;
      });

      // validate deductions (0 <= adjusted <= original)
      // TODO: clean up after testing
      /*const deductionErrors = this.deductionRows.filter(d => d.deduction.adjustedDeduction < 0);

      if (deductionErrors.length > 0) {
        this.deductionErrorList = deductionErrors.map(e => {
          return 'Invalid adjusted deduction of ' + e.growerAccountName +
          ' - Amount must be at least $0 and at most the account\'s balance of '
          + this.currencyFormatterSimple(e.growerAccount.amountDue);
        });

        valid = false;
      }*/

      const deductionInterestErrors = this.deductionRows.filter(d =>
        !!d.deduction.originalInterest
        && d.deduction.originalInterest > 0
        && (d.deduction.originalInterest < 0
        || d.deduction.adjustedInterest > d.deduction.originalInterest));
      if (deductionInterestErrors.length > 0) {
        this.deductionErrorList = this.deductionErrorList.concat(deductionInterestErrors.map(e => {
          return 'Invalid adjusted interest of ' + e.growerAccountName +
          ' - Amount must be at least $0 and at most the original interest of '
          + this.currencyFormatterSimple(e.deduction.originalInterest);
        }));
        valid = false;
      }

      if (valid) {
        this._settlementDetailService
        .postSettlementDeductions(deductions)
        .subscribe(
          data => {
            try {
              if (data.statusCode !== 200) {
                errors.push('Failed Settlement Deduction - ' + data.errors);
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

      // note payments
      if (this.bankNoteRows.length > 0) {
        this.bankNoteRows = this.bankNoteRows.map(bn => {
          bn.notePayment.originalPayment = !!bn.notePayment.originalPayment ? parseFloat(bn.notePayment.originalPayment.toString()) : 0;
          bn.notePayment.adjustedPayment = !!bn.notePayment.adjustedPayment ? parseFloat(bn.notePayment.adjustedPayment.toString()) : 0;
          return bn;
        });
        const payments = this.bankNoteRows.map(bn => {
          return bn.notePayment;
        });


        // validate the note payments
        const noteErrors = this.bankNoteRows.filter(bn =>
          bn.notePayment.originalPayment < 0
        || bn.notePayment.adjustedPayment < 0
          // && bn.notePayment.adjustedPayment > bn.notePayment.originalPayment
          // todo - net proceeds
        );

        if (noteErrors.length > 0) {
          valid = false;
          this.bankNoteErrorList = noteErrors.map(e => {
            return 'Invalid Note Payment - ' + e.vendorName
            + ' - Amount must be greater than $0'; // and at most ' + this.currencyFormatterSimple(e.notePayment.originalPayment);
            // todo- net proceeds
          });
        }

        if (valid) {
          this._settlementDetailService
          .postSettlementNotePayments(payments)
          .subscribe(
            data => {
              try {
                if (data.statusCode !== 200) {
                  errors.push('Failed Settlement Bank Note - ' + data.errors);
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

      }


      // transfers

      if (this.transferRows.length > 0) {
        this.transferRows = this.transferRows.map(t => {
          t.transferModel.transferAmount = !!t.transferModel.transferAmount ? parseFloat(t.transferModel.transferAmount.toString()) : 0;

          return t;
        });
        const transfers = this.transferRows.map(t => {
          return t.transferModel;
        });

        // todo - validate against what?

        // todo - update the master records that aren't this one for net payment

        if (valid) {
          this._settlementDetailService
          .postSettlementTransfers(transfers)
          .subscribe(
            data => {
              try {
                if (data.statusCode !== 200) {
                  errors.push('Failed Transfers- ' + data.errors);
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
// 11021
      }


      // print out success/error message as needed
      if (valid && errors.length === 0) {
        // have to update the settlement itself
        const updateItem = this.params.data as ISettlementWithCounts;
        updateItem.netGrowerPayment = updateItem.settlementAmount;

        // get deduction totals
        const deductionTotal = deductions.map(d => {
          return (!!d.adjustedDeduction ? d.adjustedDeduction : 0)
          + (!!d.adjustedInterest ? d.adjustedInterest : 0);
        }).reduce((a, b) => a + b);

        updateItem.netGrowerPayment -= deductionTotal;

        // get note payment totals
        if (this.bankNoteRows.length > 0) {
          const payments = this.bankNoteRows.map(bn => {
            return bn.notePayment;
          });

          const paymentTotal = payments.map(p => {
            return !!p.adjustedPayment ? p.adjustedPayment : 0;
          }).reduce((a, b) => a + b);

          updateItem.netGrowerPayment -= paymentTotal;
        }

        // get transfer totals
        if (this.transferRows.length > 0) {
          const transferTotal = this.transferRows.map(t => {
            let val = parseFloat(t.transferModel.transferAmount.toString());
            if (t.type === 'To') {
              val *= -1;
            }
            return val;
          }).reduce((a, b) => a + b);

          updateItem.netGrowerPayment -= transferTotal;

          // have to update each other settlement accordingly-

          const transferUpdateList = this.transferRows.map(row => {
            // first pick which settlement to update
            const settlementToUpdate = row.type === 'From' ? row.toSettlement : row.fromSettlement;
            // invert it because it is the opposite end of the one we're editing

            // figure out the new difference, which is the difference in the transfer amount
            const oldTransfer = this.oldTransfers.find(t => t.id.toString() === row.transferModel.id.toString());
            let difference = 0;
            if (row.type === 'From') {
              // means we are updating the to settlement, so we add the difference
              difference = row.transferModel.transferAmount - oldTransfer.transferAmount;
            } else {
              difference = oldTransfer.transferAmount - row.transferModel.transferAmount;
            }
            settlementToUpdate.netGrowerPayment += difference;
            // convert it so we can post
            const convertSettlement = this.convertSettlement(settlementToUpdate);
            this._settlementListService.postSettlement(convertSettlement).subscribe(result => {
            }, error => {
              console.error(error);
            });




            this.params.api.forEachNode((node, index) => {

              // node.data.id;
              if (node.data.entity.toString() === settlementToUpdate.entity) {
                node.setData(settlementToUpdate);
                // node.data.netGrowerPayment = settlementToUpdate.netGrowerPayment;
                // updateNode = node;
              }
            });
            return settlementToUpdate;
          });
          // reflect in the parent grid

          // if (!!transferUpdateList && transferUpdateList.length > 0) {
          //   this.params.api.updateRowData({ update: transferUpdateList });
          // }
          // type: t.fromSettlementId === this.settlement.id ? 'From' : 'To',
        }

        // update settlement itself then the grid
        const settlement = this.convertSettlement(this.settlement);
        settlement.netGrowerPayment = updateItem.netGrowerPayment;


        this._settlementListService.postSettlement(settlement).subscribe(
          settlementResult => {
            if (settlementResult.statusCode === 200) {
              const updatelist = [];
              updatelist.push(updateItem);
              this.params.api.updateRowData({ update: updatelist });
              this.submitted = false;

              this.settlement.netGrowerPayment = settlement.netGrowerPayment;
              this.loadOldTransfers(this.settlement);
              this.successToast('You have successfully saved your changes');
              // this.changesMade = false;
              // is there a way to close the tab?
            } else {
              this.submitted = false;
              this.errorToast('Errors occured while submitting your changes. Please try again after fixing any issues.');
            }

        }, error => {
          console.error(error);
          this.submitted = false;
          this.errorToast('Errors occured while submitting your changes. Please try again after fixing any issues.');
        });


      } else {
        console.error(errors);
        this.submitted = false;
        // no errors = success
        this.errorToast('Errors occured while submitting your changes. Please try again after fixing any issues.');
      }

    }





  }

  /** conversion helper */
  public convertSettlement(settlement: ISettlementWithCounts): ISettlement {
    return {
      id: settlement.id,
      growerId: settlement.growerId,
      growerName: settlement.growerName,
      entity: settlement.entity,
      settlementAmount: settlement.settlementAmount,
      dozenEggs: settlement.dozenEggs,
      netGrowerPayment: settlement.netGrowerPayment,
      settlementDate: settlement.settlementDate,
      statementDate: settlement.statementDate,
      status: settlement.status,
      message: settlement.message,
      groupCode: settlement.groupCode,
      settlementBatchId: settlement.settlementBatchId,
    } as ISettlement;
  }

  // Cleanup: remove dead code after testing
  /*public onSettlementSelectionChanged(event: any) {
  }*/


  refresh(params: any): boolean {
      if (!!this.params) {
        params.api.refreshCells({
          force: true // this updates the whole column, not only the clicked cell
        });
      }
      return true;
  }

  public currencyFormatterInterest(params: any) {
    if (!params.value) {
      return params.data.growerAccountName.includes('Special')
          || params.data.growerAccountName.includes('Unique')
          ? '0' : 'N/A';
    }
    // return (params.data.growerAccountName.includes('Special') || params.data.growerAccountName.includes('Unique'));

    const usdFormate = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    });
    return usdFormate.format(params.value);
  }

  public currencyFormatterSimple(params: number) {
    if (!params) {
      return 'N/A';
    }
    const usdFormate = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    });
    return usdFormate.format(params);
  }

  onDeductionGridReady(params) {
    if (!!this.params) {
      this.deductionGridApi = params.api;
    this.deductionGridColumnApi = params.columnApi;
    // resize the cols
    this.deductionGridApi.sizeColumnsToFit();
    }

  }

  onBankNoteGridReady(params) {
    if (!!this.params) {
      this.noteGridApi = params.api;
      this.noteGridColumnApi = params.columnApi;
      // this.noteGridApi.setDomLayout('autoHeight');
      // resize the cols
      this.noteGridApi.sizeColumnsToFit();
    }


  }

  onTransferGridReady(params) {
    if (!!this.params) {
      this.transferGridApi = params.api;
      this.transferGridColumnApi = params.columnApi;
      // resize the cols
      this.transferGridApi.sizeColumnsToFit();
    }


  }

  onRelatedSettlementGridReady(params) {
    this.relatedSettlementGridApi = params.api;
    this.relatedSettlementGridColumnApi = params.columnApi;
    // resize the cols
    this.relatedSettlementGridApi.sizeColumnsToFit();

  }

  public transferTypeFormatter(params: any) {
    // console.log(params);
    return 'type';
  }


  /** helper to generate account mae */
  private getAccountName(account: IGrowerAccount): string {
    const type = this.accountTypes.find(t => t.id.toString() === account.accountType.toString());
    return account.accountSuffix.toUpperCase() === 'A' ? type.accountType : type.accountType + ' - ' + account.accountSuffix;
  }

  /** helper to determine the order of the account for the deductions */
  private getAccountOrder(account: IGrowerAccount): number {
    // console.log(account);
    // get the account
    const type = this.accountTypes.find(t => t.id.toString() === account.accountType.toString());
    // our logic is use a base number for each account type, then incrememnt for each account
    /*
      Construction - 0
      Unique - 100
      Special - 200
      Regular - 300
    */
    let order = 0;
    // todo - construction is used when remaining number of flocks is greater than 0
    switch (type.accountType) {
      case 'Regular':
        order = 300;
        break;
      case 'Unique':
        order = 100;
        break;
      case 'Special':
        order = 200;
        break;
      default:
        order = 0;
    }

    // now we have the base, now to offset by the account suffix
    // a = 97, and so on
    order += account.accountSuffix.toLowerCase().charCodeAt(0) - 97;

    // now we are done
    return order;
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


}
