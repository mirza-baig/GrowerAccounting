import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { IDropdownListItem } from 'src/app/models/dropdown-list-item.interface';
import { AddGrowerInvoiceService } from './add-grower-invoice.service';
import { MessageService } from 'primeng/api';
import { DropdownService } from 'src/app/shared/dropdown.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { slide, fade, fadeInSlideOutRight } from 'src/fieldale-animations';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { IGrowerAccount } from 'src/app/models/grower-account.interface';
import { IAccountType } from 'src/app/models/account-type.interface';
import { IGrowerMaster } from 'src/app/models/grower-master.interface';
import { AccountMaintenanceService } from 'src/app/account-maintenance/account-maintenance.service';
import { IApInvoice } from 'src/app/models/ap-invoice.interface';
import { IGrowerTransactionBatch } from 'src/app/models/grower-transaction-batch.interface';
import { IGrowerTransaction } from 'src/app/models/grower-transaction.interface';
import { ICurrentUser } from 'src/app/user-management/current-user.interface';
import { AddGrowerTransactionService } from 'src/app/grower-transactions/add-grower-transaction/add-grower-transaction.service';
import { GrowerTransactionsService } from 'src/app/grower-transactions/grower-transactions.service';
import { IVwApvendorMaster } from 'src/app/models/vw-apvendor-master.interface';
import { IVwGlaccountMaster } from 'src/app/models/vw-glaccount-master.interface';
import { IGLAccountMaster } from 'src/app/models/gl-account-master.interface';
import { IApgldistributionAccounts } from 'src/app/models/apgldistribution-accounts.interface';
import { IGLDistributionItem } from './gl-distribution-item.interface';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { GLDistributionActionsComponent } from '../gldistribution-actions/gldistribution-actions.component';
import { UtilityService } from 'src/app/shared/utility.service';
import { IApvoucher } from 'src/app/models/apvoucher.interface';
import { IAPVoucher } from 'src/app/models/ap-voucher.interface';
import { NumericEditorComponent } from 'src/app/numeric-editor/numeric-editor.component';
import {UiTiming} from '../../utilities/ui-timing/UiTiming';
import {currencyFormatter} from '../../shared/grid-formatters/currency-formatter';

@Component({
  selector: 'app-add-grower-invoice',
  templateUrl: './add-grower-invoice.component.html',
  styleUrls: ['./add-grower-invoice.component.css'],
  animations: [
    fade,
    slide,
    fadeInSlideOutRight,
    trigger('detailExpand', [
      state(
        'collapsed',
        style({ height: '0px', minHeight: '0', display: 'none' })
      ),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      )
    ])
  ]
})
export class AddGrowerInvoiceComponent implements OnInit, OnDestroy {
  pageTitle = 'Add Grower AP Invoice';
  moduleTitle = 'Invoice';
  innerWidth: any;
  innerHeight: any;

  // url params
  // todo - are these needed?
  voucherId: number;
  id: number;
  growerId: number;
  lockPage: boolean = false;
  submittedPost: boolean = false;

  // page flags
  dropdownsLoaded: boolean = false;
  farmVendorFormLoaded: boolean = false;
  invoiceFormLoaded: boolean = false;
  isFarmSelected: boolean = false;
  isVendorSelected: boolean = false;
  showForm: boolean = false;
  deleteVoucher: boolean = true;

  // dropdowns
  farmList: IDropdownListItem[] = [];
  selectedFarm: IGrowerMaster;
  filteredFarms: Observable<IDropdownListItem[]>;
  companyList: IDropdownListItem[] = [];
  vendorList: IVwApvendorMaster[] = [];
  selectedVendor: IVwApvendorMaster;
  filteredVendors: Observable<IVwApvendorMaster[]>;
  accountList: IGrowerAccount[] = [];
  accountTypes: IAccountType[] = [];
  companyName: string;
  glAccountList: IGLAccountMaster[] = [];

