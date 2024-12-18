import { Component } from '@angular/core';
import { AccountMaintenanceService } from 'src/app/account-maintenance/account-maintenance.service';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { AddInvoicePaymentRequestService } from '../add-invoice-payment-request.service';
import { ISimpleDropdown } from 'src/app/week-ending-date-picker/simple-dropdown.interface';
import { IGrowerAccountType } from 'src/app/models/grower-account-type.interface';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-account-dropdown',
  templateUrl: './account-dropdown.component.html',
  styleUrls: ['./account-dropdown.component.css']
})

// IGrowerAccountType - sessionStorage.setItem('AccountTypes', JSON.stringify(this.accountTypeList));

export class AccountDropdownComponent implements ICellRendererAngularComp {
  public params: any;
  public lockSettlements: boolean = true;

  public accounts: ISimpleDropdown[] = [];
  public accountTypes: IGrowerAccountType[] = [];
  public validAccount: boolean = false;
  public accountForm: FormGroup;

  constructor(
    private _accountService: AccountMaintenanceService,
    private _paymentService: AddInvoicePaymentRequestService,
    private _formBuilder: FormBuilder,
  ) { }

  agInit(params: any): void {
    this.params = params; // has the full model
    this.accountTypes = JSON.parse(sessionStorage.getItem('AccountTypes')) as IGrowerAccountType[];

    this.validAccount = this.params.data.name !== 'Enter Grower #';

    this.accountForm = this._formBuilder.group({
      Account: new FormControl({
        value: '',
      }),
    });

    // load accounts if we can
    if (this.validAccount) {
      this.reloadAccounts();
    }
  }

  reloadAccounts() {
    this.accounts = [];
    const gid = !!this.params.data.growerId2 ? this.params.data.growerId2.toString() : this.params.data.growerId.toString();

    this._accountService.getGrowerAccounts(parseInt(gid, 10)).subscribe(
      result => {
        this.accounts = result.map(a => {
          const match = this.accountTypes.find(at => at.id.toString() === a.accountType.toString());
          const item = {
            id: a.id,
            text: match.accountType + ' - ' + a.accountSuffix,
          } as ISimpleDropdown;
          return item;
        });
        // see if we prefill
        if (!!this.params.data.growerAccountId) {
          this.accountForm.patchValue({ Account : parseInt(this.params.data.growerAccountId.toString(), 10)});
        }
      }, error => {
        console.error(error);
      }
    );
  }

  onAccountChange(event: any) {
    // bubble the account up to the top level
    const update = [];
    this.params.data.growerAccountId = event.value;
    update.push(this.params.data);
    this.params.api.updateRowData({ update: update });
  }




  refresh(): boolean {
      return false;
  }


}
