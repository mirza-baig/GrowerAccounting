import {Component, Input, OnInit} from '@angular/core';
import {EditGrowerMasterService} from '../account-maintenance/edit-grower-master/edit-grower-master.service';
import {IGrowerMaster} from '../models/grower-master.interface';

@Component({
  selector: 'app-grower-account-detail',
  templateUrl: './grower-account-detail.component.html',
  styleUrls: ['./grower-account-detail.component.css']
})
export class GrowerAccountDetailComponent implements OnInit {

  @Input() innerWidth: number;
  @Input() growerId: number;
  grower: IGrowerMaster;
  constructor(private _accountService: EditGrowerMasterService) { }

  async ngOnInit() {
    this.grower = await this._accountService.getGrowerMaster(this.growerId).toPromise();
  }
}
