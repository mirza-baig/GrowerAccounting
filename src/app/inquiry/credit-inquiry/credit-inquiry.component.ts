import { Component, OnInit, HostListener } from '@angular/core';
import { IGrowerMaster } from 'src/app/models/grower-master.interface';
import { ICreditInquiryVM } from 'src/app/models/credit-inquiry-vm.interface';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { CreditInquiryService } from './credit-inquiry.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { IVwApvendorMaster } from 'src/app/models/vw-apvendor-master.interface';
import { IAccountType } from 'src/app/models/account-type.interface';
import { UtilityService } from 'src/app/shared/utility.service';
import { DropdownService } from 'src/app/shared/dropdown.service';
import { ICreditInquiryAccountTotal } from './credit-inquiry-account-total.interface';
import { ISettlementNotePaymentVM } from 'src/app/models/settlement-note-payment-vm.interface';
import * as moment from 'moment';
import { ISettlementSelection } from './settlement-selection.interface';
import { ISettlement } from 'src/app/models/settlement.interface';
import {currencyFormatter} from '../../shared/grid-formatters/currency-formatter';
import {dateFormatter} from '../../shared/grid-formatters/date-formatter';

@Component({
  selector: 'app-credit-inquiry',
  templateUrl: './credit-inquiry.component.html',
  styleUrls: ['./credit-inquiry.component.css']
})
export class CreditInquiryComponent implements OnInit {
  pageTitle = 'Grower Credit Inquiry';
  moduleTitle = 'Account Maintenance';
  innerWidth: number;
  innerHeight: number;
  public id: number;

  // models
  public grower: IGrowerMaster;
  public creditInquiry: ICreditInquiryVM;
  public settlements: ISettlement[] = [];
  public settlement: ISettlement;

  // flags
  public growerSelected: boolean = false;

  public settlementSelected: boolean = false;
  public settlementsLoaded: boolean = false;

  public creditInquiryLoaded: boolean = false;

