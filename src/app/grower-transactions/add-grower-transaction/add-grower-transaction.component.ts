import { Component, OnInit, HostListener } from '@angular/core';
import { AddGrowerTransactionService } from './add-grower-transaction.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { IDropdownListItem } from 'src/app/models/dropdown-list-item.interface';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ITransactionVM } from 'src/app/models/transaction-vm.interface';
import { DropdownService } from 'src/app/shared/dropdown.service';
import { ITransactionType } from 'src/app/models/transaction-type.interface';
import { IGrowerTransaction } from 'src/app/models/grower-transaction.interface';
import { IGrowerTransactionVM } from 'src/app/models/grower-transaction-vm.interface';
import { IGrowerMaster } from 'src/app/models/grower-master.interface';
import { IGrowerMasterVM } from 'src/app/models/grower-master.vm.interface';
import { IAccountType } from 'src/app/models/account-type.interface';
import { IGrowerAccount } from 'src/app/models/grower-account.interface';
import { AccountMaintenanceService } from 'src/app/account-maintenance/account-maintenance.service';
import { UtilityService } from 'src/app/shared/utility.service';

@Component({
  selector: 'app-add-grower-transaction',
  templateUrl: './add-grower-transaction.component.html',
  styleUrls: ['./add-grower-transaction.component.css']
})
export class AddGrowerTransactionComponent implements OnInit {
  pageTitle = 'Add Transaction';
  moduleTitle = 'Transactions';
  innerWidth: any;
  innerHeight: any;

  // url params
  id: number;
  batchNumber: number = 0;
  growerId: number = 0;

  mode = 'add'; // default as add
  // tslint:disable-next-line:naming-convention
  InvalidWord: string;

  // page flags
  dropdownsLoaded: boolean = false;
  farmSelected: boolean = false;
  accountsLoaded: boolean = false;
  submitted: boolean = false;
  batchSelected: boolean = false;


  // dropdowns
  farmList: IGrowerMaster[] = [];
  accountList: IGrowerAccount[] = [];
  accountTypeList: IAccountType[] = [];
  transactionTypeList: ITransactionType[] = [];

  // farm search
  farmSearchForm: FormGroup;
  selectedFarm: IGrowerMaster;
  farmSelectedId: number;
  farmSelectedName: string;
  farmFormLoaded: boolean = false;
  filteredFarms: Observable<IGrowerMaster[]>;
  invalidGrower: boolean = false;

  // transactionForm
  transactionForm: FormGroup;
  transactionModel: IGrowerTransaction;

  constructor(
    private messageService: MessageService,
    private _transactionService: AddGrowerTransactionService,
    private _dropdownService: DropdownService,
    private _growerService: AccountMaintenanceService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
  ) { }

  ngOnInit() {
    // set width
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    // parse the URL?
    this._route.queryParams.subscribe(params => {
      this.id = params['Id'];
    });

    this.getLockStatus();


    // determine if add or edit
    if (!!this.id) {
      this.mode = 'edit';
      this.pageTitle = 'Edit Transaction';
      this.buildFarmSearchForm();
      this.loadFarmList(true);
      // this.loadTransaction(this.id);
    } else {
      // load the dropdowns
      this.loadFarmList(false);

      // need the batch if not an edit
      this._route.queryParams.subscribe(params => {
        this.batchNumber = params['BatchNumber'];
      });
      this.batchSelected = true;

      this.buildTransactionForm(null);
      this.buildFarmSearchForm();

      this.transactionModel = {
        id: 0,
        batchId: parseInt(this.batchNumber.toString(), 10),
        quantity: 0,
        transactionStatus: 'New',
        lpserviceArnumber: 0,
      } as IGrowerTransaction;
    }


  }

