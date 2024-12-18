import { Component } from '@angular/core';
import { EditAccountService } from 'src/app/account-maintenance/edit-account/edit-account.service';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { IAccountType } from 'src/app/models/account-type.interface';
import { IGrowerAccountPost } from 'src/app/models/grower-account-post.interface';

@Component({
  selector: 'app-account-name-cell-renderer',
  templateUrl: './account-name-cell-renderer.component.html',
  styleUrls: ['./account-name-cell-renderer.component.css']
})
export class AccountNameCellRendererComponent implements ICellRendererAngularComp {
  public params: any;
  public lockSettlements: boolean = true;

  public accountTypes: IAccountType[] = [];
  public account: IGrowerAccountPost;
  public display: string;

  constructor(
    private _accountService: EditAccountService,
  ) { }

  agInit(params: any): void {
    this.params = params; // has the full model

    // get the account type list
    this.accountTypes = JSON.parse(sessionStorage.getItem('AccountTypeList')) as IAccountType[];
    if (params.data.invoice.Account.toString() === '0') {
      this.display = 'Invalid';
    } else {
      this.loadAccount(params.value);
    }

  }


  /** Check to see if the site needs to be locked down */
  public loadAccount(id: number) {
    this._accountService
      .getAccountById(id)
      .subscribe(
        data => {
          try {
            this.account = data;
            const accountType = this.accountTypes.find(at => at.id.toString() === this.account.accountType.toString()).accountType;
            this.display = accountType + ' - ' + this.account.accountSuffix;
          } catch (e) {
            console.error(e);
          }
        },
        error => {
          console.error(error);
        }
      );
  }


  refresh(): boolean {
      return false;
  }


}
