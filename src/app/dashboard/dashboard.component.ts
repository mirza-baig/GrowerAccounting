import { Component, OnInit } from '@angular/core';
import { fade, slide } from '../../fieldale-animations';
import { MessageService } from 'primeng/api';
import { DashboardService } from './dashboard.service';
import { Router } from '@angular/router';
import { RouteGuardService } from '../route-guard/route-guard.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [fade, slide],
  providers: [MessageService]
})
export class DashboardComponent implements OnInit {
  environmentVersion = environment.version;
  environmentBuildName = environment.buildName;
  pageTitle = 'Dashboard';
  moduleTitle = 'Dashboard';
  innerWidth: number;
  innerHeight: number;
  fiscalYear = '';
  showPlanned = false;
  loading = true;
  openProjectsList: any[] = [];
  selectedOpenProject: any;
  mouseOverStyle = [
    'mat-elevation-z1',
    'mat-elevation-z1',
    'mat-elevation-z1',
    'mat-elevation-z1',
    'mat-elevation-z1',
    'mat-elevation-z1'
  ];

  changeUserString: string = null;
  // hasBudgetAccess = false;
  // hasProjectAccess = false;
  // hasAdminAccess = false;
  // hasImpersonationAccess = false;

  // user access types
  // hasAccountingAccess: boolean = false;
  // hasAdminAccess: boolean = false;
  // hasAccountingApproverAccess: boolean = false;
  // hasLpoEntryAccess: boolean = false;
  // hasLpoApproverAccess: boolean = false;
  // hasInvoiceProcessorAccess: boolean = false;

  projectsInProcessLoading = true;
  viewProjectInProcessDialogOpen = false;
  currentUsersProjectsInProcess: any[] = [];
  selectedProjectInWorkflowId: number[] = [];
  openProjectsLoading = true;

  budgetsInProcessLoading = true;
  viewBudgetInProcessDialogOpen = false;
  currentUsersBudgetsInProcess: any[] = [];
  selectedBudgetInWorkflowId: number[] = [];

  // my open budgets
  openBudgetsLoading = true;
  openBudgetsList: any[] = [];

  hiddenLink = false; // environment.hideHeaderLinks;


  elevate(event: MouseEvent) {
    // console.log(event);
    event.target['classList'].add('mat-elevation-z8');
  }

  lower(event: MouseEvent) {
    event.target['classList'].remove('mat-elevation-z8');
  }


  constructor(
    private messageService: MessageService,
    private _dashboardService: DashboardService,
    private _router: Router,
    private _routeGuard: RouteGuardService
  ) {}

  ngOnInit() {
    this.messageService.add({
      severity: 'success',
      summary: 'Service Message',
      detail: 'Via MessageService',
      life: 10000
    });

    this.innerHeight = window.innerHeight;
    this.innerWidth = window.innerWidth;

    this.loading = false;


    // this.checkRoles();
  }

  private checkRoles() {
    const name = localStorage.getItem('AlternateUsername');
    this.changeUserString =
      name == null ? 'Proxy LogOn' : 'Proxy LogOn (' + name + ')';
    // this.hasBudgetAccess = this._routeGuard.checkRoles(
    //   'CapX Administrator,Budget Originator'
    // );
    // this.hasAdminAccess = this._routeGuard.checkRoles('CapX Administrator');
    // this.hasProjectAccess = this._routeGuard.checkRoles(
    //   'CapX Administrator,CapX Originator'
    // );
    // this.hasImpersonationAccess = this._routeGuard.checkRoles(
    //   'CapX Administrator'
    // );
    // this.checkPlannedBudgetAccess();
    // ? should we just reload the current page? some dropdowns will remain, but admins aren't likely to misuse this?
  }

  hasAccountingAccess(): boolean {
    return this._routeGuard.checkRoles(
      'Grower Accounting Admin,Accounting'
    );
  }

  hasAdminAccess(): boolean {
    return this._routeGuard.checkRoles(
      'Grower Accounting Admin'
    );
  }

  hasLpoEntryAccess(): boolean {
    return this._routeGuard.checkRoles(
      'LPO Entry'
    );
  }

  hasLpoApproverAccess(): boolean {
    return this._routeGuard.checkRoles(
      'LPO Approver'
    );
  }

  hasAccountingApproverAccess(): boolean {
    return this._routeGuard.checkRoles(
      'Grower Accounting Approver'
    );
  }

  hasInvoiceProcessorAccess(): boolean {
    return this._routeGuard.checkRoles(
      'Invoice Processor'
    );
  }




