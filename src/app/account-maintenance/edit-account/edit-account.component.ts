import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { IAccountVM } from 'src/app/models/account-vm.interface';
import { EditAccountService } from './edit-account.service';
import { IGrowerVM } from 'src/app/models/grower-vm.interface';
import { AccountMaintenanceService } from '../account-maintenance.service';
import { IGrowerAccount } from 'src/app/models/grower-account.interface';
import { IGrowerMaster } from 'src/app/models/grower-master.interface';
import { DropdownService } from 'src/app/shared/dropdown.service';
import { IAccountType } from 'src/app/models/account-type.interface';
import { IGrowerAccountPost } from 'src/app/models/grower-account-post.interface';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.css']
})
export class EditAccountComponent implements OnInit {

  pageTitle = 'Grower Account Maintenance';
  moduleTitle = 'Account Maintenance';
  innerWidth: any;

  // URL params
  id: number;

  // models
  account: IGrowerAccountPost;
  grower: IGrowerMaster;

  loadingAccount = true;
  accountTypeRegular = true;

  accountTypes: IAccountType[] = [];

  accountForm: FormGroup;
  accountFormLoaded: boolean = false;

  constructor(
    private messageService: MessageService,
    private _editAccountService: EditAccountService,
    private _dropdownService: DropdownService,
    private _accountManagementService: AccountMaintenanceService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    // set width
    this.innerWidth = window.innerWidth;

    // parse the URL
    this._route.queryParams.subscribe(params => {
      this.id = params['id'];
    });

    this.loadAccountTypes();

    // this.loadAccount(this.id);
  }

  private loadAccountTypes() {
    this._dropdownService
      .getAccountTypes()
      .subscribe(
        data => {
          try {
            this.accountTypes = data;
            this.loadAccount(this.id);
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

  public loadAccount(id: number) {
    this._editAccountService
      .getAccountById(id)
      .subscribe(
        data => {
          try {
            this.account = data;
            const type = this.getAccountType(data.accountType.toString());
            this.accountTypeRegular = !(type === 'Unique' || type === 'Special' || type === 'Construction');

            // unique = special or unique (or construction)
            this.pageTitle = 'Grower Account Maintenance - ' + type;
            this.loadingAccount = false;

            this.loadAccountForm(data);
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

  /** builds the account form */
  private loadAccountForm(account: IGrowerAccountPost) {
    const isAdd = !!!account;
    const acctType = this.getAccountType(account.accountType.toString());
    if (acctType === 'Construction') {
      account.interestRate = 0;
    }
    this.accountForm = this._formBuilder.group({
      DeductChargeInterestDate: new FormControl({
        value: isAdd || !!!account.deductChargeInterestFromDate  ? this.getFormattedDate(new Date()) : account.deductChargeInterestFromDate,
      }),
      BalanceGoalStartDeduction: new FormControl({
        value: isAdd || !!!account.balanceGoalStartDeduction  ? 0.00 : account.balanceGoalStartDeduction,
      }),
      InterestRate: new FormControl({
        value: isAdd || !!!account.interestRate ? 0.00 : account.interestRate,
        disabled: acctType === 'Construction' // disable if construction
      }),
      OriginalNoFlocks: new FormControl({
        value: isAdd || !!!account.noFlocksToPay ? '' : parseInt(account.noFlocksToPay.toString(), 10),
      }),
      RemainingFlocks: new FormControl({
        value: isAdd || !!!account.remainingFlocksToPay ? '' : account.remainingFlocksToPay,
      }),
      Comments: new FormControl({
        value: isAdd ? '' :  account.accountComment,
      })

    });


    // todo - figure out why constructor setting isn't working-
    // tslint:disable-next-line:max-line-length
    this.accountForm.patchValue({ DeductChargeInterestDate: isAdd || !!!account.deductChargeInterestFromDate ? this.getFormattedDate(new Date()) : account.deductChargeInterestFromDate});
    this.accountForm.patchValue({ BalanceGoalStartDeduction: isAdd || !!!account.balanceGoalStartDeduction ? 0.00 : account.balanceGoalStartDeduction});
    this.accountForm.patchValue({ InterestRate: isAdd || !!!account.interestRate ? 0.00 : account.interestRate});
    this.accountForm.patchValue({ OriginalNoFlocks: isAdd || !!!account.noFlocksToPay ? 0 : account.noFlocksToPay});
    this.accountForm.patchValue({ RemainingFlocks: isAdd || !!!account.remainingFlocksToPay ? 0 : account.remainingFlocksToPay});
    this.accountForm.patchValue({ Comments: isAdd ? '' : account.accountComment});

    this.accountFormLoaded = true;
  }

  /** date formatter helper */
  private getFormattedDate(date) {
    const year = date.getFullYear();
    const month = (1 + date.getMonth()).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return month + '/' + day + '/' + year;

  }


  /** handles the submitted account form */
  public saveChanges() {
    // get the form values
    const val = this.accountForm.value;

    // set values
    // todo - if the value is empty, pass null instead of empty string for dates
    this.account.deductChargeInterestFromDate = !!!val.DeductChargeInterestDate ? null : val.DeductChargeInterestDate ;
    this.account.balanceGoalStartDeduction = val.BalanceGoalStartDeduction;
    this.account.interestRate = val.InterestRate;
    this.account.noFlocksToPay = val.OriginalNoFlocks;
    this.account.accountComment = val.Comments;
    this.account.remainingFlocksToPay = val.RemainingFlocks;

    // if (!!!this.account.deductChargeInterestFromDate) {
    //   this.account.deductChargeInterestFromDate = new Date().toISOString();
    // }
    // send to the service
    this._editAccountService
      .postGrowerAccount(this.account)
      .subscribe(
        data => {
          try {
            if (data.statusCode === 200) {
              this.successToast('You have successfully updated the account!');
              setTimeout( () => { this.backToAccount(); }, 1500 );
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

  public backToAccount() {
    this._router.navigateByUrl(
      'AccountMaintenanceComponent?id=' + this.account.growerId
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
  }

  /** helper to get the string for account type */
  private getAccountType(id: string) {
    return this.accountTypes.find(t => t.id.toString() === id).accountType;
  }
}
