import { Component, OnInit, HostListener } from '@angular/core';
import { IDropdownListItem } from 'src/app/models/dropdown-list-item.interface';
import { MessageService } from 'primeng/api';
import { AddBankNoteService } from './add-bank-note.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { IGrowerBankNote } from 'src/app/models/grower-bank-note.interface';
import { IGrowerMaster } from 'src/app/models/grower-master.interface';
import { EditGrowerMasterService } from 'src/app/account-maintenance/edit-grower-master/edit-grower-master.service';
import { IVwApvendorMaster } from 'src/app/models/vw-apvendor-master.interface';

@Component({
  selector: 'app-add-bank-note',
  templateUrl: './add-bank-note.component.html',
  styleUrls: ['./add-bank-note.component.css']
})
export class AddBankNoteComponent implements OnInit {

  pageTitle = 'Grower Bank Note';
  moduleTitle = 'Bank Note';
  innerWidth: any;

  growerId: number;
  growerModel: IGrowerMaster;
  id: number;
  isAdd: boolean = true;

  dropdownsLoaded: boolean = false;
  netProceedsList: IDropdownListItem[] = [];
  vendorList: IVwApvendorMaster[] = [];

  // vendor search
  vendorSearchForm: FormGroup;
  selectedVendor: IVwApvendorMaster;
  isVendorSelected: boolean = false;
  blockSubmit: boolean = false;

  // bank note form
  bankNoteForm: FormGroup;
  bankNoteFormLoaded: boolean = false;
  isBroiler: boolean = false;
  bankNoteModel: IGrowerBankNote;

  constructor(
    private messageService: MessageService,
    private _bankNoteService: AddBankNoteService,
    private _growerService: EditGrowerMasterService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    // set width
    this.innerWidth = window.innerWidth;

    // load dropdowns
    this.loadDropdowns();

    // parse the URL
    this._route.queryParams.subscribe(params => {
      this.id = params['Id'] as number;
    });
    // see if we need to parse the URL again
    if (!!this.id) {
      this.isAdd = false;
      this.loadBankNote(this.id);
    } else {
      this._route.queryParams.subscribe(params => {
        this.growerId = params['GrowerId'] as number;
      });
      this.bankNoteModel = {
        id: 0,
        growerId: parseInt(this.growerId.toString(), 10),
      } as IGrowerBankNote;
      this.loadGrower(this.growerId);
      this.buildBankNoteForm(null);
    }



    // this.growerId = 12345;


  }


  /** load the bank note by id */
  private loadBankNote(id: number) {
    this._bankNoteService
    .getBankNoteById(id)
    .subscribe(
      note => {
        this.bankNoteModel = note;
        this.growerId = note.growerId;
        this.isBroiler = note.noteType === 'S';
        this.loadGrower(this.growerId);
        // build the form
        this.buildBankNoteForm(note);
      }, error => {
        console.error(error);
        this.errorToast(error);
      });
  }

  /** save the grower info */
  private loadGrower(id: number) {
    this._growerService
    .getGrowerMaster(id)
    .subscribe(
      data => {
        this.growerModel = data;
        // B = broiler, H = breeder, M = misc, 1 = ?
        this.isBroiler = data.farmType === 1;

      }, error => {
        console.error(error);
        this.errorToast(error);
      });
  }

  /** builder for the form group for the main form */
  private buildBankNoteForm(model: IGrowerBankNote) {
    this.bankNoteForm = this._formBuilder.group({
      VendorNumber: new FormControl({
        value: this.isAdd ? '' : model.noteVendorNumber,
      }, [ Validators.required]),
      LoanNumber: new FormControl({
        value: '',
      }, [ Validators.required]),
      // PrincipalAmount: new FormControl({
      //   value: '',
      // }, [ Validators.required]),
      // TotalPayments: new FormControl({
      //   value: '',
      // }, [ Validators.required]),
      // RemainingBalance: new FormControl({
      //   value: 0, disabled: true
      // }, [ Validators.required]),
      PaymentAmount: new FormControl({
        value: '',
      }), // todo - custom validation on type
      CentsPerDozen: new FormControl({
        value: '',
      }), // todo - custom validation on type
      // ! net proceeds is missing from the db and model?
      NetProceeds: new FormControl({
        value: '',
      }),
      Status: new FormControl({
        value: '',
      }),
    });
    // patch some values if needed

    this.bankNoteForm.patchValue({ VendorNumber: this.isAdd ? '' : model.noteVendorNumber});
    this.bankNoteForm.patchValue({ LoanNumber: this.isAdd ? '' : model.noteLoanNumber});
    // todo - missing fields!!!!
    // this.bankNoteForm.patchValue({ PrincipalAmount: this.isAdd ? '' : model.notePrincipalAmount});
    // this.bankNoteForm.patchValue({ TotalPayments: this.isAdd ? '' : model.totalNotePayments});
    // this.bankNoteForm.patchValue({ RemainingBalance: this.isAdd ? '' : model.remainingBalance});
    this.bankNoteForm.patchValue({ PaymentAmount: this.isAdd ? '' : model.notePaymentAmount});
    this.bankNoteForm.patchValue({ CentsPerDozen: this.isAdd ? '' : model.notePaymentCentsDoz});
    this.bankNoteForm.patchValue({ NetProceeds: this.isAdd ? '' :  model.noteNetProceeds});
    // this.bankNoteForm.patchValue({ Status: model.status});
    if (!this.isAdd) {
      this.selectedVendor = this.vendorList.find(v => v.vnumb.toString() === model.noteVendorNumber.toString());
      this.isVendorSelected = true;
    }

    // mark as touched to show

    this.bankNoteForm.get('VendorNumber').markAsTouched();
    this.bankNoteForm.get('LoanNumber').markAsTouched();
    // this.bankNoteForm.get('PrincipalAmount').markAsTouched();
    // this.bankNoteForm.get('TotalPayments').markAsTouched();
    // this.bankNoteForm.get('RemainingBalance').markAsTouched();
    this.bankNoteForm.get('PaymentAmount').markAsTouched();
    this.bankNoteForm.get('CentsPerDozen').markAsTouched();

    this.bankNoteFormLoaded = true;
  }