  hasImpersonationAccess(): boolean {
    // console.log(name);
    // console.log(
    //   `Has Impersonation Access: ${this._routeGuard.checkRoles(
    //     'CapX Administrator'
    //   )}, name: ${name != null}, name2: ${!!name}`
    // );
    return this._routeGuard.checkRoles('CapX Administrator') || !!name;
  }

  // CLEANUP: Delete Dead method after testing
  /*continueEnteringProjectClicked(selectedProject) {
    console.log(selectedProject);
    const selected = this.openProjectsList[selectedProject[0]];
    this._router.navigate([`/ProjectComponent`], {
      queryParams: { id: selected.Id }
    });
  }*/

  // CLEANUP: Delete Dead method after testing
  /*betweenInclusive(num: number, min: number, max: number): boolean {
    return num >= min && num <= max;
  }*/

  getOpenProjectDrafts() {
    const altUser = JSON.parse(localStorage.getItem('AlternateUser'));

    this._dashboardService.getOpenProjects(altUser).subscribe(
      data => {
        this.openProjectsLoading = false;
        this.openProjectsList = data;
      },
      error => {
        this.openProjectsLoading = false;
        console.error(error);
      }
    );
  }

  /** Get the open budgets  */
  getOpenBudgetDrafts() {
    this.openBudgetsList = [];
    this.currentUsersBudgetsInProcess = [];
    const inProcStatuses: string[] = [''];
    // TODO: Should we cast this to the correct type instead of an any?
    const altUser = JSON.parse(localStorage.getItem('AlternateUser'));
    this.openBudgetsLoading = true;
    const date = new Date();
    this._dashboardService.getFiscalYears().subscribe(fyData => {
      if (fyData.items.length === 1) {
        this._dashboardService
          .getOpenBudgetsByYear(date.getFullYear(), altUser)
          .subscribe(
            data => {
              this.openBudgetsLoading = false;
              this.openBudgetsList = data.filter(
                b => b.Status === 'Not Started' || b.Status === 'Queued'
              );
              this.currentUsersBudgetsInProcess = data.filter(
                b => b.Status === 'Pending' || b.Status === 'Queued'
              );
            },
            error => {
              this.openBudgetsLoading = false;
              console.error(error);
            }
          );
      } else {
        this._dashboardService
          .getOpenBudgetsByYear(date.getFullYear(), altUser)
          .subscribe(
            data => {
              this.openBudgetsList = this.openBudgetsList.concat(
                data.filter(b => b.Status === 'Not Started')
              );
              this.currentUsersBudgetsInProcess = this.currentUsersBudgetsInProcess.concat(
                data.filter(b => b.Status === 'Pending')
              );
              this._dashboardService
                .getOpenBudgetsByYear(date.getFullYear() + 1, altUser)
                .subscribe(
                  data2 => {
                    this.openBudgetsLoading = false;
                    this.openBudgetsList = this.openBudgetsList.concat(
                      data2.filter(b => b.Status === 'Not Started')
                    );
                    this.currentUsersBudgetsInProcess = this.currentUsersBudgetsInProcess.concat(
                      data2.filter(b => b.Status === 'Pending')
                    );
                    this.openBudgetsLoading = false;
                  },
                  error => {
                    this.openBudgetsLoading = false;
                    console.error(error);
                  }
                );
            },
            error => {
              this.openBudgetsLoading = false;
              console.error(error);
            }
          );
      }
    });
  }

  // CLEANUP: delete dead methods after testing
  /*continueEnteringBudgetClicked(selectedBudget) {
    const selected = this.openBudgetsList[selectedBudget[0]];
    this._router.navigate([`/BudgetAddComponent`], {
      queryParams: { id: selected.Id }
    });
  }

  openProjectInProcessDialog(selectedProject) {
    this.viewProjectInProcessDialogOpen = true;
    // this._dashboardService.getProjectWorkflowStatus(selectedProject.Id).subscribeOn(data => {
    //   this.s = data;
    // });
  }

  closeProjectInProcessDialog() {
    this.viewProjectInProcessDialogOpen = false;
  }

  openBudgetInProcessDialog(selectedBudget) {
    this.viewBudgetInProcessDialogOpen = true;
    // this._dashboardService.getProjectWorkflowStatus(selectedProject.Id).subscribeOn(data => {
    //   this.s = data;
    // });
  }

  closeBudgetInProcessDialog() {
    this.viewBudgetInProcessDialogOpen = false;
  }*/
}
