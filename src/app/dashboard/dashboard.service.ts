import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { environment } from '../../environments/environment';
import { AuthorizationUtilities } from '../shared/auth-utilities';
import { HttpClient } from '@angular/common/http';
import { _throw } from 'rxjs/observable/throw';
import { IDropdownListVM } from '../models/dropdown-list-vm.interface';

@Injectable()
export class DashboardService {
  /** Base URL for the Live Haul API. */
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private _authUtil: AuthorizationUtilities
  ) {}

  /** Get the budget items for a fiscal year */
  getBudgetsByYear(fiscalYear: number): Observable<any[]> {
    const url = `${this.baseUrl}/Budget/GetBudgetsByYear/` + fiscalYear;
    const options = this._authUtil.getHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        const resp = JSON.parse(response);
        if (resp.statusCode !== 200) {
          throw new Error(resp.error);
        }
        return <any[]>resp.data;
      })
      .catch(this.handleError);
  }

  /** Get the budget items for a fiscal year and user */
  getBudgetsByUserYear(
    fiscalYear: number,
    alternateUserId: string
  ): Observable<any[]> {
    const url =
      `${this.baseUrl}/Budget/GetBudgetsByYear/` +
      fiscalYear +
      `/` +
      alternateUserId;
    const options = this._authUtil.getHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        const resp = JSON.parse(response);
        if (resp.statusCode !== 200) {
          throw new Error(resp.error);
        }
        return <any[]>resp.data;
      })
      .catch(this.handleError);
  }

  private handleError(error: Response): Observable<any> {
    const msg = error.toString();
    return _throw(msg);
  }

  /** Get fiscal years from the api, min is the current year */
  getFiscalYears(): Observable<IDropdownListVM> {
    const options = this._authUtil.getHeaderOptions();
    const url = `${this.baseUrl}/Budget/GetFiscalYears`;

    return this.http
      .get(url, options)
      .map(response => {
        const resp = JSON.parse(response);
        if (resp.statusCode !== 200) {
          throw new Error(this.combineErrors(resp.errors));
        }
        return <IDropdownListVM[]>resp.data;
      })
      .catch(this.handleError);
  }

  /** Get the projects for a given fiscal year */
  getProjectsByYear(fiscalYear: number): Observable<any[]> {
    const options = this._authUtil.getHeaderOptions();
    const url = `${this.baseUrl}/Project/GetProjectsByYear/${fiscalYear}`;

    return this.http
      .get(url, options)
      .map(response => {
        const resp = JSON.parse(response);
        if (resp.statusCode !== 200) {
          throw new Error(this.combineErrors(resp.errors));
        }
        return <any[]>resp.data;
      })
      .catch(this.handleError);
  }

  /** Get the projects for a given fiscal year */
  getProjectsWithChecksByYear(
    fiscalYear: number
  ): Observable<any[]> {
    const options = this._authUtil.getHeaderOptions();
    const url = `${
      this.baseUrl
    }/Project/GetProjectsWithChecksByYear/${fiscalYear}`;

    return this.http
      .get(url, options)
      .map(response => {
        const resp = JSON.parse(response);
        if (resp.statusCode !== 200) {
          throw new Error(this.combineErrors(resp.errors));
        }
        return <any[]>resp.data;
      })
      .catch(this.handleError);
  }

  /** Get the project's approver list */
  getOpenProjects(altUser: string): Observable<any[]> {
    let url: string;

    if (altUser == null) {
      url = `${this.baseUrl}/Project/GetOpenProjects/`;
    } else {
      url =
        `${this.baseUrl}/Project/GetOpenProjects/` + altUser['AlternateUserId'];
    }
    const options = this._authUtil.getHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        const resp = JSON.parse(response);
        if (resp.statusCode !== 200) {
          throw new Error(this.combineErrors(resp.errors));
        }
        return <any[]>resp.data;
      })
      .catch(this.handleError);
  }

  /** Get the list of open projects for the current user*/
  getOpenBudgets(altUser: string): Observable<any[]> {
    let url: string;
    const date = new Date();
    if (altUser == null) {
      url = `${this.baseUrl}/Budget/GetBudgetsByUserYear/` + date.getFullYear();
    } else {
      url =
        `${this.baseUrl}/Budget/GetBudgetsByUserYear/` +
        date.getFullYear().toString() +
        `/` +
        altUser['AlternateUserId'];
    }

    // for testing purposes
    // url = `${this.baseUrl}/Budget/GetBudgetsByUserYear/2018/2332BBF6-B7F0-4A35-BDC1-C13A3180A3D5`;
    const options = this._authUtil.getHeaderOptions();
    return this.http
      .get(url, options)
      .map(response => {
        const resp = JSON.parse(response);
        if (resp.statusCode !== 200) {
          throw new Error(this.combineErrors(resp.errors));
        }
        return <any[]>resp.data;
      })
      .catch(this.handleError);
  }

  public getOpenBudgetsByYear(
    year: number,
    altUser: string
  ): Observable<any[]> {
    let url: string;
    const date = new Date();
    if (altUser == null) {
      url = `${this.baseUrl}/Budget/GetBudgetsByUserYear/` + year;
    } else {
      url =
        `${this.baseUrl}/Budget/GetBudgetsByUserYear/` +
        year +
        `/` +
        altUser['AlternateUserId'];
    }

    // for testing purposes
    // url = `${this.baseUrl}/Budget/GetBudgetsByUserYear/2018/2332BBF6-B7F0-4A35-BDC1-C13A3180A3D5`;
    const options = this._authUtil.getHeaderOptions();
    return this.http
      .get(url, options)
      .map(response => {
        const resp = JSON.parse(response);
        if (resp.statusCode !== 200) {
          throw new Error(this.combineErrors(resp.errors));
        }
        return <any[]>resp.data;
      })
      .catch(this.handleError);
  }

  /** combines the array of errors into a single string */
  private combineErrors(errors: string[]): string {
    return errors.join(', ');
  }
}

/*
/api/Budget/GetBudgetsByYear/{fiscalYear}
/api/Budget/GetBudgetsByUserYear/{fiscalYear}
/api/Project/GetProjectsByYear/{fiscalYear}
/api/Project/GetProjectsByUserYear/{fiscalYear}
/api/Budget/GetBudgetLogsByBudgetId/{budgetId}
/api/Budget/GetBudgetLogsByDateRange/{fromDate}/{toDate}
/api/Project/GetProjectLogsByProjectId/{budgetId}
/api/Project/GetProjectLogsByDateRange/{fromDate}/{toDate}
/api/Budget/GetQuarterlySpendBudgetByLocationYear/{locationId}/{fiscalYear}
/api/Budget/GetQuarterlySpendLogByBudget/{budgetId}
/api/Project/GetQuarterlySpendLogByProject/{projectId}
/api/Project/GetSupplementalFundsByProject/{projectId}

*/
