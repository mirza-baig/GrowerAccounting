import {IApinvoicePaymentFarmDistribution} from '../../models/ap-invoice-payment-farm-distribution.interface';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Component, OnInit, HostListener, OnDestroy} from '@angular/core';
import {fade, slide, fadeInSlideOutRight} from 'src/fieldale-animations';
import {trigger, state, style, transition, animate} from '@angular/animations';
import {IDropdownListItem} from 'src/app/models/dropdown-list-item.interface';
import {IGrowerMaster} from 'src/app/models/grower-master.interface';
import {Observable} from 'rxjs';
import {IVwApvendorMaster} from 'src/app/models/vw-apvendor-master.interface';
import {IGrowerAccount} from 'src/app/models/grower-account.interface';
import {IAccountType} from 'src/app/models/account-type.interface';
import {IGLAccountMaster} from 'src/app/models/gl-account-master.interface';
import {FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import {IApInvoice} from 'src/app/models/ap-invoice.interface';
import {IApgldistributionAccounts} from 'src/app/models/apgldistribution-accounts.interface';
import {IGrowerTransactionBatch} from 'src/app/models/grower-transaction-batch.interface';
import {IGrowerTransaction} from 'src/app/models/grower-transaction.interface';
import {IGLDistributionItem} from 'src/app/grower-invoice/add-grower-invoice/gl-distribution-item.interface';
import {AllModules} from '@ag-grid-enterprise/all-modules';
import {GLDistributionActionsComponent} from 'src/app/grower-invoice/gldistribution-actions/gldistribution-actions.component';
import {NumericEditorComponent} from 'src/app/numeric-editor/numeric-editor.component';
import {IAPVoucher} from 'src/app/models/ap-voucher.interface';
import {MessageService} from '@progress/kendo-angular-l10n';
import {AddGrowerInvoiceService} from 'src/app/grower-invoice/add-grower-invoice/add-grower-invoice.service';
import {AccountMaintenanceService} from 'src/app/account-maintenance/account-maintenance.service';
import {AddGrowerTransactionService} from 'src/app/grower-transactions/add-grower-transaction/add-grower-transaction.service';
import {GrowerTransactionsService} from 'src/app/grower-transactions/grower-transactions.service';
import {DropdownService} from 'src/app/shared/dropdown.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UtilityService} from 'src/app/shared/utility.service';
import {ICurrentUser} from 'src/app/user-management/current-user.interface';
import {map, startWith} from 'rxjs/operators';

import {ToastService} from 'src/app/shared/toast.service';
import {IApinvoicePaymentRequest} from 'src/app/models/ap-invoice-payment-request.interface';
import {AddInvoicePaymentRequestService} from '../add-invoice-payment-request/add-invoice-payment-request.service';
import {IApinvoice} from 'src/app/models/apinvoice.interface';
import {IWorkflowActionHistory} from 'src/app/models/workflow-action-history.interface';
import {InvoiceBatchApprovalService} from '../invoice-batch-approval/invoice-batch-approval.service';
import {GrowerMasterListService} from 'src/app/account-maintenance/grower-master-list/grower-master-list.service';
import {FileModalComponent} from 'src/app/shared/file-modal/file-modal.component';
import {currencyFormatter} from '../../shared/grid-formatters/currency-formatter';


@Component({
  selector: 'app-process-invoice-request-item',
  templateUrl: './process-invoice-request-item.component.html',
  styleUrls: ['./process-invoice-request-item.component.css'],
  animations: [
    fade,
    slide,
    fadeInSlideOutRight,
    trigger('detailExpand', [
      state(
        'collapsed',
        style({height: '0px', minHeight: '0', display: 'none'})
      ),
      state('expanded', style({height: '*'})),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      )
    ])
  ]
})
export class ProcessInvoiceRequestItemComponent implements OnInit, OnDestroy {
  pageTitle = 'Add Grower AP Invoice';
  moduleTitle = 'Invoice';
  innerWidth: any;
  innerHeight: any;

