import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { fade, slide } from 'src/fieldale-animations';
import { AccountMaintenanceService } from './account-maintenance.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import {AllModules} from '@ag-grid-enterprise/all-modules';
import { AgGridAngular } from '@ag-grid-community/angular';
import { EditAccountButtonComponent } from './edit-account-button/edit-account-button.component';
import { IGrowerMaster } from '../models/grower-master.interface';
import { EditGrowerMasterService } from './edit-grower-master/edit-grower-master.service';
import { DropdownService } from '../shared/dropdown.service';
import { IAccountType } from '../models/account-type.interface';
import { UtilityService } from '../shared/utility.service';
import { IGrowerAccountPost } from '../models/grower-account-post.interface';
import {currencyFormatter} from '../shared/grid-formatters/currency-formatter';

@Component({
  selector: 'app-account-maintenance',
  templateUrl: './account-maintenance.component.html',
  styleUrls: ['./account-maintenance.component.css'],
  animations: [fade, slide]
})
export class AccountMaintenanceComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;

  pageTitle = 'Grower Account Maintenance';
  moduleTitle = 'Account Maintenance';
  public id: number;

  // main account vars
  public grower: IGrowerMaster;
  loadingAccount = true;
  dateOpened: Date; // todo
  totalARBalance: number; // todo
  lastSettlementDate: Date; // todo
  totalYTDInterestCharged: number; // todo
  lastStatementDate: Date; // todo
  totalYTDInterestPaid: number; // todo

  private gridApi;
  private gridColumnApi;

  // tslint:disable-next-line:naming-convention
  CommentsForm: FormGroup;

  /*
Id: 1,
      AccountType: 'Construction',
      AccountSuffix: 'A',
      BeginYearBalance: 0,
      DateOpened: new Date('7/11/2008'),
  */
  // grid vars
  columnDefs = [


    {
      headerName: 'Account Type',
      // valueFormatter: this.accountTypeFormatter,
      field: 'accountType',
      width: 300,
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Suffix',
      field: 'accountSuffix',
      width: 100,
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Balance Fwd',
      valueFormatter: currencyFormatter,
      field: 'balanceForward',
      width: 300,
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        debounceMs: 0,
      }
    },
    {
      headerName: 'Amount Due',
      valueFormatter: currencyFormatter,
      field: 'amountDue',
      width: 300,
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        debounceMs: 0,
      }
    },
    {
      headerName: 'Edit',
      cellRenderer: 'editAccountRenderer',
      field: 'id',
      width: 150,
      sortable: false,
      filter: false
    }
  ];

  modules = AllModules;


  // adding new accounts
  addNewAccountModal: boolean = false;
  newAccountForm: FormGroup;
  newAccountFormLoaded: boolean = true;
  newAccountFormSelected = false;



  innerWidth: number;
  innerHeight: number;
  public frameworkComponents = {
    editAccountRenderer: EditAccountButtonComponent
  };

  accountTypes: IAccountType[] = [];
  lockSettlements: boolean = true;

  constructor(
    private messageService: MessageService,
    private _accountService: AccountMaintenanceService,
    private _editGrowerService: EditGrowerMasterService,
    private _utilityService: DropdownService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _utilityService2: UtilityService
  ) { }

  ngOnInit() {
    // set width
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

    // parse the URL?
    this._route.queryParams.subscribe(params => {
      this.id = params['id'];
    });

    this.getLockStatus();

    // build the form for adding a new account
    this.buildAccountForm();

    this.loadAccountTypes();



  }

  /** Check to see if the site needs to be locked down */
  public getLockStatus() {
    this._utilityService2
      .isSettlementInProcess()
      .subscribe(
        data => {
          try {
            this.lockSettlements = data;
          } catch (e) {
            console.error(e);
          }
        },
        error => {
          console.error(error);
        }
      );
  }

  /** get the account type string for cell format */
  public accountTypeFormatter(params: any) {
    // ! how do we handle this with it being delayed data?
    switch (params.value.toString()) {
      case '1':
        return 'Regular';
      case '2':
        return 'Construction';
      case '3':
        return 'Special';
      case '4':
        return 'Unique';
      case '5':
        return 'Miscellaneous';
    }
    return 'Invalid';
  }


  /** Return back to the main grower master list */
  public backToHome() {
    this._router.navigateByUrl(
      'GrowerMasterListComponent'
    );
    return;
  }

  /** Go to transfer funds page */
  public goToTransfer() {
    this._router.navigateByUrl(
      'AccountTransferComponent?Id=' + this.id
    );
    return;
  }



  /** Loads the grower data into the model */
  private loadGrower(id: number) {
    this._accountService
    .getGrowerMaster(id)
    .subscribe(
      data => {
        try {
          this.grower = data;
          this.grower.status = this.grower.status.trim();
          this.grower.growerAccount = [];

          this.CommentsForm = this._formBuilder.group({
            Comments: new FormControl({
              value: this.grower.growerComment,
            })});
          this.CommentsForm.patchValue({ Comments: this.grower.growerComment });

          // filter the account types-
          if (this.grower.farmType === 3) {
            this.accountTypes = this.accountTypes.filter(at => at.accountType === 'Miscellaneous');
          } else {
            this.accountTypes = this.accountTypes.filter(at => at.accountType !== 'Miscellaneous');
          }
          // this.loadAccounts(id);
          this.loadAccounts(id);
          // Cleanup: Remove dead code
          // this.dateOpened = new Date(this.grower.initializeDate.toString());
          // this.lastSettlementDate = new Date(this.lastSettlementDate.toString());
          // this.lastStatementDate = new Date(this.lastStatementDate.toString());
          // this.totalARBalance = 5361.00; // todo - is this the sum of all accounts?
          // this.totalYTDInterestCharged = this.grower.ytdinterestCharged;
          // this.totalYTDInterestPaid = this.grower.ytdinterestPaid;
          // random test data
          // todo - include asset value?
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

  private loadAccounts(id: number) {
    this._accountService
    .getGrowerAccounts(id)
    .subscribe(
      data => {
        try {
          // todo - save accounts
          this.grower.growerAccount = data
          .map(a => {
            switch (a.accountType) {
              case '1':
                a.accountType = 'Regular';
                break;
              case '2':
                a.accountType = 'Construction';
                break;
              case '3':
                a.accountType = 'Special';
                break;
              case '4':
                a.accountType = 'Unique';
                break;
              case '5':
                a.accountType = 'Miscellaneous';
                break;
            }
            return a;
          })
          .sort(function(a, b) {
            return a.accountType.localeCompare(b.accountType) || a.accountSuffix.localeCompare(b.accountSuffix);
          });



          // compute a few fields
          if (data.length > 0) {
            this.totalYTDInterestPaid = data.map(a => a.ytdinterestPaid).reduce((a, b) => a + b);
            this.totalYTDInterestCharged = data.map(a => a.ytdinterestCharged).reduce((a, b) => a + b);
            this.totalARBalance = data.map(a => a.amountDue).reduce((a, b) => a + b);
          }

          this.loadingAccount = false;

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

  private loadAccountTypes() {
    this._utilityService
    .getAccountTypes()
    .subscribe(
      data => {
        try {
          this.accountTypes = data;
          this.loadGrower(this.id);
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

  public saveChanges() {
    // get the comments
    this.grower.growerComment = this.CommentsForm.value.Comments;
    // send to the service
    this._editGrowerService
      .postGrowerMaster(this.grower)
      .subscribe(
        data => {
          try {
            if (data.statusCode === 200) {
              this.successToast('You have successfully updated the grower master record!');
            }
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

  public buildAccountForm() {
    this.newAccountForm = this._formBuilder.group({
      AccountType: new FormControl({
        value: '',
      }, [ Validators.required])}
    );
    this.newAccountFormLoaded = true;
  }

  public submitAddNewAccountModal() {
    this.newAccountFormSelected = false;
    const type = parseInt(this.newAccountForm.value.AccountType.toString(), 10);
    const account = {
      id: 0,
      growerId: parseInt(this.id.toString(), 10),
      accountType: parseInt(type.toString(), 10),
      accountSuffix: this.getNextAccountSuffix(type),
      dateOpened: new Date().toISOString(),
    } as IGrowerAccountPost;

    this._accountService.postGrowerSubAccount(account).subscribe(
      data => {
        try {
          if (data.statusCode === 200) {
            this.successToast('You have successfully updated created a new account!');
            setTimeout( () => {
              this._router.navigateByUrl(
                'EditAccountComponent?id=' + data.data
              );
            }, 2000 );
          }

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
    /*
    1. pull form values
    2. create the account
    3. redirect to the account

    */
  }

  public onAccountTypeChange() {
    this.newAccountFormSelected = true;
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
  onResize() {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.gridApi.sizeColumnsToFit();
  }

  private getAccountTypeInt(id: number): string {
    switch (id) {
      case 1:
        return 'Regular';
      case 2:
        return 'Construction';
      case 3:
        return 'Special';
      case 4:
        return 'Unique';
      case 5:
        return 'Miscellaneous';
    }
  }

  /** gets the next possible account suffix */
  private getNextAccountSuffix(id: number) {
    // first use the account type to get all accounts of that type
    let matchingAccounts = this.grower.growerAccount.filter(a => a.accountType.toString() === this.getAccountTypeInt(id));

    // bail if there's none with Suffix A
    if (matchingAccounts.length === 0) {
      return 'A';
    }

    // sort them by the suffix
    matchingAccounts = matchingAccounts.sort((a, b) => b.accountSuffix.charCodeAt(0) - a.accountSuffix.charCodeAt(0));

    // get the next possible char
    return this.getNextAlphabetChar(matchingAccounts[0].accountSuffix);
  }

  /** returns the next alphabetic character (ex- A returns B) */
  private getNextAlphabetChar(char: string) {
    return char.substring(0, char.length - 1)
      + String.fromCharCode(char.charCodeAt(char.length - 1) + 1);
  }


}
