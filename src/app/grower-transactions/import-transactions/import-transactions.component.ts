import { IDateRangeVM } from '../../models/date-range-vm.interface';
import { Component, OnInit, HostListener } from '@angular/core';
import { ImportTransactionsService } from './import-transactions.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { fade, slide } from 'src/fieldale-animations';
import { UtilityService } from 'src/app/shared/utility.service';

@Component({
  selector: 'app-import-transactions',
  templateUrl: './import-transactions.component.html',
  styleUrls: ['./import-transactions.component.css'],
  animations: [fade, slide]
})
export class ImportTransactionsComponent implements OnInit {

  pageTitle = 'Import Transactions';
  moduleTitle = 'Transactions';
  innerWidth: any;

  // list of transactions
  transactions: any[] = [];
  transactionsLoaded = false;

  // locks
  lockPcsStore: boolean = false;
  lockPcsStore2: boolean = false;
  lockLpGas: boolean = false;
  lockLpGas2: boolean = false;

  // form and input
  dateRangeForm: FormGroup;
  dateRangeFormLoaded: boolean = false;
  dateRanges: IDateRangeVM;


  constructor(
    private messageService: MessageService,
    private _importService: ImportTransactionsService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
  ) { }

  ngOnInit() {
    // set width
    this.innerWidth = window.innerWidth;

    this.dateRangeForm = this._formBuilder.group({
      StartDate: new FormControl({
        value: '',
      }, [ Validators.required]),
      EndDate: new FormControl({
        value: '',
      }, [ Validators.required]),
      PastDate: new FormControl({
        value: '',
      })
    });
    this.dateRangeForm.patchValue({ StartDate: '', EndDate: '', PastDate: '' });
    this.dateRangeFormLoaded = true;

    this.getLockStatus();
  }

  /** Check to see if the site needs to be locked down */
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


  public importPastLpGasTransactions() {


    const values = this.dateRangeForm.value;
    const date = new Date(values.PastDate);
    if (!!!values.PastDate) {
      this.errorToast('You must select a date!');
    } else {
      this.lockLpGas2 = true;
      this._importService.loadPastLpTransactions(date).subscribe(result => {
        this.lockLpGas2 = false;

        this.successToast('You have successfully imported transactions for LP Gas - ' + result.data);
      }, error => {
        this.errorToast(error);
        this.lockLpGas2 = false;

      });
    }


  }

  public importPastPcsStoreTransactions() {


    const values = this.dateRangeForm.value;
    const date = new Date(values.PastDate);
    if (!!!values.PastDate) {
      this.errorToast('You must select a date!');
    } else {
      this.lockPcsStore2 = true;
      this._importService.loadPastPcsTransactions(date).subscribe(result => {
        this.lockPcsStore2 = false;

        this.successToast('You have successfully imported transactions for the PCS Store - ' + result.data);
      }, error => {
        console.error(error);
        this.errorToast(error);
        this.lockPcsStore2 = false;

      });
    }
  }

  public importPcsStoreTransactions() {
    this.lockPcsStore = true;

    const values = this.dateRangeForm.value;
    this.dateRanges = {
      startDate: new Date(values.StartDate),
      endDate: new Date(values.EndDate),
    } as IDateRangeVM;

    if (this.dateRanges.endDate < this.dateRanges.startDate) {
      this.errorToast('Invalid date range selected: End date cannot be before the start date!');
      this.lockPcsStore = false;
    } else {
      this._importService.importPcsStoreTransactions(this.dateRanges).subscribe(result => {
        this.lockPcsStore = false;


        // apiResponse.data = "Number of transactions imported: " + (transactions.Count());

        this.successToast('You have successfully imported transactions for the PCS Store - ' + result.data);
      }, error => {
        console.error(error);
        this.errorToast(error);
        this.lockPcsStore = false;
        // setTimeout(() => {
        //   this.lockPcsStore = false;
        // }, 5000);

      });
    }





  }

  public importLpGasTransactions() {
    this.lockLpGas = true;


    this._importService.importLpGasTransactions().subscribe(result => {
      // apiResponse.data = "Number of transactions imported: " + (transactions.Count());
      this.lockLpGas = false;
      this.successToast('You have successfully imported transactions for LP Gas - ' + result.data);
    }, error => {
      console.error(error);
      this.errorToast(error);
      this.lockPcsStore = false;
      // setTimeout(() => {
      //   this.lockPcsStore = false;
      // }, 5000);

    });
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

}
