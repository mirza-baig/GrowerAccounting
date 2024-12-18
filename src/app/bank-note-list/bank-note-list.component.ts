import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BankNoteListService } from './bank-note-list.service';
import { DropdownService } from '../shared/dropdown.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from '@ag-grid-community/angular';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { IGrowerMaster } from '../models/grower-master.interface';
import { IGrowerMasterVM } from '../models/grower-master.vm.interface';
import { GrowerMasterListService } from '../account-maintenance/grower-master-list/grower-master-list.service';
import { IGrowerBankNote } from '../models/grower-bank-note.interface';
import { BankNoteActionButtonsComponent } from './bank-note-action-buttons/bank-note-action-buttons.component';
import {currencyFormatter} from '../shared/grid-formatters/currency-formatter';

@Component({
  selector: 'app-bank-note-list',
  templateUrl: './bank-note-list.component.html',
  styleUrls: ['./bank-note-list.component.css']
})
export class BankNoteListComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;

  pageTitle = 'Grower Bank Notes';
  moduleTitle = 'Bank Note';
  innerWidth: number;
  innerHeight: number;
  id: number;
  startId: number = 0;
  panelReady: boolean = false;

  // grid vars
  modules = AllModules;
  public frameworkComponents = {
    actionsTransactionRenderer: BankNoteActionButtonsComponent
  };
  public gridApi;
  public gridColumnApi;
  bankNotesLoaded: boolean = false;
  bankNotes: IGrowerBankNote[] = [];
  columnDefs = [
    {
      headerName: 'Loan #',
      field: 'noteLoanNumber',
      sortable: true,
      width: 150,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      }
    },
    {
      headerName: 'Vendor #',
      field: 'noteVendorNumber',
      width: 150,
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      }
    },
    {
      headerName: 'Type',
      field: 'noteType',
      width: 150,
      // valueFormatter: function(params) {
      //   return params.value.toString() === 'E' ? 'Breeder' : 'Broiler';
      // },
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        debounceMs: 0,
        caseSensitive: false,
      }
    },
    {
      headerName: 'Payment Amount',
      field: 'notePaymentAmount',
      width: 150,
      sortable: true,
      valueFormatter: currencyFormatter,
      filter: 'agNumberColumnFilter',
      filterParams: {
        applyButton: true,
        resetButton: true
      }
    },
    {
      headerName: 'Payment Cents per dozen',
      field: 'notePaymentCentsDoz',
      width: 150,
      sortable: true,
      valueFormatter: this.currencyFormatterFour,
      filter: 'agNumberColumnFilter',
      filterParams: {
        applyButton: true,
        resetButton: true
      }
    },
    // {
    //   headerName: 'Rem. Balance',
    //   field: 'remainingBalance',
    //   width: 80,
    //   sortable: true,
    //   valueFormatter: this.currencyFormatter,
    //   filter: 'agNumberColumnFilter',
    //   filterParams: {
    //     applyButton: true,
    //     resetButton: true
    //   }
    // },
    {
      headerName: 'Actions',
      field: 'id',
      width: 300,
      cellRenderer: 'actionsTransactionRenderer'
    },
    // actionsTransactionRenderer
    // todo - columns
  ];


  // grower list items
  growerList: IGrowerMaster[] = [];
  growerListLoaded: boolean = false;
  growerSearchForm: FormGroup;
  growerSelected: IGrowerMaster;
  growerIsSelected: boolean = false;


  constructor(
    private messageService: MessageService,
    private _bankNoteListService: BankNoteListService,
    private _growerService: GrowerMasterListService,
    private _dropdownService: DropdownService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _http: HttpClient,
  ) { }

  ngOnInit() {
    // set dims
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

    // parse the URL
    this._route.queryParams.subscribe(params => {
      this.id = params['Id'] as number;
    });

    if (!!this.id) {
      this.startId = this.id;
    }
    this.panelReady = true;


    // get the grower list
    this.loadGrowers();
  }

  /***************************************************
   * Grower Master
   **************************************************/

  public loadGrowers() {
    this._growerService
    .getGrowers(true)
    .subscribe(
      data => {
        try {
          this.growerList = data;
          // then build the form

          this.loadGrowerForm();
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

  /** build the form to select a grower for notes */
  public loadGrowerForm() {
    this.growerSearchForm = this._formBuilder.group({
      Grower: new FormControl({
        value: 0
      }, [ Validators.required])});

    // if there's an id passed in, preset the value
    if (!!this.id) {
      this.growerIsSelected = true;
      this.growerSelected = this.growerList.find(i => i.id.toString() === this.id.toString());
      this.growerSearchForm.patchValue({Grower: parseInt(this.id.toString(), 10) });
      // this.startId = this.id;
      this.selectGrower();
    }
    this.growerListLoaded = true;
  }

  public onGrowerSelected(event: any) {

    if (!!!event) {
       // todo ? event is null, reset ?
       this.growerSelected = event;
      this.growerIsSelected = false;
    } else {
      this.growerSelected = event;
      this.growerIsSelected = true;
      this._bankNoteListService
       .getBankNotesByGrowerId(this.growerSelected.id)
       .subscribe(
         data => {
           try {
             this.bankNotes = data.map(bn => {
               bn.noteType = bn.noteType  === 'E' ? 'Breeder' : 'Broiler';
               return bn;
             });
             // then build the form
             this.bankNotesLoaded = true;
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
  }


  /** selection event for the grower to load the bank notes */
  public selectGrower() {
    // save some info
    const growerId = this.growerSearchForm.value.Grower;
    this.growerSelected = this.growerList.find(g => g.id.toString() === growerId.toString());
    this.growerIsSelected = true;

    // get the bank notes
    this._bankNoteListService
    .getBankNotesByGrowerId(growerId)
    .subscribe(
      data => {
        try {
          this.bankNotes = data.map(bn => {
            bn.noteType = bn.noteType  === 'E' ? 'Breeder' : 'Broiler';
            return bn;
          });
          // then build the form
          this.bankNotesLoaded = true;
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

  public addNewBankNote() {
    this._router.navigateByUrl(
      'AddBankNoteComponent?GrowerId=' + this.growerSelected.id
    );
    return;
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

  public currencyFormatterFour(params: any) {
    const usdFormate = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 4
    });
    return usdFormate.format(params.value);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // resize the cols
    this.gridApi.sizeColumnsToFit();

  }

}