  // account grid
  private accountGridApi;
  private accountGridColumnApi;
  private accountGridColumnDefs = [
    {
      headerName: '',
      field: 'type',
      width: 300,
      sortable: true,
      filter: true,
      filterParams: {
        debounceMs: 0,
      },
      cellStyle: function(params) {
        if (params.data.type === 'Balance') {
          return  {
            'font-weight': 'bold',
          };
        } else {
          return null;
        }
      }
    },
    {
      headerName: 'Construction',
      field: 'construction',
      valueFormatter: params => currencyFormatter(params, '$0'),
      width: 300,
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        debounceMs: 0,
      },
      cellStyle: function(params) {
        if (params.data.type === 'Balance') {
          return  {
            'font-weight': 'bold',
          };
        } else {
          return null;
        }
      }
    },
    {
      headerName: 'Regular',
      field: 'regular',
      valueFormatter: params => currencyFormatter(params, '$0'),
      width: 300,
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        debounceMs: 0,
      },
      cellStyle: function(params) {
        if (params.data.type === 'Balance') {
          return  {
            'font-weight': 'bold',
          };
        } else {
          return null;
        }
      }
    },
    {
      headerName: 'Special',
      field: 'special',
      valueFormatter: params => currencyFormatter(params, '$0'),
      width: 300,
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        debounceMs: 0,
      },
      cellStyle: function(params) {
        if ( params.data.type === 'Balance') {
          return  {
            'font-weight': 'bold',
          };
        } else {
          return null;
        }
      }
    },
    {
      headerName: 'Unique',
      field: 'unique',
      valueFormatter: params => currencyFormatter(params, '$0'),
      width: 300,
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        debounceMs: 0,
      },
      cellStyle: function(params) {
        if (params.data.type === 'Balance') {
          return  {
            'font-weight': 'bold',
          };
        } else {
          return null;
        }
      }
    },
  ];
  private accountRowData: ICreditInquiryAccountTotal[] = [];

  // note payment grid
  private noteGridApi;
  private noteGridColumnApi;
  private noteGridColumnDefs = [
    {
      headerName: 'Note',
      field: 'growerBankNote.noteType',
      width: 300,
      sortable: true,
      filter: true,
      filterParams: {
        debounceMs: 0,
      }
    },
    {
      headerName: 'Payment Schedule',
      field: 'growerBankNote.noteNetProceeds',
      width: 300,
      sortable: true,
      filter: true,
      filterParams: {
        debounceMs: 0,
      }
    },
    {
      headerName: 'Vendor',
      field: 'growerBankNote.noteVendorName',
      width: 600,
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      },
    },
    {
      // todo - is this the settlement date?
      headerName: 'Due',
      field: 'settlementDate',
      width: 300,
      sortable: true,
      valueFormatter: dateFormatter,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      },
    },

    {
      headerName: 'Payment',
      field: 'adjustedPayment',
      valueFormatter: params => currencyFormatter(params, '$0'),
      width: 300,
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        debounceMs: 0,
      }
    },
    {
      headerName: 'Dozen Eggs',
      field: 'growerBankNote.notePaymentCentsDoz',
      valueFormatter: params => currencyFormatter(params, '$0'),
      width: 300,
      sortable: true,
      hide: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        debounceMs: 0,
      }
    },

  ];
  public notePayments: ISettlementNotePaymentVM[] = [];




  modules = AllModules;

  // dropdowns
  accountTypes: IAccountType[] = [];
  vendorList: IVwApvendorMaster[] = [];


  constructor(
    private messageService: MessageService,
    private _route: ActivatedRoute,
    private _dropdownService: DropdownService,
    private _router: Router,
    private _creditService: CreditInquiryService,
  ) { }

  ngOnInit() {
    // set dims
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

    // parse the URL
    this._route.queryParams.subscribe(params => {
      this.id = parseInt(params['id'], 10);
    });

    // since the call takes 10 seconds, we just cached it on app init and retrieve it from there
    this.vendorList = JSON.parse(localStorage.getItem('APVendorList')) as IVwApvendorMaster[];

    this.loadAccountTypes();

  }

  /** load the account type dropdown list */
  private loadAccountTypes() {
    this._dropdownService
    .getAccountTypes()
    .subscribe(
      data => {
        try {
          this.accountTypes = data;
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

  /** grower selection event */
  public onGrowerSelected(event: IGrowerMaster) {
    this.settlement = null;
    this.settlementSelected = false;
    if (!!event) {
      this.grower = event;
      this.loadSettlements(this.grower.id);
    } else {
      this.grower = null;
      this.settlements = null;
      this.settlementsLoaded = false;
      this.creditInquiryLoaded = false;
    }
  }

  /** get the settlements */
  private loadSettlements(id: number) {
    this.settlementsLoaded = false;
    this._creditService.getSettlementsByGrowerId(id).subscribe(
      result => {
        this.settlements = result;
        // todo - filter out non posted settlements!?!?
        this.settlementsLoaded = true;
      }, error => {
        console.error(error);
        this.errorToast(error);
      }
    );
  }

  public onSettlementSelected(event: ISettlement) {
    if (!!event) {
      this.settlement = event;
      this.loadCreditInquiry(this.settlement.id);
    } else {
      this.settlement = null;
      this.creditInquiryLoaded = false;
    }
  }

  /** load the credit inquiry for the selected grower */
  public loadCreditInquiry(id: number) {
    this.creditInquiryLoaded = false;
    this.accountRowData = [];
    this.notePayments = [];
    this._creditService.getCreditInquiry(id).subscribe(
      result => {
        this.creditInquiry = result;

        // map the farm type
        switch (this.creditInquiry.growerMaster.farmType.toString()) {
          case 'B':
          case '1':
            this.creditInquiry.growerMaster.farmType = 'Broiler';
            break;
          case 'H':
          case '2':
            this.creditInquiry.growerMaster.farmType = 'Breeder';
            break;
          case 'M':
          case '3':
            this.creditInquiry.growerMaster.farmType = 'Misc';
            break;
          case '4':
            this.creditInquiry.growerMaster.farmType = 'Corporate';
            break;
          default:
            this.creditInquiry.growerMaster.farmType = 'Invalid';
            break;
        }

        // now we have to transpose the data, so we gotta do some manipulation
        const regular = result.growerAccounts.find(a => a.accountType.toString() === '1');
        const construction = result.growerAccounts.find(a => a.accountType.toString() === '2');
        const special = result.growerAccounts.find(a => a.accountType.toString() === '3');
        const unique = result.growerAccounts.find(a => a.accountType.toString() === '4');

        // balance fwd
        this.accountRowData.push({
          type: 'Balance Forward',
          regular: regular.balanceForward,
          construction: construction.balanceForward,
          special: special.balanceForward,
          unique: unique.balanceForward,
        } as ICreditInquiryAccountTotal);

        // charges
        this.accountRowData.push({
          type: 'Charges',
          regular: regular.currentCharges,
          construction: construction.currentCharges,
          special: special.currentCharges,
          unique: unique.currentCharges,
        } as ICreditInquiryAccountTotal);

         // credit
         this.accountRowData.push({
          type: 'Credit',
          regular: regular.currentCredits,
          construction: construction.currentCredits,
          special: special.currentCredits,
          unique: unique.currentCredits,
        } as ICreditInquiryAccountTotal);

        // todo - figure out the logic for this
        // balance
        this.accountRowData.push({
          type: 'Balance',
          regular: regular.balanceForward + regular.currentCharges + regular.currentCredits,
          construction: construction.balanceForward + construction.currentCharges + construction.currentCredits,
          special: special.balanceForward + special.currentCharges + special.currentCredits,
          unique: unique.balanceForward + unique.currentCredits + unique.currentCharges,
        } as ICreditInquiryAccountTotal);

        if (!!this.creditInquiry.settlementNotePaymentVMs && this.creditInquiry.settlementNotePaymentVMs.length > 0) {
          this.notePayments = this.creditInquiry.settlementNotePaymentVMs.map(p => {
            const vendor = this.vendorList.find(v => v.vnumb.toString() === p.growerBankNote.noteVendorNumber.toString());
            p.growerBankNote.noteVendorName = !!vendor ? vendor.vnumb.toString().trim() + ' - ' + vendor.vname.trim() : 'Invalid';
            if (!!p.growerBankNote.noteNetProceeds) {
              p.growerBankNote.noteNetProceeds = '';
            }
            switch (p.growerBankNote.noteNetProceeds) {
              case '':
                p.growerBankNote.noteNetProceeds = 'N/A';
                break;
              case 'N':
                p.growerBankNote.noteNetProceeds = 'Net Proceeds';
                break;
              case 'G':
                p.growerBankNote.noteNetProceeds = 'Gross Proceeds';
                break;
            }
            p.settlementDate = new Date();
            return p;
          });
        }

        this.creditInquiryLoaded = true;
      },
      error => {
        console.error(error);
        this.errorToast(error);
        this.creditInquiryLoaded = true;
      }
    );
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

  onAccountGridReady(params) {
    this.accountGridApi = params.api;
    this.accountGridColumnApi = params.columnApi;

    this.accountGridApi.sizeColumnsToFit();
  }

  onNotePaymentGridReady(params) {
    this.noteGridApi = params.api;
    this.noteGridColumnApi = params.columnApi;

    this.noteGridColumnApi.setColumnVisible('growerBankNote.notePaymentCentsDoz', this.creditInquiry.growerMaster.farmType === 'Breeder');

    this.noteGridApi.sizeColumnsToFit();
  }




}

// 18651 is a good idea
