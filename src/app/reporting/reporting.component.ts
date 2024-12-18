import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IReportCategory, IReport } from '../models/report.interface';
import { Observable } from 'rxjs';
import { fade, sidenavAnimation, leftChevronAnimation, rightChevronAnimation } from 'src/fieldale-animations';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.css'],
  animations: [
    fade,
    sidenavAnimation,
    leftChevronAnimation,
    rightChevronAnimation
  ]
})
export class ReportingComponent implements OnInit {
  pageTitle: string = 'Reporting';
  moduleTitle: string = 'Reporting';
  reports: IReportCategory[] = [];
  sidenavOpened: boolean = true;
  sidenavState = 'initial';
  currentState = 'initial';
  selectedCategory: number = -1;
  selectedReport: number = -1;
  constructor(
    private _http: HttpClient,
    // private _routeGuard: RouteGuardService
  ) {}

  ngOnInit() {
    this.getReportsFromJSON().subscribe(resp => {
      const category = {
        Category: 'Grower AR Reports',
        Reports: resp,
      } as IReportCategory;
      this.reports.push(category);
      // console.log(resp);
      // for (const category of resp) {
      //   category.Reports = category.Reports.filter(r => {
      //     return (
      //       // (r.Roles.length > 0 && this._routeGuard.checkRoles(r.Roles)) ||
      //       // r.Roles === 'all'
      //       true
      //     );
      //   }).sort((a, b) => {
      //     return a > b ? 1 : a < b ? -1 : 0;
      //   });
      //   console.log(resp);
      //   this.reports = resp;
      // }
    });
  }

  undoReportSelection() {
    this.selectedReport = -1;
  }

  public getReportsFromJSON(): Observable<IReport[]> {
    return this._http.get('../../assets/reports.json').map((res: any) => {
      return res;
    });
  }

  public getReportCategoriesFromJSON(): Observable<IReportCategory[]> {
    return this._http.get('../../assets/reports.json').map((res: any) => {
      return res;
    });
  }

  tryToggleState() {
    // console.log(event);
    if (this.sidenavState === 'final') {
      this.sidenavState = 'initial';
    } else {
      this.sidenavState = 'final';
    }
    if (this.sidenavOpened === true) {
      this.sidenavOpened = false;
    } else {
      this.sidenavOpened = true;
    }
  }

  elevate(event: MouseEvent) {
    // console.log(event);
    event.target['classList'].add('mat-elevation-z8');
  }

  lower(event: MouseEvent) {
    event.target['classList'].remove('mat-elevation-z8');
  }

  selectInitialReport(index: number) {
    this.selectedReport = index;
  }

  handleSelectionChange(categoryIndex, index) {
    this.selectedCategory = categoryIndex;
    this.selectedReport = index;
  }
}

// CLEANUP what is this? Should we remove this?
/*
{
    "Name": "*****************************LEAVE ROLES EMPTY TO DISABLE THE REPORT IN THE UI******************************",
    "Url": "CAPX ADMINISTRATORS CAN SEE ANY REPORT EXCEPT FOR ONES WITH EMPTY ROLE STRINGS*******************************",
    "Roles": ""
  },
*/