  public getLockStatus() {
    this._utilityService
      .isSettlementInProcess()
      .subscribe(
        data => {
          try {
            if (data) {
              this._router.navigateByUrl(
                'ErrorComponent?errorMessage= A settlement batch is currently in process, so no transactions or invoices can be entered until that settlement batch is posted!'
              );
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


  public loadTransaction(id: number) {

    this._transactionService
    .getGrowerTransactionById(id)
    .subscribe(
      data => {
        try {

          this.transactionModel = data;
          // this.transactionForm.patchValue({ TransactionType: this.transactionModel.transactionCode })
          this.batchNumber = data.batchId;
          this.growerId = data.growerId;

          // filter if needed
          if (this.transactionModel.transactionStatus.trim() === 'Posted')  {
            this.farmList = this.farmList.filter(f => f.status.trim() !== 'Inactive');
          }

          const growerMatch = this.farmList.find(g => g.id.toString() === this.growerId.toString());

          this.invalidGrower = !!!growerMatch; // || growerMatch.status.trim().includes('Inactive');
          this.InvalidWord = !!!growerMatch ? 'Invalid' : 'Inactive';
          this.selectedFarm = growerMatch;
          if (this.invalidGrower) {
            this.growerId = 0;
            this.selectedFarm = null;

          }
          this.farmSelected = !this.invalidGrower;
          this.batchSelected = true;

          // fill the form
          this.buildTransactionForm(this.transactionModel);
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

  public returnToBatch() {
    this._router.navigateByUrl(
      'ViewBatchComponent?Id=' + this.batchNumber
    );
  }

  /***************************************************
   * Transaction Form
   **************************************************/
  private buildTransactionForm(model: IGrowerTransaction) {
    const isAdd = model == null;


    this.transactionForm = this._formBuilder.group({
      TransactionType: new FormControl({
        value: isAdd ? '' : model.artype,
      }, [ Validators.required]),
      Date: new FormControl({
        value: isAdd ? '' : model.transactionDate,
      }, [ Validators.required]),
      Account: new FormControl({
        value: isAdd ? '' : model.accountSuffix,
      // }, [ Validators.required]),
      }),
      Description: new FormControl({
        value: isAdd ? '' : model.transactionDescription,
      }, [ Validators.required]),
      Quantity: new FormControl({
        value: isAdd ? 0 : model.quantity,
      }),
      Amount: new FormControl({
        value: isAdd ? '' : model.transactionAmount,
      }, [ Validators.required]),
      ReferenceNumber: new FormControl({
        value: isAdd ? '' : model.referenceNumber,
      }),
      TaxExempt: new FormControl({
        value: isAdd ? false : model.transactionTaxExemptCode,
      }),
    });

    // patch workaround
    this.transactionForm.patchValue({ TransactionType: isAdd ? '' : parseInt(model.transactionCode, 10).toString });
    this.transactionForm.patchValue({ Date: isAdd ? new Date() : model.transactionDate });

    // this.transactionForm.patchValue({ Account: isAdd ? '' : model.growerAccountId });

    this.transactionForm.patchValue({ Description: isAdd ? '' : model.transactionDescription });
    this.transactionForm.patchValue({ Quantity: isAdd ? 0 : model.quantity });
    this.transactionForm.patchValue({ Amount: isAdd ? '' : model.transactionAmount });
    this.transactionForm.patchValue({ ReferenceNumber: isAdd ? '' : model.referenceNumber });
    this.transactionForm.patchValue({ TaxExempt: isAdd ? '' : model.transactionTaxExemptCode === 'Y' }); // todo - switch on it

    // mark as touched
    this.transactionForm.get('TransactionType').markAsTouched();
    this.transactionForm.get('Date').markAsTouched();
    this.transactionForm.get('Account').markAsTouched();
    this.transactionForm.get('Description').markAsTouched();
    this.transactionForm.get('Amount').markAsTouched();

    // if it is an edit, mark the flags and move to next step
    if (!isAdd) {
      this.farmSelected = !this.invalidGrower;
      this.farmFormLoaded = true;
      if (!this.invalidGrower) {
        this.transactionForm.patchValue({ TransactionType: parseInt(model.transactionCode, 10).toString() });
      }
      this.loadAccountList(this.transactionModel.growerId);
    }

  }

  public onDateChange(event: any) {

  }

  public submitTransaction() {
    // block submitted button
    this.submitted = true;

    // get the form values
    const values = this.transactionForm.value;
    if (values.TransactionType.toString() !== '70' && (!!!values.Account || values.Account.toString() === '')) {
      this.errorToast('You must select a valid grower account');
      this.submitted = false;
    } else {
      // set the values in the model
    this.transactionModel.transactionCode = values.TransactionType.toString();
    this.transactionModel.transactionDate = new Date(values.Date).toISOString();
    this.transactionModel.transactionDescription = values.Description;

    this.transactionModel.growerAccountId = this.transactionModel.transactionCode === '70' ? 0 : values.Account;
    if (values.TransactionType.toString() === '70') {
      this.transactionModel.accountSuffix = '';
      this.transactionModel.artype = '';
    } else {
      const accountMatch = this.accountList.find(a => a.id.toString() === values.Account.toString());
      this.transactionModel.accountSuffix = accountMatch.accountSuffix;
      this.transactionModel.artype = accountMatch.accountType.substring(0, 1);
    }

    this.transactionModel.transactionAccountName = this.selectedFarm.farmName;

    this.transactionModel.quantity = values.Quantity;
    this.transactionModel.transactionAmount = values.Amount;
    this.transactionModel.referenceNumber = values.ReferenceNumber;
    this.transactionModel.transactionTaxExemptCode = values.TaxExempt ? 'Y' : 'N'; // todo - figure out logic
    this.transactionModel.vendorId = this.selectedFarm.vendorId.toString();
    if (this.transactionModel.transactionStatus.trim() === 'Error') {
      this.transactionModel.transactionStatus = 'New';
    }

    // post to the server
    this._transactionService
    .postTransaction(this.transactionModel)
    .subscribe(
      data => {
        try {
          if (data.statusCode === 200) {
            // success add, display success then redirect to batch page
            this.successToast('You have successfully submitted the transaction');
            setTimeout( () => {
              this.submitted = false;
              this._router.navigateByUrl(
                'ViewBatchComponent?Id=' + this.transactionModel.batchId
              );
            }, 2000 );

          }
        } catch (e) {
          console.error(e);
          this.submitted = false;
        }
      },
      error => {
        console.error(error);
        this.errorToast(error);
        this.submitted = false;
      }
    );
    }
  }

  /***************************************************
   * Farm Search
   **************************************************/
  private buildFarmSearchForm() {

    this.farmSearchForm = this._formBuilder.group({
      FarmNumber: new FormControl({
        value: '',
      }),
      FarmName: new FormControl({
        value: '',
      }),
    });
    this.filteredFarms = this.farmSearchForm.valueChanges.pipe(
      startWith(''),
      map(() =>
        this._filterFarms(this.farmSearchForm.controls['FarmName'].value)
      )
    );
    this.farmFormLoaded = true;
  }

  /** Autofocus confirm button when user presses enter from the autocomplete input */
  enterPressed(button: HTMLButtonElement, event) {
    if (event.keyCode === 13) {
      button.focus();
    }
  }

  public autocompleteSelected(event: any) {
    this.selectedFarm = this.farmList.find(
      farm => farm.farmName.trim() === event.option.value.toString()
    );
  }

  // tslint:disable-next-line:naming-convention
  private _filterFarms(value: Object): IGrowerMaster[] {
    if (value != null) {
      const list = this.farmList.filter(farm =>
        this.toLowerNullable(farm.farmName).includes(
          this.toLowerNullable(value.toString())
        )
      );
      if (list.length === 1 && this.selectedFarm !== list[0]) {
        this.selectedFarm = list[0];
        this.farmSearchForm.patchValue({ FarmNumber: list[0].id });
      }
      return list;
    }
  }

  /** Reset the selected user on open */
  public autocompleteOpen() {
    this.selectedFarm = null;
  }

  public onGrowerSelected(event: any) {

    if (!!!event) {
       // todo ? event is null, reset ?
       this.farmSelected = false;
       this.selectedFarm = null;
    } else {
      this.farmSelected = true;
      this.selectedFarm = event;
      this.transactionModel.growerId = this.selectedFarm.id;
      if (this.invalidGrower) {
        this.invalidGrower = false;
        // a hack to get this working
        this.transactionForm.patchValue({ TransactionType: this.transactionModel.transactionCode });
      }
      this.loadAccountList(this.transactionModel.growerId);
    }
  }

  // CLEANUP: remove after testing
  /*public confirmFarmSelection() {
    if (!!this.selectedFarm) {
      this.infoToast('You have selected farm #' + this.selectedFarm.id + ' - ' + this.selectedFarm.farmName);
      this.farmSelected = true;
      this.transactionModel.growerId = this.selectedFarm.id;
      this.loadAccountList(this.transactionModel.growerId);
    } else {
      this.errorToast('You must select a valid farm!');
    }
  }*/

  // CLEANUP: remove after testing
  /*public farmNumberSearch(event: any) {
    const val = this.farmSearchForm.value.FarmNumber;
    const match = this.farmList.find(f => f.id.toString() === val.toString());
    if (!!match) {
      this.farmSearchForm.patchValue({FarmName: match.farmName.trim()});
      this.selectedFarm = match;
    } else {
      this.selectedFarm = null;
    }
  }*/

  // CLEANUP: remove after testing
  /*public selectAnotherFarm() {
    this.farmSelected = false;

  }*/

  /***************************************************
   * Load Dropdowns
   **************************************************/

   /** centralize the dropdown loading */
   private loadDropdowns(isEdit: boolean) {
      this.loadAccountTypeList();
      this.loadTransactionTypeList();
      if (isEdit) {
        this.loadTransaction(this.id);
      }

   }

  /** load the farm dropdown list */
  private loadFarmList(isEdit: boolean) {


      this._transactionService
        .getGrowerList(true)
        .subscribe(
          data => {
            try {
              this.farmList = data;
              this.loadDropdowns(isEdit);
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

  /** load the account type list */
  private loadAccountTypeList() {
    this._dropdownService
    .getAccountTypes()
    .subscribe(
      data => {
        try {
          this.accountTypeList = data;
          this.dropdownsLoaded = true;
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

  /** convert the account type */
  private getAccountType(id: number) {
    return this.accountTypeList.find(
      acct => acct.id.toString() === id.toString()
    );
  }


  private loadAccountList(id: number) {
    this._growerService
    .getGrowerAccounts(id)
    .subscribe(
      data => {
        try {

          // sort the accounts
          this.accountList = data.sort(function(a, b) {
            return a.accountType.localeCompare(b.accountType) || a.accountSuffix.localeCompare(b.accountSuffix);
          })
          .map(a => {
            a.accountType = this.accountTypeList.find(at => at.id.toString() === a.accountType.toString()).accountType;
            return a;
          });

          if (this.mode === 'edit' && !this.invalidGrower) {
            const match = data.find(a => a.id.toString() === this.transactionModel.growerAccountId.toString());
            if (!!match) {
              this.transactionForm.patchValue({ Account: match.id});

            } else {
              this.transactionForm.patchValue({ Account: '' });
            }
            this.transactionForm.get('Account').markAsTouched();

          }

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
  }

  public sortAccountHelper(a: any, b: any) {
      if (a > b) {
        return 1;
      } else if (a < b) { return -1; }
      return 0;
  }

  private loadTransactionTypeList() {
    this._dropdownService
    .getTransactionTypes()
    .subscribe(
      data => {
        try {
          this.transactionTypeList = data.filter(tt => parseInt(tt.code, 10) < 25 || tt.code === '35' || tt.code === '40' || tt.code === '45' ||tt.code === '70'); // filter out settlements and transfers. Updated to remove 25 and 30 types
          //this.transactionTypeList = data.filter(tt => parseInt(tt.code, 10) < 46 || tt.code === '70'); // filter out settlements and transfers
          this.dropdownsLoaded = true;
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

  /** null safe toLower */
  private toLowerNullable(value: string) {
    return value != null ? value.toLowerCase() : '';
  }
}