  // url params
  // todo - are these needed?
  voucherId: number;
  id: number;
  token: string;
  growerId: number;
  invoiceId: number = 0;
  lockPage: boolean = false;
  submittedPost: boolean = false;
  invoiceReset: boolean = false;

  private allowedMimeTypes: string[] = [
    'application/pdf',
    'image/bmp',
    'image/gif',
    'image/jpeg',
    'image/png',
    'image/tiff',
    'text/plain',
  ];


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
  growerList: IGrowerMaster[] = [];
  selectedFarm: IGrowerMaster;
  filteredFarms: Observable<IGrowerMaster[]>;
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
  paymentRequestModel: IApinvoicePaymentRequest;
  growerDistributions: IApinvoicePaymentFarmDistribution[] = [];
  selectedGrower: IGrowerMaster;
  isGrowerSelected: boolean = false;
  private blob: Blob;

  // cancel modal
  public commentsForm: FormGroup;
  public commentsModal: boolean = false;


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
      cellStyle: function (params) {
        if (params.data.isLocked) {
          return null;
        } else {
          return {
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
      cellStyle: function (params) {
        if (params.data.isLocked) {
          return null;
        } else {
          return {
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
    private messageService: ToastService,
    private _invoiceService: AddGrowerInvoiceService,
    private _accountService: AccountMaintenanceService,
    private _growerService: GrowerMasterListService,
    private _transactionService: AddGrowerTransactionService,
    private _batchService: GrowerTransactionsService,
    private _dropdownService: DropdownService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _approvalService: InvoiceBatchApprovalService,
    private _paymentRequestService: AddInvoicePaymentRequestService,
    private _utilityService: UtilityService,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    // set width
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;


    // parse the URL?
    this._route.queryParams.subscribe(params => {
      this.id = params['Id'];
      this.growerId = params['GrowerId'];
    });

    this.token = sessionStorage.getItem('token') as string;

    // build the cancel modal form
    this.commentsForm = this._formBuilder.group({
      Comments: new FormControl({
        value: '',
      }, [Validators.required]),
    });
    this.commentsForm.patchValue({Comments: ''});

    // load dropdowns
    this.loadDropdowns();

    // determine which step to jump into
    if (!!this.id) {
      // edit mode
      this.pageTitle = 'Add Grower AP Invoice';
      // this.loadPaymentRequest(this.id);
      // this.loadInvoice(this.id);


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
    if (!!!this.paymentRequestModel.apinvoiceId && !!this.voucher && this.deleteVoucher) {
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

  private loadGrowerList() {
    this._growerService
      .getGrowers(false)
      .subscribe(
        data => {
          try {
            this.growerList = data
              .filter(g => g.status.trim() === 'Active' && g.farmType.toString() !== '3') // ? should we filter out misc farms?
              .map(g => {
                g.farmName = g.farmName.trim();
                return g;
              });


          } catch (e) {
            console.error(e);
          }
        },
        error => {
          console.error(error);
        }
      );
  }

  trackById(index, item: IVwApvendorMaster) {
    return item.vname;
  }

  /** get the payment request and determine if this is an edit or add */
  public loadPaymentRequest(id: number) {
    this._paymentRequestService.getAPInvoicePaymentRequestById(id).subscribe(
      result => {
        this.paymentRequestModel = result;

        // load grower distributions
        this.loadGrowerDistributions(id);
        const user = JSON.parse(localStorage.getItem('ActiveDirectoryUser')) as ICurrentUser;
        this.invoiceModel = {
          account: result.account,
          amount: result.amount,
          company: result.company,
          id: 0,
          vendorId: result.vendorId,
          payDate: result.payDate,
          growerId: result.growerId,
          invoiceDate: result.invoiceDate,
          invoiceNumber: result.invoiceNumber,
          description: result.description,
          remittanceNote: result.remittanceNote,
          separateCheck: result.separateCheck,
          batchId: result.batchId,
          status: 'New'
        } as IApInvoice;

        this.growerId = result.growerId;
        this.isFarmSelected = true;

        this.generateFileForView();
        if (!!result.apinvoiceId) {
          this.invoiceModel.id = parseInt(result.apinvoiceId, 10);
          this._invoiceService.getInvoice(this.invoiceModel.id).subscribe(
            invoiceResult => {
              this.invoiceModel = invoiceResult as IApInvoice;

              this.loadVoucher(this.invoiceModel.apvoucherId);
              this.loadAccountDistributions(this.invoiceModel.id);
              // compute totals-
              this.invoiceTotal = this.invoiceModel.amount;

              this.lockPage = result.status.trim() === 'Exported' || result.status.trim() === 'Posted';
              // this.loadGrowerAccounts(result.growerId);
              this.loadGrowerAccounts(this.growerId);

              this.loadFarmVendorForm(this.invoiceModel);
              this.loadInvoiceForm(this.invoiceModel);

            }, error => {
              console.error(error);
              this.messageService.errorToast(error);
            }
          );


        } else {
          this.loadNextVoucherNumber();

          this.distributions = [];
          this.distributions.push({
            id: 411800,
            name: 'ACCOUNTS RECEIVABLE - GROWER',
            amount: result.amount,
            isLocked: false,
          } as IGLDistributionItem);
          this.distributionTotal = result.amount;


          this.isFarmSelected = true;
          this.growerId = result.growerId;


          // compute totals-
          this.invoiceTotal = this.invoiceModel.amount;

          this.lockPage = result.status.trim() === 'Exported' || result.status.trim() === 'Posted';
          // this.loadGrowerAccounts(result.growerId);
          this.loadGrowerAccounts(this.growerId);
          // load voucher (does not exist yet)
          // this.loadVoucher(this.invoiceModel.apvoucherId);

          // lock the colums if posted
          if (this.lockPage && !!this.gridColumnApi) {
            this.gridColumnApi.getColumn('id').getColDef().editable = false;
            this.gridColumnApi.getColumn('amount').getColDef().editable = false;
          }


          // load both forms
          this.loadFarmVendorForm(this.invoiceModel);
          this.loadInvoiceForm(this.invoiceModel);
        }

      }, error => {
        console.error(error);
        this.messageService.errorToast(error);
      }
    );
  }

  private loadGrowerDistributions(id: number) {
    this._paymentRequestService.getInvoicePaymentFarmDistributions(id).subscribe(result => {
      this.growerDistributions = result;
    }, error => {
      console.error(error);
    });
  }

  public getGrowerName(id: number) {
    const match = this.growerList.find(g => g.id.toString() === id.toString());
    return !!!match ? '' : match.id.toString() + ' - ' + match.farmName;
  }


  /** creates a new voucher and loads it  */
  public loadNextVoucherNumber() {
    // make a new voucher
    this.voucher = {
      id: 0,
      growerId: parseInt(this.paymentRequestModel.growerId.toString(), 10),
      accountNumber: parseInt(this.paymentRequestModel.account.toString(), 10),
      voucherAmount: parseFloat(this.paymentRequestModel.amount.toString()),
    } as IAPVoucher;

    // post it
    this._invoiceService.postVoucher(this.voucher).subscribe(
      data => {
        try {
          this.messageService.successToast('The voucher number is #' + data.data);
          this.voucher.id = parseInt(data.data.toString(), 10);
          this.invoiceForm.patchValue({Voucher: this.voucher.id});
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
      }, [Validators.required]),
      VendorNumber: new FormControl({
        value: '',
      }, [Validators.required, Validators.max(9999)]),
      VendorName: new FormControl({
        value: '',
      }, [Validators.required]),
      GrowerId: new FormControl({
        value: '',
      }, [Validators.required, Validators.max(99999)]),
      GrowerName: new FormControl({
        value: '',
      }, [Validators.required]),
    });

    this.farmVendorForm.patchValue({Company: isAdd ? '4' : model.company.toString()});
    this.farmVendorForm.patchValue({VendorNumber: isAdd ? '' : model.vendorId});
    this.farmVendorForm.patchValue({GrowerId: isAdd ? '' : model.growerId});
    this.farmVendorForm.patchValue({GrowerName: ''});
    this.farmVendorForm.patchValue({VendorName: ''});


    if (!!this.id && this.id > 0 && this.vendorList.length > 0) {

      this.selectedVendor = this.vendorList.find(v => v.vnumb.toString() === this.invoiceModel.vendorId.toString());

      this.farmVendorForm.patchValue({VendorName: this.selectedVendor.vname});
    }

    if (!isAdd && this.growerList.length > 0) {

      this.selectedGrower = this.growerList.find(v => v.id.toString() === model.growerId.toString());

      this.farmVendorForm.patchValue({GrowerName: this.selectedGrower.farmName});
    }

    // mark as touched
    this.farmVendorForm.get('Company').markAsTouched();
    this.farmVendorForm.get('VendorNumber').markAsTouched();
    this.farmVendorForm.get('VendorName').markAsTouched();
    this.farmVendorForm.get('GrowerId').markAsTouched();
    this.farmVendorForm.get('GrowerName').markAsTouched();

    // bind the autocompletes
    this.filteredVendors = this.farmVendorForm.valueChanges.pipe(
      startWith(''),
      map(() =>
        this.filterVendors(this.farmVendorForm.controls['VendorName'].value)
      )
    );

    this.filteredFarms = this.farmVendorForm.valueChanges.pipe(
      startWith(''),
      map(() =>
        this.filterGrowers(this.farmVendorForm.controls['GrowerName'].value)
      )
    );

    if (!isAdd && !!this.farmVendorForm) {

      this.confirmSelections();
    }


    this.farmVendorFormLoaded = true;
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


  /** reset for selecting a grower */
  public selectAnotherGrower() {
    this.isGrowerSelected = false;
  }

  /** event for autocomplete open for the grower */
  public growerAutocompleteOpen() {
    this.selectedGrower = null;
  }

  /** Confirming the selected vendor */
  public confirmGrowerSelection() {
    if (!!this.selectedGrower) {
      this.messageService.infoToast('You have selected grower #' + this.selectedGrower.id + ' - ' + this.selectedGrower.farmName);
      this.isGrowerSelected = true;
    } else {
      this.messageService.errorToast('You must select a valid grower!');
    }
  }

  public growerAutocompleteSelected(event: any) {
    const val = this.farmVendorForm.value.GrowerName;
    const match = this.growerList.find(f => f.farmName.toString() === val.toString());
    this.farmVendorForm.patchValue({GrowerId: match.id});
    this.selectedGrower = match;
  }

  /** used with the number entry to select a farm */
  public growerIdSearch(event: any) {
    const val = this.farmVendorForm.value.GrowerId;
    const match = this.growerList.find(f => f.id.toString() === val.toString());
    if (!!match) {
      this.farmVendorForm.patchValue({GrowerName: match.farmName});
      this.selectedGrower = match;
    } else {
      this.selectedGrower = null;
    }
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
              .sort(function (a, b) {
                return a.accountType.localeCompare(b.accountType) || a.accountSuffix.localeCompare(b.accountSuffix);
              })
              .map(a => {
                a.accountType = this.getAccountType(a.accountType).accountType + ' - ' + a.accountSuffix;
                return a;
              });

            // if the form is loaded and this is an edit, then fill the account
            if (this.invoiceFormLoaded && !!this.id && this.id > 0) {
              this.invoiceForm.patchValue({Account: this.invoiceModel.account});
            }

          } catch (e) {
            console.error(e);
          }
        },
        error => {

          console.error(error);
          this.messageService.errorToast(error);
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
      this.messageService.infoToast('You have selected vendor #' + this.selectedVendor.vnumb + ' - ' + this.selectedVendor.vname);
      this.isVendorSelected = true;
    } else {
      this.messageService.errorToast('You must select a valid vendor!');
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
  // public confirmSelections() {
  //   console.log(this.farmVendorForm.value);
  //   this.companyName = this.farmVendorForm.value.Company + ' - ' + this.companyList.find(c => c.Value === this.farmVendorForm.value.Company).Text;
  //   if (!!!this.selectedVendor) {
  //     console.log(this.vendorList);
  //     this.selectedVendor = this.vendorList.find(v => v.vnumb.toString() === this.farmVendorForm.value.VendorNumber.toString());
  //   }
  //   console.log(this.selectedVendor);
  //   this.showForm = true;
  // }
  public confirmSelections() {
    this.companyName = this.farmVendorForm.value.Company + ' - ' + this.companyList.find(c => c.Value === this.farmVendorForm.value.Company).Text;
    if (!!!this.selectedVendor) {
      this.selectedVendor = this.vendorList.find(v => v.vnumb.toString() === this.farmVendorForm.value.VendorNumber.toString());
    }

    if (!!!this.selectedGrower) {
      this.selectedGrower = this.growerList.find(v => v.id.toString() === this.farmVendorForm.value.GrowerId.toString());

    }
    this.loadGrowerAccounts(this.selectedGrower.id);
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
      }, [Validators.required]),
      Account: new FormControl({
        value: '',
        disabled: this.lockPage,
      }, [Validators.required]),
      InvoiceDate: new FormControl({
        value: '',
        disabled: this.lockPage,
      }, [Validators.required]),
      Amount: new FormControl({
        value: '',
        disabled: this.lockPage,
      }, [Validators.required]),
      InvoiceNumber: new FormControl({
        value: '',
        disabled: this.lockPage,
      }, [Validators.required, Validators.maxLength(23)]),
      Description: new FormControl({
        value: '',
        disabled: this.lockPage,
      }, [Validators.required]),
      RemittanceNote: new FormControl({
        value: '',
        disabled: this.lockPage,
      }),
      SeparateCheck: new FormControl({
        value: false,
        disabled: this.lockPage,
      }),
      PayTo: new FormControl({
        value: false,
        disabled: this.lockPage,
      }),
      Voucher: new FormControl({
        value: voucherNumber,
        disabled: true,
      }, [Validators.required]),
    });

    // patch value empty fix
    this.invoiceForm.patchValue({PayDate: isAdd ? '' : model.payDate});
    this.invoiceForm.patchValue({Account: isAdd ? '' : model.account});
    this.invoiceForm.patchValue({InvoiceDate: isAdd ? '' : model.invoiceDate});
    this.invoiceForm.patchValue({Amount: isAdd ? '' : model.amount});
    this.invoiceForm.patchValue({InvoiceNumber: isAdd ? '' : model.invoiceNumber});
    this.invoiceForm.patchValue({Description: isAdd ? '' : model.description});
    this.invoiceForm.patchValue({RemittanceNote: isAdd ? '' : model.remittanceNote});
    this.invoiceForm.patchValue({Voucher: voucherNumber});
    this.invoiceForm.patchValue({PayTo: isAdd ? '' : model.payTo});
    this.invoiceForm.patchValue({SeparateCheck: ''});

    // mark as touched
    this.invoiceForm.get('PayDate').markAsTouched();
    this.invoiceForm.get('Account').markAsTouched();
    this.invoiceForm.get('InvoiceDate').markAsTouched();
    this.invoiceForm.get('Amount').markAsTouched();
    this.invoiceForm.get('InvoiceNumber').markAsTouched();
    this.invoiceForm.get('Description').markAsTouched();
    this.invoiceForm.get('RemittanceNote').markAsTouched();
    this.invoiceForm.get('Voucher').markAsTouched();

    this.invoiceFormLoaded = true;
    // -- 1 for 10431, 12 for 10130, 33 for 10821, 38 for 10991
    this.invoiceReset = false;

    if (!isAdd && !!this.farmVendorForm) {

      this.confirmSelections();
    }
  }

  public submitInvoice() {
    let valid = true;
    const values = this.invoiceForm.value;
    const headFormVals = this.farmVendorForm.value;
    const distVals = [];
    this.gridApi.forEachNode((node: { data: any; }) => distVals.push(node.data));
    // empty check
    if (distVals.length === 0) {
      valid = false;
      this.messageService.errorToast('You must have at least one GL Account distribution!');
      return;
    }

    // validate the gl account number for each distribution
    distVals.forEach(dist => {
      if (!!!this.glAccountList.find(a => a.id.toString() === dist.id.toString())) {
        this.messageService.errorToast('Invalid GL Account #' + dist.id + '. Please select a valid GL Account');
        valid = false;
        return;
      }
    });

    // until we figure out some alternate option, we also need to validate the distribution total
    this.distributionTotal = distVals.map(a => parseFloat(a.amount.toString())).reduce((a, b) => a + b);
    if (this.distributionTotal !== this.invoiceTotal) {
      this.messageService.errorToast('GL Account distribution amounts must total to equal the invoice amount!');
      valid = false;
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
    const invoiceModelId = this.invoiceModel.id;
    const batchId = this.invoiceModel.batchId;
    // set the invoice model
    this.invoiceModel = {
      id: invoiceModelId,
      company: parseInt(headFormVals.Company.toString(), 10),
      growerId: parseInt(headFormVals.GrowerId.toString(), 10),
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
      status: 'New',
      batchId: batchId,
      payTo: values.PayTo
    } as IApInvoice;


    const account = this.accountList.find(a => a.id.toString() === this.invoiceModel.account.toString());


    // start the post party
    if (valid) {
      this.submittedPost = true;
      this._invoiceService.postInvoice(this.invoiceModel).subscribe(
        invResult => {
          try {
            if (invResult.statusCode === 200) {
              // post voucher
              this.voucher.accountNumber = this.invoiceModel.account;
              this.voucher.voucherAmount = this.invoiceModel.amount;

              this._invoiceService.postVoucher(this.voucher).subscribe(
                voucherResult => {
                  if (voucherResult.statusCode === 200) {
                    // post the GL account distributions
                    // apiResponse.data = "Invoice: " + invoice.Id + "  successfully posted. Invoice data: " + JSONString;

                    this.invoiceModel.id = parseInt(invResult.data.split(' ')[1].toString(), 10);

                    // distributions
                    this.glDistributions = distVals.map(d => {
                      return {
                        amount: parseFloat(d.amount.toString()),
                        id: d.distributionId,
                        growerInvoiceId: this.invoiceModel.id, // invoice id
                        glaccount: parseInt(d.id.toString(), 10),
                      } as IApgldistributionAccounts;
                    });

                    this._invoiceService.postAPGLDistributionAccounts(this.glDistributions).subscribe(
                      glResult => {
                        if (glResult.statusCode === 200) {

                          this.deleteVoucher = false;
                          // since this is getting to deep let's go to another method

                          this.updatePaymentRequest();
                          // this.exportInvoice();
                        }

                      },
                      voucherError => {
                        console.error(voucherError);
                      }
                    );
                  }
                },
                voucherError => {
                  console.error(voucherError);
                }
              );
            }


          } catch (e) {
            console.error(e);
          }
        },
        error => {

          console.error(error);
          this.messageService.errorToast(error);
        }
      );
    }

  }

  public updatePaymentRequest() {
    this.paymentRequestModel.apinvoiceId = this.invoiceModel.id.toString();
    this.paymentRequestModel.status = 'Approved';
    this.paymentRequestModel.stage = 'Invoice Processing';
    this.paymentRequestModel.apvoucherId = this.voucher.id;
    this.paymentRequestModel.payDate = this.invoiceModel.payDate;

    this._paymentRequestService.postAPInvoicePaymentRequest(this.paymentRequestModel).subscribe(
      result => {
        if (result.statusCode === 200) {
          this.messageService.successToast('You have successfully completed the payment request. Please wait while we load the next invoice payment request.');
          this.getNextInvoice();
        }

      }, error => {
        console.error(error);
        this.messageService.errorToast(error);
      }
    );
  }

  /** get the next available invoice number or return to home */
  public getNextInvoice() {
    this.invoiceReset = true;
    const user = JSON.parse(localStorage.getItem('ActiveDirectoryUser')) as ICurrentUser;
    this._paymentRequestService.getNextPaymentRequestInBatch(this.paymentRequestModel.batchId).subscribe(
      result => {
        if (!!!result || result.id === 0) {
          this.messageService.successToast('You have successfully completed all invoices in this batch!');
          setTimeout(() => {
            this.returnToList();
          }, 2000);
        } else {
          // we have to reload the whole page
          this.paymentRequestModel = result;
          this.id = result.id;
          this.growerId = this.paymentRequestModel.growerId;

          this.invoiceModel = {
            account: result.account,
            amount: result.amount,
            company: result.company,
            id: 0,
            vendorId: result.vendorId,
            payDate: result.payDate,
            growerId: result.growerId,
            invoiceDate: result.invoiceDate,
            invoiceNumber: result.invoiceNumber,
            description: result.description,
            remittanceNote: result.remittanceNote,
            separateCheck: result.separateCheck,
            status: 'New',
            batchId: result.batchId,
            payTo: result.payTo
          } as IApInvoice;


          this.loadGrowerDistributions(result.id);
          // reset the file stuff
          this.generateFileForView();

          this.loadNextVoucherNumber();

          this.distributions = [];
          this.distributions.push({
            id: 411800,
            name: 'ACCOUNTS RECEIVABLE - GROWER',
            amount: result.amount,
            isLocked: false,
          } as IGLDistributionItem);
          this.distributionTotal = result.amount;


          this.isFarmSelected = true;
          this.growerId = result.growerId;


          // compute totals-
          this.invoiceTotal = this.invoiceModel.amount;
          this.distributionTotal = this.invoiceModel.amount;

          this.lockPage = result.status.trim() === 'Exported' || result.status.trim() === 'Posted';
          // this.loadGrowerAccounts(result.growerId);
          this.loadGrowerAccounts(this.growerId);
          // load voucher (does not exist yet)
          // this.loadVoucher(this.invoiceModel.apvoucherId);

          // lock the colums if posted
          if (this.lockPage && !!this.gridColumnApi) {
            this.gridColumnApi.getColumn('id').getColDef().editable = false;
            this.gridColumnApi.getColumn('amount').getColDef().editable = false;
          }


          // load both forms
          this.loadFarmVendorForm(this.invoiceModel);
          this.loadInvoiceForm(this.invoiceModel);

          this.submittedPost = false;
        }
      }
    );
  }

  /** export the invoice by posting it */
  public exportInvoice() {
    this.invoiceModel.status = 'Posted';
    this._invoiceService.postInvoice(this.invoiceModel).subscribe(result => {
      if (result.statusCode === 200) {
        // no longer used (done in api)
        // this.convertToTransactions();
        this.messageService.successToast('You have successfully submitted the invoice');
        setTimeout(() => {
          this.submittedPost = false;
          this._router.navigateByUrl(
            'GrowerInvoiceListComponent'
          );
        }, 1000);
      } else {
        this.messageService.errorToast('An error occurred while trying to process your request. Please submit the form again');
        this.submittedPost = false;
      }
    }, error => {
      console.error(error);
      this.messageService.errorToast(error);
      this.submittedPost = false;
    });

  }


  public returnToList() {
    this._router.navigateByUrl(
      'ProcessInvoiceRequestsComponent?batchId=' + this.paymentRequestModel.batchId
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
        this.messageService.errorToast(error);
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
        this.messageService.errorToast(error);
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
        this.messageService.errorToast(error);
      }
    );
  }

  /** mark the invoice as cancelled */
  public confirmCancel() {
    const action = {
      id: 0,
      actionTaken: 'Cancelled',
      comment: this.commentsForm.value.Comments,
      date: new Date(),
      workflowContactId: 0, // todo - get the current user's id
      stage: 'Invoice Processing',
      invoicePaymentRequestId: parseInt(this.id.toString(), 10),
    } as IWorkflowActionHistory;
    // todo - submit to the approval action method
    const actions = [];
    actions.push(action);
    this._approvalService.submitApprovalActions(actions).subscribe(
      result => {
        this.messageService.successToast('You have successfully cancelled this item!');
        setTimeout(() => {
          this.returnToList();
        }, 2000);
      }, error => {
        console.error(error);
        this.messageService.errorToast('error');
      }
    );

    this.commentsModal = false;
  }

  /***************************************************
   * Load Dropdowns
   **************************************************/

  /** centralize the dropdown loading */
  private loadDropdowns() {
    this.loadAccountTypeList().then(() => {
      this.loadGrowerList();
      this.loadGLAccountList();

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
            this.messageService.errorToast(error);
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
            this.loadVendorList();


          } catch (e) {
            console.error(e);
          }
        },
        error => {

          console.error(error);
          this.messageService.errorToast(error);
        }
      );
  }

  /** Load the vendor dropdown list */
  private loadVendorList() {
    // since the call takes 10 seconds, we just cached it on app init and retrieve it from there
    this.vendorList = JSON.parse(localStorage.getItem('APVendorList')) as IVwApvendorMaster[];

    // todo - verify it works
    if (!!this.id && this.id > 0) {
      if (this.farmVendorFormLoaded) {
        this.farmVendorForm.patchValue({VendorName: this.vendorList.find(v => v.vnumb.toString() === this.invoiceModel.vendorId.toString()).vname});
      }

      this.loadPaymentRequest(this.id);
    }
    this.dropdownsLoaded = true;


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
            // todo - if this has been exported alreayd, then we do this step
            // if (!!this.id && this.id > 0) {
            //   this.loadAccountDistributions(this.id);
            // }

            this.loadCompanyList();

          } catch (e) {
            console.error(e);
          }
        },
        error => {

          console.error(error);
          this.messageService.errorToast(error);
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
    const newItem = {id: 0, name: 'Enter Account #', amount: 0, distributionId: 0} as IGLDistributionItem;
    templist.push(newItem);
    this.gridApi.updateRowData({add: templist});
    this.messageService.infoToast('Please enter the GL Account information');
  }

  public cellKeyDown(event: any) {
    // console.log('key down');
    // console.log(event);
  }

  /**  */
  public onCellChange(event: any) {
    // console.log(event);
    // only do our event if it is the first column (AD) for matching account name
    if (event.colDef.field === 'id') {
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
    if (!!event.event) {
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

  }

  // CLEANUP remove after testing
  /*
  public onAmountCellChange(event: any) {
  }*/


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

  /** make the conversions to the file data to generate a blob (and update the parent grid) */
  public generateFileForView() {
    if (!!!this.paymentRequestModel.fileName) {
      this.blob = null;
    } else {
      const byteCharacters = atob(this.paymentRequestModel.fileData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      this.blob = new Blob([byteArray], {type: this.paymentRequestModel.mimeType});
    }


    // this.displayFile();
  }

  /** create a url from the blob and render it */
  public displayFile() {
    const url = window.URL.createObjectURL(this.blob);
    if (this.allowedMimeTypes.includes(this.paymentRequestModel.mimeType)) {
      this.dialog.open(FileModalComponent, {
        data: {
          url: url,
          width: (this.innerWidth * 0.75),
          height: (this.innerHeight * 0.90),
          fileName: this.paymentRequestModel.fileName,
          mimeType: this.paymentRequestModel.mimeType,
        },
        width: (this.innerWidth * 0.8).toString() + 'px',
        height: (this.innerHeight * 0.95).toString() + 'px',
      });
    } else {
      const anchor = document.createElement('a');
      anchor.download = this.paymentRequestModel.fileName;
      anchor.href = url;
      anchor.click();
    }


    // console.log(url);
    // const anchor = document.createElement('a');
    // anchor.download = this.paymentRequestModel.fileName;
    // anchor.href = url;
    // anchor.click();
  }


}
