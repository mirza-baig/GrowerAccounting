import { Component, OnInit, Input } from '@angular/core';
import { AccountMaintenanceService } from 'src/app/account-maintenance/account-maintenance.service';
import { DropdownService } from '../dropdown.service';
import { IGrowerAccountType } from 'src/app/models/grower-account-type.interface';
import { IGrowerAccount } from 'src/app/models/grower-account.interface';
import { IGrowerAccountPost } from 'src/app/models/grower-account-post.interface';

@Component({
  selector: 'app-quick-account-text',
  templateUrl: './quick-account-text.component.html',
  styleUrls: ['./quick-account-text.component.css']
})
export class QuickAccountTextComponent implements OnInit {
  @Input() id: number;
  public types: IGrowerAccountType[] = [];
  public account: IGrowerAccountPost;
  public accountName: string = '';

  constructor(
    private _accountService: AccountMaintenanceService,
    private _dropdownService: DropdownService,
  ) { }

  ngOnInit() {
    this._dropdownService.getAccountTypes().subscribe(atResult => {
      this.types = atResult;
      this._accountService.getAccountById(this.id).subscribe(acc => {
        this.account = acc;
        if (!!acc) {
          const at = this.types.find(t => t.id.toString() === acc.accountType.toString());
          this.accountName = at.accountType + ' - ' + acc.accountSuffix;
        }
      }, error => {
        console.error(error);
      });
    }, error => {
      console.error(error);
    });
  }

}
