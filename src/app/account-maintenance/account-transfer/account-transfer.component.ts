import { Component, OnInit, HostListener } from '@angular/core';
import { IGrowerMaster } from 'src/app/models/grower-master.interface';
import { AccountTransferService } from './account-transfer.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { IGrowerAccount } from 'src/app/models/grower-account.interface';
import { IAccountType } from 'src/app/models/account-type.interface';
import { DropdownService } from 'src/app/shared/dropdown.service';
import { IGrowerTransaction } from 'src/app/models/grower-transaction.interface';
import { IGrowerTransactionBatch } from 'src/app/models/grower-transaction-batch.interface';
import { ICurrentUser } from 'src/app/user-management/current-user.interface';

@Component({
  selector: 'app-account-transfer',
  templateUrl: './account-transfer.component.html',
  styleUrls: ['./account-transfer.component.css']
})
export class AccountTransferComponent implements OnInit {
  pageTitle = 'Account Transfer';
  moduleTitle = 'Account Maintenance';
  innerWidth: any;
  innerHeight: any;
  growerId: number;

  currentGrower: IGrowerMaster;
  currentGrowerLoaded: boolean = false;
  relatedGrowers: IGrowerMaster[] = [];
  relatedGrowersLoaded: boolean = false;
  selectedRelatedGrower: IGrowerMaster;
  searchUnrelatedGrowerModal: boolean = false;
  filterIds: number[] = [];

  fromAccounts: IGrowerAccount[] = [];
  fromAccountsLoaded: boolean = false;
  fromAccountSelected: IGrowerAccount;
  toAccounts: IGrowerAccount[] = [];
  toAccountsLoaded: boolean = false;
  toAccountSelected: IGrowerAccount;
  accountTypes: IAccountType[] = [];

  transferForm: FormGroup;
  transferFormLoaded: boolean = false;
  blockSubmit: boolean = false;

  constructor(
    private messageService: MessageService,
    private _growerService: AccountTransferService,
    private _dropdownService: DropdownService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    // set sizes
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

    // parse url
    this._route.queryParams.subscribe(params => {
      this.growerId = params['Id'] as number;
    });
    this.filterIds.push(parseInt(this.growerId.toString(), 10));
    this.loadAccountTypes();
  }


