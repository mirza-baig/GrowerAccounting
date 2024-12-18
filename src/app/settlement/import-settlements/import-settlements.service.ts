import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { environment } from '../../../environments/environment';
import { AuthorizationUtilities } from '../../shared/auth-utilities';
import { HttpClient } from '@angular/common/http';
import { _throw } from 'rxjs/observable/throw';
import { IAccountVM } from 'src/app/models/account-vm.interface';
import { IApiResponse } from 'src/app/models/api-response.interface';
import { ISettlementDatesVM } from 'src/app/week-ending-date-picker/settlement-dates-vm.interface';
import { IKeyValuePair } from './key-value-pair.interface';


@Injectable()
export class ImportSettlementsService {
  /** Base URL for the Grower API. */
  private baseUrl = environment.apiUrl;
  private breederApiUrl = environment.breederSettlementApiUrl;

  constructor(
    private http: Http,
    private _authUtil: AuthorizationUtilities
  ) {}

  // https://sql_test.fieldale.com:11310/api/Approval/ImportApprovedSettlement/{period}/{year}

  /** Get the account by the id */
  // getAccountById(id: number): Observable<IAccountVM> {
  //   const url = `${this.baseUrl}/Grower/getGrowerById/` + id;
  //   const options = this._authUtil.getHeaderOptions();

  //   return this.http
  //     .get(url, options)
  //     .map(response => {
  //       const resp = JSON.parse(response);
  //       if (resp.statusCode !== 200) {
  //         throw new Error(resp.error);
  //       }
  //       return <IAccountVM>resp.data;
  //     })
  //     .catch(this.handleError);
  // }

  /** init the process to import broiler settlements for a date */
  importBroilerSettlements(date: Date): Observable<IApiResponse> {
    const url = `${this.baseUrl}/Settlement/ImportBroilerSettlements?date=` + date.toISOString().replace('Z', '');
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .post(url, null, options)
      .map(response => {
        const resp = response.json();

        if (resp.statusCode !== 200) {
          throw new Error(resp.error);
        }
        return <IApiResponse>resp;
      })
      .catch(this.handleError);
  }

  /** init the process to import broiler settlements for a date */
  importBreederSettlements(period: number, year: number): Observable<any> {
    const url = `${this.breederApiUrl}/Approval/ImportApprovedSettlement/` + year + `/` + period;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {

        /*
          headers: Headers {_headers: Map(1), _normalizedNames: Map(1)}
          ok: true
          status: 200
          statusText: "OK"
          type: 2
          url: "https://sql_test.fieldale.com:11310/api/Approval/ImportApprovedSettlement/2020/5"
          _body: ""success""
          __proto__: Body
        */
        return response;
      })
      .catch(this.handleError);
  }

  /** gets the list of unique settlement dates (with status) for imports */
  getSettlementDatesWithStatus(): Observable<ISettlementDatesVM[]> {
    const url = `${this.baseUrl}/Settlement/GetSettlementDatesWithStatus/`;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        const resp = response.json();
        return <ISettlementDatesVM[]>resp;
      })
      .catch(this.handleError);
  }

  /** gets the list of unique settlement dates (with status) for imports */
  getValidBreederDates(): Observable<IKeyValuePair[]> {
    const url = `${this.breederApiUrl}/Settlement/ValidPeriodsYears/`;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        const resp = response.json();
        return <IKeyValuePair[]>resp;
      })
      .catch(this.handleError);
  }



  private handleError(error: Response): Observable<any> {
    const msg = error.toString();
    return _throw(msg);
  }

  /** combines the array of errors into a single string */
  private combineErrors(errors: string[]): string {
    return errors.join(', ');
  }
}

