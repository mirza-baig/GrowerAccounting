import {
  Component,
  Input,
  OnInit,
  HostListener,
  ChangeDetectorRef,
  ApplicationRef,
  NgZone
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteGuardService } from '../route-guard/route-guard.service';
import { MessageService } from 'primeng/api';
import { fade, slide } from 'src/fieldale-animations';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatMenu } from '@angular/material';
import { environment } from 'src/environments/environment';
import { BadgeService } from './badge.service';
import { UtilityService } from './utility.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'capx-header',
  templateUrl: './header.template.html',
  styleUrls: ['./header.template.css'],
  animations: [fade, slide]
})
export class HeaderComponent implements OnInit {
  @Input() moduleTitle: string;

  changeUserString = 'Proxy LogOn';
  // user access types
  hasAccountingAccess: boolean = false;
  hasAdminAccess: boolean = false;
  hasAccountingApproverAccess: boolean = false;
  hasLpoEntryAccess: boolean = false;
  hasLpoApproverAccess: boolean = false;
  hasInvoiceProcessorAccess: boolean = false;



  fiscalYear = '';

  popupText: string;
  popupTitle: string;
  customDialog = false;
  helpVideoSrc: string = '';
  helpDialogOpen = false;
  showAllHelpLinks = false;
  lockSettlements: boolean = true;
  lockTransaction: boolean = true;

  hiddenLink = false; // environment.hideHeaderLinks;

  // count = 100;
  worklistItemCount: number;
  worklistLoaded = false;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _routeGuard: RouteGuardService,
    private messageService: MessageService,
    private deviceService: DeviceDetectorService,
    private _utilityService: UtilityService,
    private _appRef: ApplicationRef
  ) {}

  ngOnInit() {




    this.getLockStatus();

    this.checkRoles();

  }

  /** Check to see if the site needs to be locked down */
  public getLockStatus() {
    this._utilityService
      .isSettlementInProcess()
      .subscribe(
        data => {
          try {
            this.lockSettlements = data;
          } catch (e) {
            console.error(e);
          }
        },
        error => {
          console.error(error);
        }
      );

    this._utilityService
      .isTransactionInProcess()
      .subscribe(
        data => {
          try {
            this.lockTransaction = data;
          } catch (e) {
            console.error(e);
          }
        },
        error => {
          console.error(error);
        }
      );
  }




  /** helper to refresh the UI and check for roles */
  private checkRoles() {

    this.hasAccountingAccess = this._routeGuard.checkRoles(
      'Grower Accounting Admin,Accounting'
    );

    this.hasAdminAccess = this._routeGuard.checkRoles(
      'Grower Accounting Admin'
    );

    this.hasLpoEntryAccess = this._routeGuard.checkRoles(
      'LPO Entry'
    );

    this.hasLpoApproverAccess = this._routeGuard.checkRoles(
      'LPO Approver'
    );

    this.hasAccountingApproverAccess = this._routeGuard.checkRoles(
      'Grower Accounting Approver'
    );

    this.hasInvoiceProcessorAccess = this._routeGuard.checkRoles(
      'Invoice Processor'
    );

    /*
    hasAccountingAccess: boolean = false;
  hasAdminAccess: boolean = false;
  hasAccountingApprovalAccess: boolean = false;
  hasLpoEntryAccess: boolean = false;
  hasLpoApprovalAccess: boolean = false;
  hasInvoiceProcessorAccess: boolean = false;
  */
  }

  public hasRole(roles: string) {
    return this._routeGuard.checkRoles(roles);
  }

  /** show the custom modal */
  public customPopup(title: string, body: string) {
    this.popupText = body;
    this.popupTitle = title;
    // this['customDialog'] = true;
    this.customDialog = true;
  }



  /** Closes the custom dialog modal */
  public closeCustomDialog() {
    this.customDialog = false;
  }



  // cleanup: all of this seems unused?  Delete after testing
  /*openHelpDialog(url: string) {
    this.helpVideoSrc = url;
    this.helpDialogOpen = true;
  }

  closeHelpDialog() {
    this.showAllHelpLinks = false;
    this.helpDialogOpen = false;
  }

  toggleAllLinks(event: any, panel: MatMenu) {
    event.stopPropagation();
    this.showAllHelpLinks = !this.showAllHelpLinks;
  }*/

  /** resize handler */
  @HostListener('window:resize', ['$event'])
  onResize() {
  }
}