  public submitBankNote() {
    // S for settlement (broiler), E for breeder
    if (this.isAdd) {
      this.bankNoteModel.noteType = this.growerModel.farmType === 1  ? 'S' : 'E';
    }

    const val = this.bankNoteForm.value;
    // todo - should we check that only 1 is filled of the 3?
    if (!!val.PaymentAmount && val.PaymentAmount > 0 && !!val.CentsPerDozen && val.CentsPerDozen > 0) {
      this.errorToast('You can only choose one of the following payment methods: Cents per Dozen or Payment Amount');
    } else {
      this.blockSubmit = true;
      this.bankNoteModel.noteVendorNumber = val.VendorNumber;
      this.bankNoteModel.noteLoanNumber = val.LoanNumber;
      // todo - missing fields???
      // this.bankNoteModel.notePrincipalAmount = this.parse(val.PrincipalAmount);
      // this.bankNoteModel.remainingBalance = this.parse(val.RemainingBalance);
      // this.bankNoteModel.totalNotePayments = this.parse(val.TotalPayments);
      this.bankNoteModel.notePaymentAmount = this.parse(val.PaymentAmount);
      this.bankNoteModel.notePaymentCentsDoz = this.parse(val.CentsPerDozen);
      this.bankNoteModel.noteNetProceeds = val.NetProceeds;

      // post it
      this._bankNoteService.postBankNote(this.bankNoteModel).subscribe(
        data => {

          if (data.statusCode === 200) {
            // success add, display success then redirect to batch page
            this.successToast('You have successfully submitted the bank note');
            setTimeout( () => {
              this.returnHome();
            }, 2000 );

          } else {
            this.errorToast('An error occured processing your request. Please try again');
            this.blockSubmit = false;
          }
        }, error => {
          console.error(error);
          this.errorToast(error);
      });
    }

    // pull in the model values
    // todo - run custom validation on what input to set
    // console.log(this.bankNoteModel);
  }

  /** parse an int with some custom logic */
  private parse(val: string): number {
    if (!!!val || val === '') {
      return 0;
    } else {
      return parseFloat(val);
    }
  }

  public vendorNumberSearch(event: any) {
    const match = this.vendorList.find(v => v.vnumb.toString() === this.bankNoteForm.value.VendorNumber.toString());
    if (!!match) {
      this.isVendorSelected = true;
      this.selectedVendor = match;
    } else {
      this.selectedVendor = null;
      this.isVendorSelected = false;
    }
  }

  /***************************************************
   * Dropdowns
   **************************************************/

   /** centralize the dropdown loading */
   private loadDropdowns() {
    this.loadVendorList().then(() => {
      this.loadNetProceedsList();
    });
   }

   /** load the vendor dropdown list */
  private loadVendorList(): Promise<any> {
    return new Promise((res, rej) => {
      // the vendor list is cached
      this.vendorList = JSON.parse(localStorage.getItem('APVendorList')) as IVwApvendorMaster[];
      res();
    });
  }

  private loadNetProceedsList() {
    this.netProceedsList.push({
      Value: '',
      Text: 'N/A'
    } as IDropdownListItem);
    this.netProceedsList.push({
      Value: 'N',
      Text: 'Net Proceeds'
    } as IDropdownListItem);
    this.netProceedsList.push({
      Value: 'G',
      Text: 'Gross Proceeds'
    } as IDropdownListItem);
    this.dropdownsLoaded = true;
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
  }

  /** null safe toLower */
  private toLowerNullable(value: string) {
    return value != null ? value.toLowerCase() : '';
  }

  public returnHome() {
    this._router.navigateByUrl(
      'BankNoteListComponent?Id=' + this.growerId
    );
    return;
  }

}