  // forms
  farmVendorForm: FormGroup;
  invoiceForm: FormGroup;

  // models
  invoiceModel: IApInvoice;
  glDistributions: IApgldistributionAccounts[] = [];
  batchModel: IGrowerTransactionBatch;
  transactionModel: IGrowerTransaction;

  // gl distribution stuff
  distributions: IGLDistributionItem[] = [];
  modules = AllModules;
  colDefs = [
    {
      headerName: 'GL Account',
      field: 'id',
      editable: true,
      // need an on type event
      width: 150,
      cellStyle: function(params) {
        if (params.data.isLocked) {
          return null;
        } else {
          return  {
            'border': '2px solid black',
            'background-color': '#f9ffe1',
          };
        }
      },
      // onCellKeyPress : this.onGLAccountChange
    },
    {
      headerName: 'Name',
      field: 'name',
      width: 150, // todo - highlight based on being valid or not?
    },
    {
      headerName: 'Amount',
      field: 'amount',
      valueFormatter: params => currencyFormatter(params, '$0'),
      cellEditor: 'numericEditor',
      width: 120,
      editable: true,
      // onCellChange: this.onAmountCellChange,
      cellStyle: function(params) {
        if (params.data.isLocked) {
          return null;
        } else {
          return  {
            'border': '2px solid black',
            'background-color': '#f9ffe1',
          };
        }
      }
    },
    {
      headerName: 'Actions',
      field: 'id',
      cellRenderer: 'actionsRenderer',
      width: 120,
    },

  ];
  public frameworkComponents = {
    actionsRenderer: GLDistributionActionsComponent,
    numericEditor: NumericEditorComponent,
  };
  public gridApi;
  public gridColumnApi;
  invoiceTotal: number = 0;
  distributionTotal: number = 0;

  nextVoucherNumber: number = 0;
  voucher: IAPVoucher;


