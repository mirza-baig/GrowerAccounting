import { IGrowerMaster } from './../../models/grower-master.interface';

import { Component, OnInit, HostListener, ViewChild, OnDestroy, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { IApinvoicePaymentRequest } from 'src/app/models/ap-invoice-payment-request.interface';
import { IVwApvendorMaster } from 'src/app/models/vw-apvendor-master.interface';
import { IDropdownListItem } from 'src/app/models/dropdown-list-item.interface';
import { AddInvoicePaymentRequestService } from './add-invoice-payment-request.service';
import { GrowerMasterListService } from 'src/app/account-maintenance/grower-master-list/grower-master-list.service';
import { UtilityService } from 'src/app/shared/utility.service';
import { DropdownService } from 'src/app/shared/dropdown.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/shared/toast.service';
import { IApinvoicePaymentFarmDistribution } from 'src/app/models/ap-invoice-payment-farm-distribution.interface';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { fade, slide, fadeInSlideOutRight } from 'src/fieldale-animations';
import { trigger, state, style, transition, animate } from '@angular/animations';
import {interval, Observable, Subject} from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { IGrowerAccount } from 'src/app/models/grower-account.interface';
import { IGrowerAccountType } from 'src/app/models/grower-account-type.interface';
import { AccountMaintenanceService } from 'src/app/account-maintenance/account-maintenance.service';
import { IFarmDistributionVM } from './farm-distribution-actions/farm-distribution-vm.interface';
import { NumericEditorComponent } from 'src/app/numeric-editor/numeric-editor.component';
import { FarmDistributionActionsComponent } from './farm-distribution-actions/farm-distribution-actions.component';
import {FileUploadModule, FileUpload} from 'primeng/fileupload';
import { AccountDropdownComponent } from './account-dropdown/account-dropdown.component';
import { MatCheckboxChange } from '@angular/material';
import {debounceTime} from 'rxjs/operators';
import {debounce} from 'rxjs-compat/operator/debounce';
import {currencyFormatter} from '../../shared/grid-formatters/currency-formatter';

@Component({
  selector: 'app-add-invoice-payment-request',
  templateUrl: './add-invoice-payment-request.component.html',
  styleUrls: ['./add-invoice-payment-request.component.css'],
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
export class AddInvoicePaymentRequestComponent implements OnInit {
  pageTitle = 'Invoice Payment Request List for Batch #';
  moduleTitle = 'Invoice';
  innerWidth: number;
  innerHeight: number;
  @ViewChild('fileInput') fileInput: FileUpload;

  // url
  id: number;
  batchId: number;
  isAdd: boolean = true;

  // dropdowns
  growerList: IGrowerMaster[] = [];
  vendorList: IVwApvendorMaster[] = [];
  companyList: IDropdownListItem[] = [];
  accountList: IGrowerAccount[] = [];
  accountTypeList: IGrowerAccountType[] = [];
  filteredVendors: Observable<IVwApvendorMaster[]>;
  filteredFarms: Observable<IGrowerMaster[]>;
  dropdownsLoaded: boolean = false;

  // vendor/farm form
  farmVendorForm: FormGroup;
  farmVendorFormLoaded: boolean = false;
  selectedVendor: IVwApvendorMaster;
  selectedGrower: IGrowerMaster;
  isVendorSelected: boolean = false;
  isGrowerSelected: boolean = false;
  companyName: string;
  vendorLength: number = 0;


  // payment request model/form
  paymentRequest: IApinvoicePaymentRequest;
  paymentRequestForm: FormGroup;
  paymentRequestFormLoaded: boolean = false;
  showForm: boolean = false;
  submittedPost: boolean = false;
  invoiceTotal: number = 0;
  distributionTotal: number = 0;
  multipleGrowers: boolean = false;
  files: any[] = [];
  invoiceFile: File;
  fileData: any;
  duplicateModal: boolean = false;
  duplicateSubmission: boolean = true;
  isFileExempt: boolean = false;


  // farm distributions
  farmDistributions: IApinvoicePaymentFarmDistribution[] = [];
  distributions: IFarmDistributionVM[] = [];
  colDefs = [
    {
      headerName: 'Grower',
      field: 'growerId',
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
      headerName: 'Account',
      field: 'growerId2',
      cellRenderer: 'accountEditor',
      // need an on type event
      width: 150,

      // onCellKeyPress : this.onGLAccountChange
    },
    {
      headerName: 'Amount',
      field: 'amount',
      valueFormatter: currencyFormatter,
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

  public gridApi;
  public gridColumnApi;
  modules = AllModules;
  public frameworkComponents = {
    actionsRenderer: FarmDistributionActionsComponent,
    numericEditor: NumericEditorComponent,
    accountEditor: AccountDropdownComponent,
  };

  public onCellChangedSubject: Subject<any>;

  constructor(
    private _invoiceService: AddInvoicePaymentRequestService,
    private _growerService: GrowerMasterListService,
    private _accountService: AccountMaintenanceService,
    private _dropdownService: DropdownService,
    private _messageService: ToastService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute,

  ) {
    this.onloadend = this.onloadend.bind(this);


   }

  ngOnInit() {
    this.onCellChangedSubject = new Subject<any>();
    // set up debounce for onCellChanged to keep grid callbacks down
    this.onCellChangedSubject
      .pipe(debounceTime(1000))
      .subscribe((event) => {
        this.onCellChangeBL(event);
    });

    // set dimensions
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

    // get the url parameter to determine if an add or edit
    this._route.queryParams.subscribe(params => {
      this.id = params['Id'] as number;
    });

    if (!!this.id && this.id > 0) {
      this.isAdd = false;

    } else {
      // get the batch id instead
      this._route.queryParams.subscribe(params => {
        this.batchId = params['BatchId'] as number;
      });
      this.id = 0;
      this.paymentRequest = {
        id: 0,
        status: 'New',
        batchId: parseInt(this.batchId.toString(), 10),
        payDate: null,
        remittanceNote: null,
        separateCheck: null,
        apvoucherId: null,
        fileData: null,
        stage: 'New',
        apinvoicePaymentFarmDistribution: [],
      } as IApinvoicePaymentRequest;
    }

    // start the loads
    this.loadAccountTypes();
  }
  /***************************************************
   * Dropdowns
   **************************************************/

  private loadAccountTypes() {
    this._dropdownService.getAccountTypes().subscribe(
      result => {
        this.accountTypeList = result;
        sessionStorage.setItem('AccountTypes', JSON.stringify(this.accountTypeList));
        this.loadVendorList();
      }, error => {
        this._messageService.errorToast(error);
        console.error(error);
      }
    );
  }

  /** load the vendor list from storage */
  private loadVendorList() {
    this.vendorList = JSON.parse(localStorage.getItem('APVendorList')) as IVwApvendorMaster[];
    this.vendorList = this.vendorList.map(v => {
      v.vname = !!v.vname ? v.vname.trim().toUpperCase() : '';
      return v;
    });
    this.loadCompanyList();
  }

  /** load the company dropdown list */
  private loadCompanyList() {
    this._dropdownService
    .getCompanies()
    .subscribe(
      data => {
        try {
          this.companyList = data;
          this.loadGrowerList();
        } catch (e) {
          console.error(e);
        }
      },
      error => {
        console.error(error);
      }
    );
  }


  /** load the grower master list */
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
          this.dropdownsLoaded = true;
          if (this.isAdd) {
            this.buildFarmVendorForm(null);
          } else {
            this.loadPaymentRequest(this.id);
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

  private loadAccountList(id: number) {
    this._accountService.getGrowerAccounts(id).subscribe(
      result => {
        this.accountList = result.filter(a => a.accountType.toString() !== '5').map(a => {
          const match = this.accountTypeList.find(at => at.id.toString() === a.accountType);
          a.accountType = match.accountType + ' - ' + a.accountSuffix;
          return a;
        });
        if (this.isAdd) {
          // can default the form to 0
          this.paymentRequestForm.patchValue({ Account: this.accountList.find(a => a.accountType === 'Regular - A').id });
          this.paymentRequestForm.get('Account').markAsTouched();
        }
      }, error => {
        this._messageService.errorToast(error);
        console.error(error);
      }
    );
  }

  /***************************************************
   * Data Retrieval
   **************************************************/
  private loadPaymentRequest(id: number) {
    this._invoiceService.getAPInvoicePaymentRequestById(id).subscribe(
      result => {
        this.paymentRequest = result;
        this.batchId = result.batchId;
        this.invoiceTotal = result.amount;


        // todo - load the file
        if (!!this.paymentRequest.fileName) {
          const byteCharacters = atob(this.paymentRequest.fileData);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], {type: this.paymentRequest.mimeType});
          const f = new File([blob], this.paymentRequest.fileName);



          this.invoiceFile = f;
          this.files.push(f);
          this.addExistingFile();
        } else {
          // todo - mark the checkbox
        }

        // this.urltoFile('data:text/plain;base64,' + result.fileData, 'hello.txt','text/plain')
        //   .then(function(file){
        //     console.log('fook');
        //     console.log(file);
        //   });

        this.loadDistributions(id);
      }, error => {
        console.error(error);
        this._messageService.errorToast(error);
      }
    );
  }

  public addExistingFile() {
    // TODO: Why are we using setTimeout
    if (!!!this.fileInput) {
      setTimeout(() => {
        this.addExistingFile();
      }, 1000);
    } else {
      this.fileInput.files.push(this.invoiceFile);
    }
  }



  public onFileExemptChange(event: any) {
    this.isFileExempt = event.checked.toString() === 'true';
  }

// Usage example:

  private loadDistributions(id: number) {
    this._invoiceService.getInvoicePaymentFarmDistributions(id).subscribe(
      result => {
        this.farmDistributions = result;


        this.distributions = [];
        result.forEach(d => {
          const match = this.growerList.find(g => g.id.toString() === d.growerId.toString());
          this.distributionTotal += d.amount;


          this._accountService.getAccountById(d.growerAccountId).subscribe(
            account => {
              const accountMatch = this.accountTypeList.find(at => at.id.toString() === account.accountType.toString());
              const accountType = accountMatch.accountType + ' - ' + account.accountSuffix;
              const item = {
                id: d.id,
                isLocked: false,
                growerId: d.growerId,
                growerId2: d.growerId,
                amount: d.amount,
                growerAccountId: d.growerAccountId,
                growerAccountName: accountType,
                name: !!!match ? 'Invalid' : match.id + ' - ' + match.farmName
              } as IFarmDistributionVM;

              this.distributions.push(item);

              // determine when to break the loop
              if (this.distributions.length === result.length) {
                // determine if multiple or not
                if (this.distributions.length > 1) {
                  this.multipleGrowers = true;
                }
                // now load the form
                this.buildFarmVendorForm(this.paymentRequest);
              }

            }, error => {
              console.error(error);
            }
          );


        });

        // CLEANUP: we need to delete dead code
        // this.distributions = result.map(d => {
        //   const match = this.growerList.find(g => g.id.toString() === d.growerId.toString());
        //   this.distributionTotal += d.amount;
        //   return ;
        // });

        /**
         * this._accountService.getGrowerAccounts(id).subscribe(
      result => {
        this.accountList = result.map(a => {
          const match = this.accountTypeList.find(at => at.id.toString() === a.accountType);
          a.accountType = match.accountType + ' - ' + a.accountSuffix;
          return a;
        });
        console.log(this.accountList);
      }, error => {
        this._messageService.errorToast(error);
        console.log(error);
      }
    );
         *
         */


      }, error => {
        console.error(error);
        this._messageService.errorToast(error);
      }
    );
  }

  /***************************************************
   * Main Form Building/Submission
   **************************************************/

  private buildPaymentRequestForm(model: IApinvoicePaymentRequest) {
    this.paymentRequestForm = this._formBuilder.group({
      InvoiceDate: new FormControl({
        value: '',
      }, [ Validators.required]),
      Account: new FormControl({
        value: '',
      }, [ Validators.required]),
      Amount: new FormControl({
        value: '',
      }, [ Validators.required]),
      InvoiceNumber: new FormControl({
        value: '',
      }, [ Validators.required,  Validators.maxLength(23)]),
      Description: new FormControl({
        value: '',
      }, [ Validators.required]),
      FileExempt: new FormControl({
        value: '',
      }),
      InvoiceFile: new FormControl({
        value: '',
      }),
      PayTo: new FormControl({
        value: '',
      }),
    });

    // patch value empty fix
    this.paymentRequestForm.patchValue({ PayDate: this.isAdd ? '' : model.payDate });
    this.paymentRequestForm.patchValue({ Account: this.isAdd ? '' : model.account });
    this.paymentRequestForm.patchValue({ InvoiceDate: this.isAdd ? '' : model.invoiceDate });
    this.paymentRequestForm.patchValue({ Amount: this.isAdd ? '' : model.amount });
    this.paymentRequestForm.patchValue({ InvoiceNumber: this.isAdd ? '' : model.invoiceNumber });
    this.paymentRequestForm.patchValue({ Description: this.isAdd ? '' : model.description });
    this.paymentRequestForm.patchValue({ PayTo: this.isAdd ? '' : model.payTo });
    this.paymentRequestForm.patchValue({ FileExempt: false });

    if (!!model && !!!model.fileName) {
      this.isFileExempt = true;
      this.paymentRequestForm.patchValue({ FileExempt: true });
    }

    // todo - determine file

    // mark as touched
    this.paymentRequestForm.get('Account').markAsTouched();
    this.paymentRequestForm.get('InvoiceDate').markAsTouched();
    this.paymentRequestForm.get('Amount').markAsTouched();
    this.paymentRequestForm.get('InvoiceNumber').markAsTouched();
    this.paymentRequestForm.get('Description').markAsTouched();
    // this.invoiceForm.get('GLDistribution').markAsTouched();
    // this.invoiceForm.get('SeparateCheck').markAsTouched();

    this.paymentRequestFormLoaded = true;

    if (!this.isAdd) {

      this.confirmSelections();
    }
  }

  trackById(index, item: IVwApvendorMaster) {
    return item.vname;
  }

  trackByGrower(index, item: IGrowerMaster) {
    return item.farmName;
  }


  /** Handler to update the invoice total for form processing and locking submission */
  public onInvoiceTotalChange(event: any) {
    this.invoiceTotal = parseFloat(this.paymentRequestForm.value.Amount.toString());
  }

  /** submits to the server and then fills the page with a lot for submission */
  public submitDuplicate() {

    // we need to reset the attachment, the invoice number, and the amount
    this.paymentRequest.invoiceNumber = '';
    this.paymentRequest.amount = 0;
    this.paymentRequest.id = 0;
    // file fields
    this.paymentRequest.fileName = '';
    this.paymentRequest.fileData = '';
    this.paymentRequest.fileSize = 0;
    this.paymentRequest.mimeType = '';

    // patch the form
    this.paymentRequestForm.patchValue({ InvoiceNumber: ''});
    this.paymentRequestForm.patchValue({ Amount: ''});
    this.paymentRequestForm.get('Amount').markAsTouched();
    this.paymentRequestForm.get('InvoiceNumber').markAsTouched();

    // reset the file uploader
    this.fileInput.files = [];
    this.invoiceFile = null;
    this.files = [];

    // reset distributions
    this.distributions = [];
    this.farmDistributions = [];
    if (!!this.gridApi) {
      this.gridApi.setRowData([]);
    }

    this.multipleGrowers = false;
    this.invoiceTotal = 0;
    this.distributionTotal = 0;

    // "reload" the page
    this._messageService.successToast('You have successfully submitted the invoice payment request');
    setTimeout(() => {
      this.submittedPost = false;
      this.duplicateSubmission = false;
      this.duplicateModal = false;
    }, 1000);
  }

  public submitPaymentRequest(returnToBatch: boolean) {
    // add a flag in case this is a duplicate or not
    this.duplicateSubmission = this.duplicateModal;

    this.submittedPost = true;
    let valid = true;
    const farmVals = this.farmVendorForm.value;
    const vals = this.paymentRequestForm.value;
    // todo - validate the distribution totals

    if (!this.paymentRequestForm.valid) {
      valid = false;
      this._messageService.errorToast('Please fill out all required fields!');
    }

    if (!this.isFileExempt && (this.files.length === 0 || !!!this.invoiceFile || !!!this.paymentRequest.fileData)) {
      valid = false;
      this._messageService.errorToast('You must upload a file with the invoice payment request!');
    }

    if (vals.InvoiceNumber.toString().length > 23) {
      valid = false;
      this._messageService.errorToast('Invoice numbers cannot exceed 23 digits in length!');
    }



    // if a single distribution then we have to make our list of a distribution
    if (!this.multipleGrowers && this.farmDistributions.length === 0) {
      this.farmDistributions.push({
        id: 0,
        growerId: parseInt(farmVals.GrowerId.toString(), 10),
        growerAccountId: parseInt(vals.Account.toString(), 10),
        amount: parseFloat(vals.Amount),
        paymentRequestId: 0,
      } as IApinvoicePaymentFarmDistribution);
    } else if (this.multipleGrowers) {
      // grab the grid of distributions
      const dists = [];
      this.gridApi.forEachNode((node: { data: any; }) => dists.push(node.data));

      this.farmDistributions = dists.map(d => {
        return {
          id: parseInt(d.id.toString(), 10),
          growerId: parseInt(d.growerId.toString(), 10),
          amount: parseFloat(d.amount),
          growerAccountId: parseInt(d.growerAccountId.toString(), 10),
          paymentRequestId: this.paymentRequest.id,
        } as IApinvoicePaymentFarmDistribution;
      });

      // this.distributions
    }

    //  validate growers on distributions
    this.farmDistributions.forEach(dist => {
      const grower = this.growerList.find(g => g.id.toString() === dist.growerId.toString());
      if (!!!grower) {
        valid = false;
        this._messageService.errorToast('Invalid Farm of ' + dist.growerId + ' for distribution!');
      }
      if (!!!dist.growerAccountId || dist.growerAccountId === 0) {
        valid = false;
        this._messageService.errorToast('Invalid Account for ' + dist.growerId + ' distribution!');
      }
    });

    this.paymentRequest.apinvoicePaymentFarmDistribution = this.farmDistributions;

    // gather more form values
    this.paymentRequest.company = parseInt(farmVals.Company.toString(), 10);
    this.paymentRequest.farm = parseInt(this.selectedGrower.id.toString(), 10);
    this.paymentRequest.vendorId = parseInt(this.selectedVendor.vnumb.toString(), 10);
    this.paymentRequest.account = parseInt(vals.Account.toString(), 10);
    this.paymentRequest.invoiceDate = vals.InvoiceDate;
    this.paymentRequest.amount = parseFloat(vals.Amount);
    this.paymentRequest.invoiceNumber = vals.InvoiceNumber.toString();
    this.paymentRequest.description = vals.Description;
    this.paymentRequest.growerId = parseInt(farmVals.GrowerId.toString(), 10);
    this.paymentRequest.payTo = vals.PayTo;
    this.paymentRequest.stage = 'New'; // it always will be
    // CLEANUP: remove dead code
    // this.paymentRequest.fileData = JSON.stringify(this.invoiceFile);

    // todo - post the models
    if (!valid) {
      this.submittedPost = false;
    } else {
      this._invoiceService.postAPInvoicePaymentRequest(this.paymentRequest).subscribe(
        result => {
          if (result.statusCode !== 200) {
            this._messageService.errorToast(result.data);
            this.submittedPost = false;
          } else {
            if (this.duplicateSubmission) {
              this.submitDuplicate();
            } else {
              this._messageService.successToast('You have successfully submitted the invoice payment request');
              if (returnToBatch) {
                setTimeout(() => {
                  this.submittedPost = false;
                  this.returnToList();
                }, 1000);
              } else {
                // reset the batch
                this.id = 0;
                this.isAdd = true;
                this.paymentRequest = {
                  id: 0,
                  status: 'New',
                  batchId: parseInt(this.batchId.toString(), 10),
                  payDate: null,
                  remittanceNote: null,
                  separateCheck: null,
                  apvoucherId: null,
                  fileData: null,
                  stage: 'New',
                  apinvoicePaymentFarmDistribution: [],
                } as IApinvoicePaymentRequest;
                this.distributions = [];
                this.distributionTotal = 0;
                this.farmDistributions = [];

                // reset the file uploader
                this.fileInput.files = [];
                this.invoiceFile = null;
                this.files = [];
                this.isFileExempt = false;

                // reset distributions
                this.distributions = [];
                this.farmDistributions = [];
                if (!!this.gridApi) {
                  this.gridApi.setRowData([]);
                }

                this.multipleGrowers = false;
                this.invoiceTotal = 0;
                this.distributionTotal = 0;
              }
              this.buildFarmVendorForm(null);
              this.showForm = false;
              setTimeout(() => {
                this.submittedPost = false;
              }, 1000);
            }

          }
        }, error => {
          console.error(error);
          this._messageService.errorToast(error);
        }
      );
    }

  }

  /***************************************************
   * Farm Distributions
   **************************************************/

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

  public onCellChange(event: any) {
    this.onCellChangedSubject.next(event);
  }

  public onCellChangeBL(event: any) {
    // only do our event if it is the first column (AD) for matching account name
    if (event.colDef.field === 'growerId')  {

      // search the GL account list
      // event.RowIndex will tell us which line to modify
      const attempt = this.growerList.find(a => a.id.toString() === event.event.target.value.toString());
      // console.log(event.event.target.value.toString());
      if (!!attempt) {
        const name = attempt.farmName.trim();
        event.node.setDataValue('name', name);

      } else {
        // input is invalid
        event.node.setDataValue('name', 'Enter Grower #');
      }

      // will this work?
      event.node.setDataValue('growerId2', event.event.target.value.toString());
      // do we need to refresh?


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

   /** Add a Grower distribution */
   public addDistribution() {
    const templist = [];
    const newItem = { id: parseInt(this.id.toString(), 10), growerId: 0, growerAccountId: 0, name: 'Enter Grower #', amount: 0, } as IFarmDistributionVM;
    templist.push(newItem);
    this.gridApi.updateRowData({ add: templist });
    this._messageService.infoToast('Please enter the Grower information');
  }

  /** add a default farm distribution */
  public enableMultipleGrowers() {
    if (this.isAdd) {
      const growerId = parseInt(this.farmVendorForm.value.GrowerId, 10);
      let amount = this.paymentRequestForm.value.Amount;
      amount = !!amount ? parseFloat(amount) : 0;
      this.distributionTotal = amount;

      const account = this.paymentRequestForm.value.Account;
      const accountId = !!account ? parseInt(account.toString(), 10) : 0;

      this.farmDistributions.push({
        id: 0,
        growerId: growerId,
        amount: amount,
        paymentRequestId: 0,
        growerAccountId: accountId,
      } as IApinvoicePaymentFarmDistribution);
      this.distributions.push({
        id: 0,
        growerId: growerId,
        amount: amount,
        name: this.selectedGrower.farmName,
        paymentRequestId: 0,
        growerAccountId: accountId,
        isLocked: false,
      } as IFarmDistributionVM);
    }

    this.multipleGrowers = true;
  }


   /***************************************************
   * Vendor Form Building/Submission
   **************************************************/
  private buildFarmVendorForm(model: IApinvoicePaymentRequest) {
    this.farmVendorForm = this._formBuilder.group({
      Company: new FormControl({
        value: '4',
      }, [ Validators.required]),
      VendorNumber: new FormControl({
        value: '',
      }, [ Validators.required, Validators.max(9999)]),
      VendorName: new FormControl({
        value: '',
      }, [ Validators.required]),
      GrowerId: new FormControl({
        value: '',
      }, [ Validators.required, Validators.max(99999)]),
      GrowerName: new FormControl({
        value: '',
      }, [ Validators.required]),
    });

    // patch values as needed
    this.farmVendorForm.patchValue({ Company: this.isAdd ? '4' : model.company.toString() });
    this.farmVendorForm.patchValue({ VendorNumber: this.isAdd ? '' : model.vendorId });
    this.farmVendorForm.patchValue({ GrowerId: this.isAdd ? '' : model.growerId });
    this.farmVendorForm.patchValue({ GrowerName: '' });
    this.farmVendorForm.patchValue({ VendorName: '' });



    if (!this.isAdd && this.vendorList.length > 0) {

      this.selectedVendor = this.vendorList.find(v => v.vnumb.toString() === model.vendorId.toString());

      this.farmVendorForm.patchValue({ VendorName: this.selectedVendor.vname });
    }

    if (!this.isAdd && this.growerList.length > 0) {

      this.selectedGrower = this.growerList.find(v => v.id.toString() === model.growerId.toString());

      this.farmVendorForm.patchValue({ GrowerName: this.selectedGrower.farmName });
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

    this.farmVendorFormLoaded = true;

    this.buildPaymentRequestForm(model);
  }

  /** filter the vendor list for the autocomplete */
  private filterVendors(value: Object): IVwApvendorMaster[] {
    this.vendorLength = !!!value ? 0 : value.toString().length;
    if (!!value && this.vendorLength >= 2) {
    // if (!!value) {

      const list = this.vendorList.filter(vendor =>
        vendor.vname.includes(
          this.toUpperNullable(value.toString())
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
      this._messageService.infoToast('You have selected vendor #' + this.selectedVendor.vnumb + ' - ' + this.selectedVendor.vname);
      this.isVendorSelected = true;
    } else {
      this._messageService.errorToast('You must select a valid vendor!');
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
      this._messageService.infoToast('You have selected grower #' + this.selectedGrower.id + ' - ' + this.selectedGrower.farmName);
      this.isGrowerSelected = true;
    } else {
      this._messageService.errorToast('You must select a valid grower!');
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

  /** Save the confirmed form values */
  public confirmSelections() {
    this.companyName = this.farmVendorForm.value.Company + ' - ' + this.companyList.find(c => c.Value === this.farmVendorForm.value.Company).Text;
    if (!!!this.selectedVendor) {
      this.selectedVendor = this.vendorList.find(v => v.vnumb.toString() === this.farmVendorForm.value.VendorNumber.toString());
    }

    if (!!!this.selectedGrower) {
      this.selectedGrower = this.growerList.find(v => v.id.toString() === this.farmVendorForm.value.GrowerId.toString());

    }

    const gmatch = this.growerList.findIndex(g => g.id.toString() === this.farmVendorForm.value.GrowerId.toString()
      && g.farmName === this.farmVendorForm.value.GrowerName.toString());
    const vmatch = this.vendorList.findIndex(v => v.vnumb.toString() === this.farmVendorForm.value.VendorNumber.toString()
      && v.vname === this.farmVendorForm.value.VendorName.toString());

    if (gmatch === -1) {
      this._messageService.errorToast('Please select a valid grower');
    }
    if (vmatch === -1) {
      this._messageService.errorToast('Please select a valid vendor');
    }

    if (vmatch !== -1 && gmatch !== -1) {
      this.loadAccountList(this.selectedGrower.id);
      this.showForm = true;
    }


  }

  /** resets the form to go back a step */
  public resetSelection() {
    const vals = this.farmVendorForm.value;
    if (!this.isAdd && this.vendorList.length > 0 && !!!vals.VendorName) {

      this.selectedVendor = this.vendorList.find(v => v.vnumb.toString() === this.paymentRequest.vendorId.toString());
      this.farmVendorForm.patchValue({ VendorName: this.selectedVendor.vname });
    }

    if (!this.isAdd && this.growerList.length > 0 && !!!vals.GrowerName) {
      this.selectedGrower = this.growerList.find(v => v.id.toString() === this.paymentRequest.growerId.toString());
      this.farmVendorForm.patchValue({ GrowerName: this.selectedGrower.farmName });
    }
    this.showForm = false;
  }

  /***************************************************
   * File upload
   **************************************************/

  public attachFile(event: any) {
    this.files = [];
    this.files.push(event.files[0]);
    this.invoiceFile = event.files[0];
    this.paymentRequest.fileName = this.invoiceFile.name;
    this.paymentRequest.fileSize = this.invoiceFile.size;
    this.paymentRequest.mimeType = this.invoiceFile.type;

    const file = event.files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = this.onloadend;




  }



  public onloadend(event: ProgressEvent) {
    const reader = event.target as FileReader;

    const buffer = reader.result as ArrayBuffer;
    const uintArray = new Uint8Array(buffer);
    const alpha = this.uint8ToString(uintArray);
    // const alpha = String.fromCharCode.apply(null, uintArray);

    // const uint8array = new TextEncoder().encode('¢');
    // const alpha = new TextDecoder('utf-8').decode(uint8array);

    const base64String = btoa(alpha);


    this.paymentRequest.fileData = base64String;

    // console.log(enc.decode(u8));
  }

  private uint8ToString(u8a: any) {
    // tslint:disable-next-line:naming-convention
    const CHUNK_SZ = 0x8000;
    const c = [];
    for (let i = 0; i < u8a.length; i += CHUNK_SZ) {
      c.push(String.fromCharCode.apply(null, u8a.subarray(i, i + CHUNK_SZ)));
    }
    return c.join('');
  }


  public onRemove(event: any) {
    this.invoiceFile = null;
    this.paymentRequest.fileData = null;
    this.paymentRequest.fileName = null;
    this.paymentRequest.fileSize = null;
    this.paymentRequest.mimeType = null;
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

    this.gridApi.sizeColumnsToFit();
  }

  /** null safe toLower */
  private toLowerNullable(value: string) {
    return value != null ? value.toLowerCase() : '';
  }

  private toUpperNullable(value: string) {
    return value != null ? value.toUpperCase() : '';
  }


  private returnToList() {
    this._router.navigateByUrl(
      'ViewInvoiceBatchComponent?Id=' + this.batchId
    );
  }

  // CLEANUP remove dead code
  /*ngOnDestroy() {
  }*/



}
