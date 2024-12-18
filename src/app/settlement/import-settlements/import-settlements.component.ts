import { Component, OnInit, HostListener } from '@angular/core';
import { ImportSettlementsService } from './import-settlements.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ISettlementDatesVM } from 'src/app/week-ending-date-picker/settlement-dates-vm.interface';
import { UtilityService } from 'src/app/shared/utility.service';
import { IKeyValuePair } from './key-value-pair.interface';

@Component({
  selector: 'app-import-settlements',
  templateUrl: './import-settlements.component.html',
  styleUrls: ['./import-settlements.component.css']
})
export class ImportSettlementsComponent implements OnInit {

  pageTitle = 'Import Settlements';
  moduleTitle = 'Settlements';
  innerWidth: any;

  // list of settlements
  settlements: any[] = [];
  settlementsLoaded = false;
  breederSettlements = true;
  broilerSettlements = true;
  lockBreederImport = false;
  lockBroilerImport = false;


  // date form
  dateForm: FormGroup;
  dateFormLoaded: boolean = false;
  breederDate: Date;
  breederDateSelected: boolean = false;
  breederDatesLoaded: boolean = false;

  // breeder settlements
  settlementDatesLoaded: boolean = false;
  breederDatesFull: ISettlementDatesVM[] = [];
  breederDates: Date[] = [];
  breederValidPeriods: IKeyValuePair[] = [];
  breederYears: number[] = [];
  breederPeriods: number[] = [];
  periodForm: FormGroup;


  constructor(
    private messageService: MessageService,
    private _importService: ImportSettlementsService,
    private _utilityService: UtilityService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    // set width
    this.innerWidth = window.innerWidth;
    // todo - load the settlements

    // build the form
    this.dateForm = this._formBuilder.group({
      SettlementDate: new FormControl({
        value: new Date(),
      }, [ Validators.required])});
    this.dateFormLoaded = true;

    this.periodForm = this._formBuilder.group({
      Year: new FormControl({
        value: '',
      }, [ Validators.required]),
      Period: new FormControl({
        value: '',
      }, [ Validators.required]),
    });

    this.settlementsLoaded = true;

    this.loadSettlementDates();
  }


  private loadSettlementDates() {


    this._importService
    .getValidBreederDates()
    .subscribe(
      data => {
        try {
          this.breederValidPeriods = data;
          // filter down to unique fiscal years
          this.breederYears = data.map(p => p.Key).filter((val, i, arr) => {
            return arr.indexOf(arr.find(t => t === val)) === i;
          });
          this.settlementDatesLoaded = true;
          this.breederDatesLoaded = true;
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

  public onYearChange(event: any) {
    const year = parseInt(event.value, 10);
    this.breederPeriods = this.breederValidPeriods.filter(bp => bp.Key === year).map(bp => bp.Value).sort((n1, n2) => n1 - n2);
  }

  public onPeriodChange(event: any) {
    this.breederDateSelected = true;
  }

  /** event for importing broilers */
  public importBroilers() {
    const val = this.dateForm.value;
    this.lockBroilerImport = true;

    this._importService
      .importBroilerSettlements(new Date(val.SettlementDate))
      .subscribe(
        data => {
          try {
            if (data.statusCode === 200) {
              // "Number of broilder settlements imported: 35. Settlement data imported: [ ]


              if (!!data.data && data.data.length > 0) {
                // "Number of broiler settlements imported: 37 Number of Exceptions(Settlement records with invalid Grower Ids): 0
                this.successToast(data.data.toString());
              } else {
                this.errorToast('No settlements found for the date ' + val.SettlementDate.toLocaleDateString());
              }
              this.lockBroilerImport = false;


            }

          } catch (e) {
            console.error(e);
          }
        },
        error => {

          console.error(error);
          this.lockBroilerImport = true;
          this.errorToast(error);
        }
      );



  }




  public importBreeders() {
    const period = this.periodForm.value.Period;
    const year = this.periodForm.value.Year;
    this.infoToast('Please wait while settlements are being imported');
    this.lockBreederImport = true;


    this._importService
      .importBreederSettlements(period, year)
      .subscribe(
        data => {
          try {


              // Joe says that the import will fully resolve before it returns
              this.lockBreederImport = false;
              this.successToast('Breeder Settlements have been successfully imported for ' + period + '/' + year);


          } catch (e) {
            console.error(e);
          }
        },
        error => {
          const e = JSON.parse(error.error);
          console.error(e.message);
          console.error(error);
          this.errorToast(e.message);
        }
      );




  }

  public onDateChange(event: any) {

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