  constructor(
    private messageService: MessageService,
    private _invoiceService: AddGrowerInvoiceService,
    private _accountService: AccountMaintenanceService,
    private _transactionService: AddGrowerTransactionService,
    private _batchService: GrowerTransactionsService,
    private _dropdownService: DropdownService,
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
      this.growerId = params['GrowerId'];
    });

    // load dropdowns
    this.loadDropdowns();

    // determine which step to jump into
    if (this.id) {
      // edit mode
      this.pageTitle = 'Edit Grower AP Invoice';
      this.loadInvoice(this.id);


    } else {
      // add mode
      this.id = 0;
      // grower is preselected
      this.isFarmSelected = !!this.growerId;
      if (this.isFarmSelected) {
        this.loadGrowerAccounts(this.growerId);
      }

      this.distributions.push({
        id: 411800,
        name: 'ACCOUNTS RECEIVABLE - GROWER',
        amount: 0,
        isLocked: false,
      } as IGLDistributionItem);

      // load both forms
      this.loadFarmVendorForm(null);
      this.loadInvoiceForm(null);
    }
  }


  /** if this is a new invoice we must delete the voucher */
  ngOnDestroy() {
    // we only need to do this if it is a new invoice and the voucher exists
    if (this.id === 0 && !!this.voucher && this.deleteVoucher) {
      this._invoiceService
        .deleteVoucher(this.voucher.id)
        .subscribe(
          data => {
          },
          error => {
            console.error(error);
          }
        );
    }
  }



  /** creates a new voucher and loads it  */
  public loadNextVoucherNumber() {
    const vals = this.invoiceForm.value;
    // make a new voucher
    this.voucher = {
      id: 0,
      growerId: parseInt(this.growerId.toString(), 10),
      accountNumber: parseInt(vals.Account.toString(), 10),
      voucherAmount: !!vals.Amount ? parseFloat(vals.Amount.toString()) : 0,
    } as IAPVoucher;

    // post it
    this._invoiceService.postVoucher(this.voucher).subscribe(
      data => {
        try {
          this.successToast('The voucher number is #' + data.data);
          this.voucher.id = parseInt(data.data.toString(), 10);
          this.invoiceForm.patchValue({ Voucher: this.voucher.id });
        } catch (e) {
          console.error(e);
        }
      },
      error => {
        console.error(error);
      }
    );
  }



  /***************************************************
   * Company Farm Vendor Form
   **************************************************/

  /** Load the form for company, farm, and vendor */
  private loadFarmVendorForm(model: IApInvoice) {
    const isAdd = !!!model;
    this.farmVendorForm = this._formBuilder.group({
      Company: new FormControl({
        value: '4',
      }, [ Validators.required]),
      VendorNumber: new FormControl({
        value: '',
      }, [ Validators.required]),
      VendorName: new FormControl({
        value: '',
      }, [ Validators.required]),
    });

    this.farmVendorForm.patchValue({ Company: isAdd ? '4' : model.company.toString() });
    this.farmVendorForm.patchValue({ VendorNumber: isAdd ? '' : model.vendorId });

    if (!!this.id && this.id > 0 && this.vendorList.length > 0) {

      this.selectedVendor = this.vendorList.find(v => v.vnumb.toString() === this.invoiceModel.vendorId.toString());

      this.farmVendorForm.patchValue({ VendorName: this.selectedVendor.vname });
    }

    // mark as touched
    this.farmVendorForm.get('Company').markAsTouched();
    this.farmVendorForm.get('VendorNumber').markAsTouched();
    this.farmVendorForm.get('VendorName').markAsTouched();

    // bind the autocompletes
    this.filteredVendors = this.farmVendorForm.valueChanges.pipe(
      startWith(''),
      map(() =>
        this.filterVendors(this.farmVendorForm.controls['VendorName'].value)
      )
    );


    this.farmVendorFormLoaded = true;
  }



  /** selection event for the grower */
  public onGrowerSelected(event: any) {
    if (!!!event) {
      this.isFarmSelected = false;
      this.selectedFarm = null;
    } else {
      this.selectedFarm = event;
      this.growerId = this.selectedFarm.id;
      this.isFarmSelected = true;
      // load the accounts
      this.loadGrowerAccounts(this.selectedFarm.id);
    }
  }

  /** used with the number entry to select a farm */
  // public farmNumberSearch(event: any) {
  //   const val = this.farmVendorForm.value.FarmNumber;
  //   const match = this.farmList.find(f => f.Value === val.toString());
  //   if (!!match) {
  //     this.farmVendorForm.patchValue({FarmName: match.Text});
  //     this.selectedFarm = match;
  //   } else {
  //     this.selectedFarm = null;
  //   }
  // }

  /** reset for selecting a farm */
  public selectAnotherFarm() {
    this.isFarmSelected = false;
  }

  /** load the accounts for a grower (by id) */
  public loadGrowerAccounts(id: number) {
    this._accountService
      .getGrowerAccounts(id)
      .subscribe(
        data => {
          try {
            this.accountList = data
            .sort(function(a, b) {
              return a.accountType.localeCompare(b.accountType) || a.accountSuffix.localeCompare(b.accountSuffix);
            })
            .map(a => {
              a.accountType = this.getAccountType(a.accountType).accountType + ' - ' + a.accountSuffix;
              return a;
            });

            // if the form is loaded and this is an edit, then fill the account
            if (this.invoiceFormLoaded && !!this.id && this.id > 0) {
              this.invoiceForm.patchValue({ Account:  this.invoiceModel.account });
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

  /** helper to get the account type */
  public getAccountType(id: string) {
    return this.accountTypes.find(at => at.id.toString() === id);
  }

  /** filter the vendor list for the autocomplete */
  private filterVendors(value: Object): IVwApvendorMaster[] {
    if (value != null) {
      const list = this.vendorList.filter(vendor =>
        this.toLowerNullable(vendor.vname).includes(
          this.toLowerNullable(value.toString())
        )
      );
      if (list.length === 1) {
        this.selectedVendor = list[0];
      }
      return list;
    }
  }

  /** event for autocomplete open for the vendor */
  public vendorAutocompleteOpen() {
    this.selectedVendor = null;
  }

  /** Confirming the selected vendor */
  public confirmVendorSelection() {
    if (!!this.selectedVendor) {
      this.infoToast('You have selected vendor #' + this.selectedVendor.vnumb + ' - ' + this.selectedVendor.vname);
      this.isVendorSelected = true;
    } else {
      this.errorToast('You must select a valid vendor!');
    }
  }

  public vendorAutocompleteSelected(event: any) {
    const val = this.farmVendorForm.value.VendorName;
    const match = this.vendorList.find(f => f.vname.toString() === val.toString());
    this.farmVendorForm.patchValue({VendorNumber: match.vnumb});
    this.selectedVendor = match;
  }

  /** used with the number entry to select a farm */
  public vendorNumberSearch(event: any) {
    const val = this.farmVendorForm.value.VendorNumber;
    const match = this.vendorList.find(f => f.vnumb.toString() === val.toString());
    if (!!match) {
      this.farmVendorForm.patchValue({VendorName: match.vname});
      this.selectedVendor = match;
    } else {
      this.selectedVendor = null;
    }
  }

  /** reset for selecting a vendor */
  public selectAnotherVendor() {
    this.isVendorSelected = false;
  }

  /** Save the confirmed form values */
  public confirmSelections() {
    this.companyName = this.farmVendorForm.value.Company + ' - ' + this.companyList.find(c => c.Value === this.farmVendorForm.value.Company).Text;
    if (!!!this.selectedVendor) {
      this.selectedVendor = this.vendorList.find(v => v.vnumb.toString() === this.farmVendorForm.value.VendorNumber.toString());
    }
    this.showForm = true;
  }

  /** resets the form to go back a step */
  public resetSelection() {
    this.showForm = false;
  }

  /***************************************************
   * Invoice form
   **************************************************/

   /** build the invoice form */
  private loadInvoiceForm(model: IApInvoice) {
    const isAdd = !!!model;
    const voucherNumber = isAdd ? this.nextVoucherNumber : model.apvoucherId;
    this.invoiceForm = this._formBuilder.group({
      PayDate: new FormControl({
        value: '',
        disabled: this.lockPage,
      }, [ Validators.required]),
      Account: new FormControl({
        value: '',
        disabled: this.lockPage,
      }, [ Validators.required]),
      InvoiceDate: new FormControl({
        value: '',
        disabled: this.lockPage,
      }, [ Validators.required]),
      Amount: new FormControl({
        value: '',
        disabled: this.lockPage,
      }, [ Validators.required]),
      InvoiceNumber: new FormControl({
        value: '',
        disabled: this.lockPage,
      }, [ Validators.required, Validators.max(999999)]),
      Description: new FormControl({
        value: '',
        disabled: this.lockPage,
      }, [ Validators.required]),
      RemittanceNote: new FormControl({
        value: '',
        disabled: this.lockPage,
      }, ),
      SeparateCheck: new FormControl({
        value: false,
        disabled: this.lockPage,
      }),
      Voucher: new FormControl({
        value: voucherNumber,
        disabled: true,
      }, [ Validators.required]),
    });

    // patch value empty fix
    this.invoiceForm.patchValue({ PayDate: isAdd ? '' : model.payDate });
    this.invoiceForm.patchValue({ Account: isAdd ? '' : model.account });
    this.invoiceForm.patchValue({ InvoiceDate: isAdd ? '' : model.invoiceDate });
    this.invoiceForm.patchValue({ Amount: isAdd ? '' : model.amount });
    this.invoiceForm.patchValue({ InvoiceNumber: isAdd ? '' : model.invoiceNumber });
    this.invoiceForm.patchValue({ Description: isAdd ? '' : model.description });
    this.invoiceForm.patchValue({ RemittanceNote: isAdd ? '' : model.remittanceNote });
    this.invoiceForm.patchValue({ Voucher: voucherNumber });

    this.invoiceForm.patchValue({ SeparateCheck: '' });

    // mark as touched
    this.invoiceForm.get('PayDate').markAsTouched();
    this.invoiceForm.get('Account').markAsTouched();
    this.invoiceForm.get('InvoiceDate').markAsTouched();
    this.invoiceForm.get('Amount').markAsTouched();
    this.invoiceForm.get('InvoiceNumber').markAsTouched();
    this.invoiceForm.get('Description').markAsTouched();
    this.invoiceForm.get('RemittanceNote').markAsTouched();
    this.invoiceForm.get('Voucher').markAsTouched();
    // this.invoiceForm.get('GLDistribution').markAsTouched();
    // this.invoiceForm.get('SeparateCheck').markAsTouched();

    this.invoiceFormLoaded = true;
    // -- 1 for 10431, 12 for 10130, 33 for 10821, 38 for 10991

    if (!isAdd) {

      this.confirmSelections();
    }
  }

  public async submitInvoice() {
    let valid = true;
    const values = this.invoiceForm.value;
    const headFormVals = this.farmVendorForm.value;
    const distVals: IGLDistributionItem[] = [];
    this.gridApi.forEachNode((node: { data: IGLDistributionItem; }) => distVals.push(node.data));
    // Exit if no distributions exist
    if (distVals.length === 0) {
      this.errorToast('You must have at least one GL Account distribution!');
      return;
    }

    // validate the gl account number for each distribution
    // Exit if any Invalid GL Accounts exist
    distVals.forEach(dist => {
      if (!!!this.glAccountList.find(a => a.id.toString() === dist.id.toString())) {
        this.errorToast('Invalid GL Account #' + dist.id + '. Please select a valid GL Account');
        valid = false;
        return;
      }
    });
    if (!valid) { return; } // exit if not valid

    // we also need to validate the distribution total
    this.distributionTotal = distVals
      .map(a => a.amount)
      .reduce((a, b) => a + b);

    if (this.distributionTotal !== this.invoiceTotal) {
      this.errorToast('GL Account distribution amounts must total to equal the invoice amount!');
      return;
    }
    // also get farm values
    /*
    2 tasks involed
    1. create a simple conversion from form to invoice model, post it
    2. create a simple transaction batch
    3. use that id, create a transaction model, post it

    */

    // get the user
    const user = JSON.parse(localStorage.getItem('ActiveDirectoryUser')) as ICurrentUser;
    // set the invoice model
    this.invoiceModel = {
      id: this.id,
      company: parseInt(headFormVals.Company.toString(), 10),
      growerId: parseInt(this.growerId.toString(), 10),
      vendorId: parseInt(headFormVals.VendorNumber.toString(), 10),
      payDate: new Date(values.PayDate),
      invoiceDate: new Date(values.InvoiceDate),
      account: parseInt(values.Account.toString(), 10),
      amount: parseFloat(values.Amount.toString()),
      invoiceNumber: values.InvoiceNumber.toString(),
      description: values.Description,
      remittanceNote: values.RemittanceNote, // is this reference number on trans?
      separateCheck: !!values.SeparateCheck,
      apvoucherId: this.voucher.id,
      status: 'New'
    } as IApInvoice;
    const account = this.accountList.find(a => a.id.toString() === this.invoiceModel.account.toString());

    // start the post party
    this.submittedPost = true;
    const invResult = await this._invoiceService.postInvoice(this.invoiceModel).toPromise();
    if (invResult.statusCode !== 200) { return; } // Short circuit throw error

    // If we are good keep going
    // post voucher
    this.voucher.accountNumber = this.invoiceModel.account;
    this.voucher.voucherAmount = this.invoiceModel.amount;
    const voucherResult = await this._invoiceService.postVoucher(this.voucher).toPromise();
    if (voucherResult.statusCode !== 200) { return; } // Short circuit throw error


    // post the GL account distributions
    // apiResponse.data = "Invoice: " + invoice.Id + "  successfully posted. Invoice data: " + JSONString;
    this.invoiceModel.id =  parseInt(invResult.data.split(' ')[1].toString(), 10);

    // distributions
    this.glDistributions = distVals.map(d => {
      return {
        amount: d.amount,
        id: d.distributionId,
        growerInvoiceId: this.invoiceModel.id, // invoice id
        glaccount: d.id
      } as IApgldistributionAccounts;
    });

    const glResult = await this._invoiceService.postAPGLDistributionAccounts(this.glDistributions).toPromise();
    if (glResult.statusCode !== 200) { return; } // short circuit

    this.deleteVoucher = false;
    // since this is getting to deep let's go to another method
    await this.exportInvoice();
    // CLEANUP: Delete unused code
    // transaction posting
    // this.postFullTransactions();
    /*this._invoiceService.postInvoice(this.invoiceModel).subscribe(
      invResult => {
        try {



        } catch (e) {
          console.error(e);
        }
      },
      error => {
        console.error(error);
        this.errorToast(error);
      }
    );*/
  }

  /** export the invoice by posting it */
  public async exportInvoice(): Promise<void> {
    try {
      this.invoiceModel.status = 'Posted';
      const result = await this._invoiceService.postInvoice(this.invoiceModel).toPromise();
      if (result.statusCode !== 200) {
        this.errorToast('An error occurred while trying to process your request. Please submit the form again');
        this.submittedPost = false;
        return;
      }

      this.successToast('You have successfully submitted the invoice');
      await UiTiming.delay(1000);
      this.submittedPost = false;
      await this._router.navigateByUrl(
        'GrowerInvoiceListComponent'
      );
    } catch (e) {
      console.error(e);
      this.errorToast('An Error Has Occurred.');
      this.submittedPost = false;
    }
  }

  /** handle the transaction portion of our process */
  public convertToTransactions() {
    // get user
    const user = JSON.parse(localStorage.getItem('ActiveDirectoryUser')) as ICurrentUser;

    // build a batch
    // tslint:disable-next-line:prefer-const
    let batch = {
      id: 0,
      createdBy: user.displayName,
      createdDate: new Date(),
      postedDate: new Date(),
      description: 'APInvoice - ' + this.voucher.id,
      postedBy: user.displayName,
      status: 'New'
    } as IGrowerTransactionBatch;

    // post the new batch
    this._batchService.postTransactionBatch(batch).subscribe(batchResult => {
      if (batchResult.statusCode === 200) {
        // New transaction batch #{number} added.
        const batchId = parseInt(batchResult.data.split(' ')[3].substring(1), 10);
        batch.id = batchId;

        // get the account
        const account = this.accountList.find(a => a.id.toString() === this.invoiceModel.account.toString());

        const transaction = {
          id: 0,
          growerId: this.invoiceModel.growerId,
          growerAccountId: this.invoiceModel.account,
          transactionCode: '35', // misc invoice (need to verify),
          accountSuffix: account.accountSuffix,
          artype: account.accountType.substring(0, 1),
          transactionDate: this.invoiceModel.invoiceDate,
          quantity: 0,
          transactionAmount: this.invoiceModel.amount,
          transactionDescription: this.invoiceModel.description,
          transactionAccountName: account.accountType,
          vendorId: this.invoiceModel.vendorId.toString(),
          referenceNumber: this.voucher.id.toString(),
          transactionStatus: 'New',
          batchId: batchId,
        } as IGrowerTransaction;

        this._transactionService.postTransaction(transaction).subscribe(tResult => {
          if (tResult.statusCode === 200) {
            // one final post on the batch
            batch.status = 'Posted';

            this._batchService.postTransactionBatch(batch).subscribe(finalResult => {
              if (finalResult.statusCode === 200) {
                // 7 calls later we finally made it
                this.successToast('You have successfully submitted the invoice');
                setTimeout(() => {
                  this.submittedPost = false;
                  this._router.navigateByUrl(
                    'GrowerInvoiceListComponent'
                  );
                }, 1000);
              }
            }, error => {
              console.error(error);
              this.errorToast(error);
            });
          }
        }, error => {
          console.error(error);
          this.errorToast(error);
        });
      }
    }, error => {
      console.error(error);
      this.errorToast(error);
    });
  }


  public returnToList() {
    this._router.navigateByUrl(
      'GrowerInvoiceListComponent'
    );
  }

  /** load an invoice for edit mode */
  private loadInvoice(id: number) {
    this._invoiceService.getInvoice(id).subscribe(
      result => {
        try {
          this.invoiceModel = result as IApInvoice;
          this.isFarmSelected = true;
          this.growerId = result.growerId;


          // compute totals-
          this.invoiceTotal = this.invoiceModel.amount;

          this.lockPage = result.status.trim() === 'Exported' || result.status.trim() === 'Posted';
          // this.loadGrowerAccounts(result.growerId);
          this.loadGrowerAccounts(this.growerId);
          // load voucher
          this.loadVoucher(result.apvoucherId);

          // lock the colums if posted
          if (this.lockPage && !!this.gridColumnApi) {
            this.gridColumnApi.getColumn('id').getColDef().editable = false;
            this.gridColumnApi.getColumn('amount').getColDef().editable = false;
          }


          // load both forms
          this.loadFarmVendorForm(result);
          this.loadInvoiceForm(result);
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

  /** get the ap voucher for the invoice */
  private loadVoucher(id: number) {
    this._invoiceService.getAPVoucherById(id).subscribe(
      result => {
        try {
          this.voucher = result;
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

  private loadAccountDistributions(id: number) {
    this._invoiceService.getAPGLDistributionAccountsByInvoiceId(id).subscribe(
      result => {
        try {
          this.glDistributions = result;
          this.distributions = result.map(d => {
            const dist = {
              amount: d.amount,
              id: d.glaccount,
              name: this.glAccountList.find(a => a.id.toString() === d.glaccount.toString()).glAccountName,
              isLocked: this.lockPage,
              distributionId: d.id,
            } as IGLDistributionItem;
            return dist;
          });

          this.distributionTotal = result.map(d => d.amount).reduce((a, b) => a + b);


          // lock the colums if posted
          if (!!this.invoiceModel && this.invoiceModel.status.trim() === 'Posted' && !!this.gridColumnApi) {
            this.gridColumnApi.getColumn('id').getColDef().editable = false;
            this.gridColumnApi.getColumn('amount').getColDef().editable = false;
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

  /***************************************************
   * Load Dropdowns
   **************************************************/

  /** centralize the dropdown loading */
  private loadDropdowns() {
  this.loadAccountTypeList().then(() => {
    this.loadCompanyList();
    this.loadVendorList();
    this.loadGLAccountList();
    this.dropdownsLoaded = true;
  });
  }


  /** load the account type list */
  private loadAccountTypeList(): Promise<any> {
    return new Promise((res, rej) => {
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

      res();
    });

  }

  /** Load the company list */
  private loadCompanyList() {
    this._dropdownService
      .getCompanies()
      .subscribe(
        data => {
          try {
            this.companyList = data;
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

  /** Load the vendor dropdown list */
  private loadVendorList() {
    // since the call takes 10 seconds, we just cached it on app init and retrieve it from there
    this.vendorList = JSON.parse(localStorage.getItem('APVendorList')) as IVwApvendorMaster[];
    // todo - verify it works
    if (!!this.id && this.id > 0 && this.farmVendorFormLoaded) {
      this.farmVendorForm.patchValue({ VendorName: this.vendorList.find(v => v.vnumb.toString() === this.invoiceModel.vendorId.toString()).vname });
    }

  }

  /** load the GL account list from the AS400 */
  private loadGLAccountList() {
    this._dropdownService
      .getGLAccounts()
      .subscribe(
        data => {
          try {
            this.glAccountList = data;
            // load the distributions if needed
            if (!!this.id && this.id > 0) {
              this.loadAccountDistributions(this.id);
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

  /** helper to get a matching account to show the name */
  public getGLAccount(id: number) {
    return this.glAccountList.find(a => a.id.toString() === id.toString());
  }

  /***************************************************
   * GL Account Distributions
   **************************************************/

   /** Add a GL distribution */
  public addDistribution() {
    const templist = [];
    const newItem = { id: 0, name: 'Enter Account #', amount: 0, distributionId: 0, } as IGLDistributionItem;
    templist.push(newItem);
    this.gridApi.updateRowData({ add: templist });
    this.infoToast('Please enter the GL Account information');
  }

  public cellKeyDown(event: any) {
    // console.log('key down');
    // console.log(event);
  }
  /**  */
  public onCellChange(event: any) {
    // console.log(event);
    // only do our event if it is the first column (AD) for matching account name
    if (event.colDef.field === 'id')  {
      // search the GL account list
      // event.RowIndex will tell us which line to modify
      const attempt = this.glAccountList.find(a => a.id.toString() === event.event.target.value.toString());
      // console.log(event.event.target.value.toString());
      if (!!attempt) {
        const name = attempt.glAccountName.trim();
        event.node.setDataValue('name', name);

      } else {
        // input is invalid
        event.node.setDataValue('name', 'Enter Account #');
      }

    } else if (event.colDef.field === 'amount') {
      // console.log('account edit event');
      // we also have an event if they're updating totals
      // value is event.event.target.value
      // get the list of all the amounts
      const rowData = [];
      this.gridApi.forEachNode((node: { data: any; }) => rowData.push(node.data));
      const amounts = rowData.map(row => row['amount']);

      // loop through the amounts and sum them, except for row of interest that we're editing
      // we have to handle "enter" key presses a little differently
      this.distributionTotal = 0;
      for (let i = 0; i < amounts.length; i++) {
        if (i.toString() !== event.rowIndex.toString() || event.event.key === 'Enter') {
          this.distributionTotal += parseFloat(amounts[i].toString());
        }
      }
      // console.log(this.distributionTotal);

      // then we manually add the entered data
      if (event.event.key !== 'Enter') {
        const val = event.event.target.value.toString().replace('$ ', '').replace(/,/g, '');

        this.distributionTotal += parseFloat(val);
      }


    }


  }

  /** Handler to update the invoice total for form processing and locking submission */
  public onInvoiceTotalChange(event: any) {
    this.invoiceTotal = parseFloat(this.invoiceForm.value.Amount.toString());
  }

  /** update the amount totals on row deletion */
  public virtualRowRemoved(event: any) {
    // update totals since we don't have a row anymore
    const rowData = [];
    this.gridApi.forEachNode((node: { data: any; }) => rowData.push(node.data));
    const amounts = rowData.map(row => row['amount']);

    // loop through the amounts and sum them, except for row of interest that we're editing
    // we have to handle "enter" key presses a little differently
    this.distributionTotal = 0;
    for (let i = 0; i < amounts.length; i++) {
      if (i.toString() !== event.rowIndex.toString() || event.event.key === 'Enter') {
        this.distributionTotal += parseFloat(amounts[i].toString());
      }
    }
  }

  // CLEANUP: Remove after test
  /*public onAmountCellChange(event: any) {
    // console.log('on cell change for amount');
    // console.log(event);
  }*/

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

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // resize the cols
    this.gridApi.sizeColumnsToFit();

  }

}
