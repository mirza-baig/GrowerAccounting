import { Component, OnInit, Input } from '@angular/core';
import { IGrowerVM } from '../models/grower-vm.interface';
import { GrowerAccountHeaderService } from './grower-account-header.service';
import { EditGrowerMasterService } from '../account-maintenance/edit-grower-master/edit-grower-master.service';
import { IGrowerMaster } from '../models/grower-master.interface';

@Component({
  selector: 'app-grower-account-header',
  templateUrl: './grower-account-header.component.html',
  styleUrls: ['./grower-account-header.component.css']
})
export class GrowerAccountHeaderComponent implements OnInit {
  @Input() id: number;
  grower: IGrowerMaster;
  innerWidth: number;
  farmType: string = '';
  constructor(private _accountService: EditGrowerMasterService) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.loadGrower(this.id);
  }

  /** Loads the grower data into the model */
  private loadGrower(id: number) {
    this._accountService
    .getGrowerMaster(id)
    .subscribe(
      data => {
        try {
           this.grower = data;
           switch (data.farmType.toString()) {
            case 'B':
            case '1':
              this.farmType = 'Broiler';
              break;
            case 'H':
            case '2':
              this.farmType = 'Breeder';
              break;
            case 'M':
            case '3':
              this.farmType = 'Misc';
              break;
            case '4':
              this.farmType = 'Corporate';
              break;
            default:
              this.farmType = 'Invalid';
              break;
           }

          // random test data
          // todo - include asset value?
        } catch (e) {
          console.error(e);
        }
      },
      error => {
        console.error(error);
      }
    );

    // this.grower = {
    //   Id: 10431,
    //   FarmType: 'B', // todo - set to breeder?
    //   FarmName: 'XIN ZHENG                     ',
    //   FarmAddress1: '4730 CRANE MILL RD            ',
    //   FarmAddress2: null,
    //   Phone: '7064992830',
    //   CellPhone: null,
    //   Email: 'XINZHENG1985@YAHOO.COM        ',
    //   AccountList: [],
    // } as IGrowerVM;


  }

}
