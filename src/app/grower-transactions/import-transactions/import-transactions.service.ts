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
import { IDateRangeVM } from 'src/app/models/date-range-vm.interface';


@Injectable()
export class ImportTransactionsService {
  /** Base URL for the Grower API. */
  private baseUrl = environment.apiUrl;

  constructor(
    private http: Http,
    private _authUtil: AuthorizationUtilities
  ) {}

  /** import PCS strore transactions */
  importPcsStoreTransactions(dates: IDateRangeVM): Observable<IApiResponse> {
    const url = `${this.baseUrl}/Utility/ImportPCSTransactions/`;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .post(url, dates, options)
      .map(response => {
        const resp = response.json();
        if (resp.statusCode !== 200) {
          throw new Error(resp.error);
        }
        return <IApiResponse>resp;
      })
      .catch(this.handleError);
  }

  /** Import  */
  importLpGasTransactions(): Observable<IApiResponse> {
    const url = `${this.baseUrl}/Utility/ImportLPGasTransactions/`;
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

  loadPastPcsTransactions(date: Date): Observable<IApiResponse> {
    const ds = date.getFullYear().toString() + '-' + date.getMonth().toString() + '-' + date.getDate().toString();
    const url = `${this.baseUrl}/Transaction/LoadPastPcsTransactions/?date=` + ds;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url,  options)
      .map(response => {
        const resp = response.json();
        if (resp.statusCode !== 200) {
          throw new Error(resp.data);
        }
        return <IApiResponse>resp;
      })
      .catch(this.handleError);
  }

  loadPastLpTransactions(date: Date): Observable<IApiResponse> {
    const ds = date.getFullYear().toString() + '-' + date.getMonth().toString() + '-' + date.getDate().toString();
    const url = `${this.baseUrl}/Transaction/LoadPastLpTransactions/?date=` + ds;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url,  options)
      .map(response => {
        const resp = response.json();
        if (resp.statusCode !== 200) {
          throw new Error(resp.data);
        }
        return <IApiResponse>resp;
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