  private loadAccountTypes() {
    this._dropdownService
      .getAccountTypes()
      .subscribe(
        data => {
          try {
            this.accountTypes = data;
            this.buildTransferForm();
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

  public getAccountTypeString(accountType: string) {

    return this.accountTypes.find(at => at.id.toString() === accountType.toString()).accountType;
  }


  private buildTransferForm() {
    this.transferForm = this._formBuilder.group({
      FromGrower: new FormControl({
        value: ''
      }, [ Validators.required]),
      FromGrowerAccount: new FormControl({
        value: ''
      }, [ Validators.required]),
      FromAccountBalance: new FormControl({
        value: '', disabled: true
      }),
      ToGrower: new FormControl({
        value: '', disabled: true
      }),
      ToGrowerAccount: new FormControl({
        value: ''
      }, [ Validators.required]),
      ToAccountBalance: new FormControl({
        value: '', disabled: true
      }),
      Date: new FormControl({
        value: ''
      }, [ Validators.required]),
      Description: new FormControl({
        value: ''
      }, [ Validators.required]),
      Amount: new FormControl({
        value: ''
      }, [ Validators.required]),
    });

    // object object fix
    this.transferForm.patchValue({ ToGrower: this.growerId });
    this.transferForm.patchValue({ Description: ''});
    // mark the form as touched
    this.transferForm.get('FromGrower').markAsTouched();
    this.transferForm.get('FromGrowerAccount').markAsTouched();
    this.transferForm.get('Date').markAsTouched();
    this.transferForm.get('Description').markAsTouched();
    this.transferForm.get('Amount').markAsTouched();

    this.transferFormLoaded = true;

    // load the grower
    this.loadGrower(this.growerId);
    // for now we'll just start as the thing in to mode
    this.loadTransferToAccounts(this.growerId);
  }

  public onToAccountChange(event: any) {
    // get the matching account
    const acct = this.toAccounts.find(a => a.id.toString() === this.transferForm.value.ToGrowerAccount.toString());
    this.toAccountSelected = acct;
    this.transferForm.patchValue({ ToAccountBalance: !!acct.amountDue ? acct.amountDue : 0 });

  }
  public onFromAccountChange(event: any) {
    // get the matching account
    const acct = this.fromAccounts.find(a => a.id.toString() === this.transferForm.value.FromGrowerAccount.toString());
    this.fromAccountSelected = acct;
    this.transferForm.patchValue({ FromAccountBalance: !!acct.amountDue ? acct.amountDue : 0 });
  }

  private loadGrower(id: number) {
    this._growerService
    .getGrower(id)
    .subscribe(
      data => {
        try {
          this.currentGrower = data;
          this.transferForm.patchValue({ToGrower: data.id.toString() + ' - ' + data.farmName });
          this.currentGrowerLoaded = true;
          // fetch the related growers (non vendor)
          this.loadRelatedGrowers(data.groupCode);

          // this.getRelatedGrowers(id);

          // fetch the related vendor growers
          // this.getVendorGrowers(data.vendorId);
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

  private loadRelatedGrowers(code: string) {
    this._growerService
    .getGrowerRelationsByGroupCode(code)
    .subscribe(
      related => {
        // filter out self
        this.relatedGrowers = related.filter(r => r.status.trim() === 'Active');
        this.relatedGrowersLoaded = true;


      }, error => {
        console.error(error);
        this.errorToast(error);
      });
  }


  public onFromGrowerChange(event: any) {
    this.selectedRelatedGrower = this.relatedGrowers.find(g => g.id.toString() === this.transferForm.value.FromGrower.toString());
    this.loadTransferFromAccounts(parseInt(this.transferForm.value.FromGrower.toString(), 10));
  }

  public onGrowerSelected(event: any) {
    this.searchUnrelatedGrowerModal = false;
    this.selectedRelatedGrower = event;
    this.relatedGrowers.push(event);
    this.transferForm.patchValue({ FromGrower: this.selectedRelatedGrower.id });
    this.filterIds.push(parseInt(this.selectedRelatedGrower.id.toString(), 10) );
    this.loadTransferFromAccounts(this.selectedRelatedGrower.id);
  }

  private loadTransferFromAccounts(id: number) {
    this._growerService
    .getGrowerAccounts(id)
    .subscribe(accounts => {
      this.fromAccounts = accounts;
      this.fromAccountsLoaded = true;
    }, error => {
      console.error(error);
      this.errorToast(error);
    });
  }

  private loadTransferToAccounts(id: number) {
    this._growerService
    .getGrowerAccounts(id)
    .subscribe(accounts => {
      this.toAccounts = accounts.filter(a => a.accountType !== '5'); // can't transfer to a misc account
      this.toAccountsLoaded = true;
    }, error => {
      console.error(error);
      this.errorToast(error);
    });
  }

  public submitTransfer() {
    this.blockSubmit = true;
    const val = this.transferForm.value;
    // insufficient funds
    if (parseFloat(this.fromAccountSelected.amountDue.toString()) < parseFloat(val.Amount.toString())) {
      this.errorToast('The account you are trying to transfer from ('
      + this.selectedRelatedGrower.id + ' - ' + this.getAccountTypeString(this.fromAccountSelected.accountType)
      + ' - ' + this.fromAccountSelected.accountSuffix + ') does not have enough funds ($' + this.fromAccountSelected.amountDue
      + ') for your requested amount of $' + val.Amount);
      this.blockSubmit = false;
    } else {
      // now we create 2 transactions to add to a new batch

      // first create a batch
      const user = JSON.parse(localStorage.getItem('ActiveDirectoryUser')) as ICurrentUser;
      const batch = {
        id: 0,
        description: val.Description,
        createdDate: new Date(),
        createdBy: user.username,
        status: 'New',
      } as IGrowerTransactionBatch;

      this._growerService.postTransactionBatch(batch).subscribe(
        batchResult => {
          try {
            // New transaction batch #16 added.
            const batchId = batchResult.data.split(' ')[3].substring(1);
            batch.id = parseInt(batchId, 10);

            // first transaction we'll do from
            const fromTransaction = {
              id: 0,
              growerId: parseInt(val.FromGrower.toString(), 10),
              growerAccountId: parseInt(val.FromGrowerAccount.toString(), 10),
              transactionCode: '46', // code for transfer
              transactionDate: val.Date,
              transactionAmount: -1.0 * parseFloat(val.Amount.toString()),
              transactionDescription: val.Description,
              accountSuffix: this.fromAccountSelected.accountSuffix,
              artype: this.getAccountTypeString(this.fromAccountSelected.accountType).substring(0, 1),
              transactionAccountName: this.getAccountTypeString(this.fromAccountSelected.accountType),
              batchId: parseInt(batchId.toString(), 10),
              transactionStatus: 'New',
            } as IGrowerTransaction;

            // to transaction
            const toTransaction = {
              id: 0,
              growerId: parseInt(this.growerId.toString(), 10),
              growerAccountId: parseInt(val.ToGrowerAccount.toString(), 10),
              transactionCode: '46', // code for transfer
              transactionDate: val.Date,
              transactionAmount: parseFloat(val.Amount.toString()),
              transactionDescription: val.Description,
              accountSuffix: this.toAccountSelected.accountSuffix,
              transactionAccountName: this.getAccountTypeString(this.toAccountSelected.accountType),
              artype: this.getAccountTypeString(this.toAccountSelected.accountType).substring(0, 1),
              batchId: parseInt(batchId.toString(), 10),
              transactionStatus: 'New',
            } as IGrowerTransaction;

            // post it
            this._growerService.postTransaction(fromTransaction)
            .subscribe(result => {
              // if success, post the next
              if (result.statusCode === 200) {
                this._growerService.postTransaction(toTransaction)
                  .subscribe(result2 => {
                    batch.status = 'Posted';

                    // finally "post" the batch
                    this._growerService.postTransactionBatch(batch)
                    .subscribe(result3 => {


                      // then post the batch
                      if (result3.statusCode === 200) {
                        this.successToast('You have successfully transfered funds!');
                        setTimeout( () => { this.returnHome(); }, 1500 );
                      }
                    }, error => {
                      console.error(error);
                      this.errorToast(error);
                    });
                  }, error => {
                    console.error(error);
                    this.errorToast(error);
                  });
              }
            }, error => {
              console.error(error);
              this.errorToast(error);
            });
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

  public returnHome() {
    this._router.navigateByUrl(
      'AccountMaintenanceComponent?id=' + this.growerId
    );
    return;
  }


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
  }
}
