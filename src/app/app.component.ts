import { UtilityService } from './shared/utility.service';
import { Component, OnInit, SimpleChanges, OnChanges, OnDestroy, AfterContentInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { VersionCheckService } from './shared/version-check.service';
import { environment } from 'src/environments/environment';
import { HeaderComponent } from './shared/header.template';
import { IAccessControlUser } from './user-management/access-control-user.interface';
import { UserManagementService } from './user-management/user-management.service';
import { ImportSettlementsService } from './settlement/import-settlements/import-settlements.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  module = 'Admin';
  hideAppHeader = false;
  alternateId = 'new';

  @ViewChild('header') header: HeaderComponent;

  constructor(
    private _versionCheck: VersionCheckService,
    private _importSettlementService: ImportSettlementsService,
    private _utilityService: UtilityService,
    ) {}
  ngOnInit() {
    this._versionCheck.initVersionCheck(environment.versionCheckURL);
  }


  onActivate(event: any) {
    // this.importBroilerSettlements();
    this.syncTransactionBacklog();
  }

  private syncTransactionBacklog() {
    this._utilityService.syncTransactionBacklog().subscribe( result => {

    }, error => {
      console.error(error);
    });
  }
  // private importBroilerSettlements() {
  //   this._importSettlementService
  //   .importBroilerSettlements()
  //   .subscribe(
  //     data => {
  //       try {
  //         // console.log('trying to import any broiler settlements');
  //         // console.log(data); // apiresponse object
  //         if (data.statusCode === 200) {
  //           // todo - do we want to do anything?
  //         }

  //       } catch (e) {
  //         console.log(e);
  //       }
  //     },
  //     error => {

  //       console.log(error);
  //     }
  //   );
  // }
}
