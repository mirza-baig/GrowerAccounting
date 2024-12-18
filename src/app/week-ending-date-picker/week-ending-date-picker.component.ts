import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ISimpleDropdown } from './simple-dropdown.interface';

@Component({
  selector: 'app-week-ending-date-picker',
  templateUrl: './week-ending-date-picker.component.html',
  styleUrls: ['./week-ending-date-picker.component.css']
})
export class WeekEndingDatePickerComponent implements OnInit {
  innerWidth: any;
  innerHeight: any;
  /** a current date that is useful for limiting the month and year from going past the current one */
  today: Date = new Date();

  // i/o
  /** a starting date for the picker (if nothing exists just pass in null) */
  @Input() inputDate: Date;
  /** for use of filtering down the possible input date values */
  @Input() filteredDates: Date[];
  /** the label for the submit button for the time dim picker */
  @Input() submitButtonText: string;
  /** the output event for the time form, returns the date picked */
  @Output() dateSelectedEvent = new EventEmitter<Date>();

  // the form
  timeDimForm: FormGroup;
  formLoaded: boolean = false;
  validDate: boolean = false;

  // the dropdowns
  yearList: number[] = [];
  monthListFull: ISimpleDropdown[] = [];
  monthList: ISimpleDropdown[] = [];
  dateList: ISimpleDropdown[] = [];
  yearListLoaded: boolean = false;


  constructor(
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    // set the size
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

    // shift our dates to be all week ending dates
    this.filteredDates = this.filteredDates.map(d => {
      return this.getWeekEndingDateFromCalendarDate(d);
    });

    this.buildYearList();
  }

  /** build the form for picking a date */
  public buildTimeDimForm(date: Date) {
    // check if the input exists and load it if applicable
    const isEdit = !!date;
    this.timeDimForm = this._formBuilder.group({
      Year: new FormControl({
        value: isEdit ? date.getFullYear() : this.today.getFullYear(),
      }, [ Validators.required]),
      Month: new FormControl({
        value: isEdit ? date.getMonth() : this.today.getMonth() + 1,
      }, [ Validators.required]),
      Week: new FormControl({
        value: isEdit ? '' : '',
      }, [ Validators.required]),
    });
    this.timeDimForm.patchValue({ Year: isEdit ? date.getFullYear() : this.today.getFullYear()});
    // if (!isEdit) {

    // }
    const year = parseInt(this.timeDimForm.value.Year.toString(), 10);

    this.monthList = this.monthListFull.filter(m => this.filteredDates.findIndex(d => d.getFullYear() === year && d.getMonth() === m.id) !== -1);
    
    this.formLoaded = true;
  }

  /** Submit button for the form */
  public selectDateConfirm() {
    const val = this.timeDimForm.value;
    const date = new Date(val.Year, val.Month, val.Week);
    this.dateSelectedEvent.emit(date);
  }

  /** Helper for building the year dropdown list */
  private buildYearList() {
    // for convention we'll start in 2004, but could go back further if needed

    this.yearList = this.filteredDates.map(d => d.getFullYear())
    .filter((val, i, arr) => {
      return arr.indexOf(arr.find(t => t === val)) === i;
    });

    this.yearListLoaded = true;
    this.buildFullMonthList();
  }

  /** build the full month list */
  private buildFullMonthList() {
    this.monthListFull.push({ id: 11, text: 'December' });
    this.monthListFull.push({ id: 10, text: 'November' });
    this.monthListFull.push({ id: 9, text: 'October' });
    this.monthListFull.push({ id: 8, text: 'September' });
    this.monthListFull.push({ id: 7, text: 'August' });
    this.monthListFull.push({ id: 6, text: 'July' });
    this.monthListFull.push({ id: 5, text: 'June' });
    this.monthListFull.push({ id: 4, text: 'May' });
    this.monthListFull.push({ id: 3, text: 'April' });
    this.monthListFull.push({ id: 2, text: 'March' });
    this.monthListFull.push({ id: 1, text: 'February' });
    this.monthListFull.push({ id: 0, text: 'January' });

    // if only 1 year we can go ahead and filter the months down
    if (this.yearList.length === 1) {
      this.monthList = this.monthListFull.filter(m => this.filteredDates.findIndex(d => d.getMonth() === m.id) !== -1);
    }

    // build the form
    this.buildTimeDimForm(this.inputDate);
  }


  /** Determine the proper week ending date (saturday) for any given calendar date */
  private getWeekEndingDateFromCalendarDate(date: Date) {
    // determine how many days off we are, then add
    const numDays = 6 - date.getDay();
    date.setDate(date.getDate() + numDays);
    return date;
  }

  /** on year change have to possibly filter the month list */
  public onYearChange(event: any) {
    // reset the form
    this.timeDimForm.patchValue({ Month: '', Week: ''});
    this.validDate = false;
    this.dateSelectedEvent.emit(null);
    const year = parseInt(this.timeDimForm.value.Year.toString(), 10);
    const yearMatches = this.filteredDates
    .filter(d => d.getFullYear() === year) // get the year
    .map(d => d.getMonth()) // we just need the month
    .filter((val, i, arr) => { // remove duplicates
      return arr.indexOf(arr.find(m => m === val)) === i;
    });

    this.monthList = this.monthListFull.filter(m => yearMatches.findIndex(y => y === m.id) !== -1);
  }

  /** on month change event have to  */
  public onMonthChange(event: any) {
    this.validDate = false;
    this.dateSelectedEvent.emit(null);
    const val = this.timeDimForm.value;

    // since our list is already week ending dates, just filter it
    this.dateList = this.filteredDates
    .filter(d =>
      d.getFullYear() === val.Year
      && d.getMonth() === val.Month)
      .map(d =>  { return {
        id: d.getDate(),
        text: d.toDateString(),
      } as ISimpleDropdown; });

  }

  public onDateChange(event: any) {
    this.validDate = true;
    this.selectDateConfirm();
  }

  /** quick dirty helper to get number of days in a month */
  private getDaysInMonth(year: number, month: number) {
    // leap year feb
    if (year % 4 === 0 && month === 1) {
      return 29;
    } else {
      switch (month) {
        case 0: return 31;
        case 1: return 28;
        case 2: return 31;
        case 3: return 30;
        case 4: return 31;
        case 5: return 30;
        case 6: return 31;
        case 7: return 31;
        case 8: return 30;
        case 9: return 31;
        case 10: return 30;
        case 11: return 31;
        default: return 0;
      }
    }
  }

  // some month/year change helpers

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
  }

}
