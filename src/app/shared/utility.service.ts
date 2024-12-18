import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { environment } from '../../environments/environment';
import { AuthorizationUtilities } from './auth-utilities';
import { _throw } from 'rxjs/observable/throw';
import { IApiResponse } from '../models/api-response.interface';



@Injectable()
export class UtilityService {
  /** Base URL for the Grower API. */
  private baseUrl = environment.apiUrl;

  constructor(
    private http: Http,
    private _authUtil: AuthorizationUtilities
  ) {}

  /** Check if a settlement batch is currently in process so we can lock the site */
  isSettlementInProcess(): Observable<boolean> {
    const url = `${this.baseUrl}/Settlement/GetSettlementBatchLockStatus/`;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        const resp = response.json();
        // temp bypass for testing!
        return false;
        // return <boolean>resp;
      })
      .catch(this.handleError);
  }

  /** check if there's an open transaction batch so we can prevent other account modifiers from happening (aka settlements) */
  isTransactionInProcess(): Observable<boolean> {
    const url = `${this.baseUrl}/Transaction/GetTransactionBatchLockStatus/`;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        const resp = response.json();
        // temp bypass for testing!
        return false;
        // return <boolean>resp;
      })
      .catch(this.handleError);
  }

  /** manually updates the grower master list (and bank notes and accounts?) */
  updateGrowerData(): Observable<IApiResponse> {
    const url = `${this.baseUrl}/Utility/UpdateGrowerMasterData?updateCommand=UPDATE`;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        const resp = response.json();
        return <IApiResponse>resp;
      })
      .catch(this.handleError);
  }

  syncTransactionBacklog(): Observable<IApiResponse> {
    const url = `${this.baseUrl}/Transaction/SyncTransactionImports`;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        const resp = response.json();
        return <IApiResponse>resp;
      })
      .catch(this.handleError);
  }



  // GetTransactionBatchLockStatus

  private handleError(error: Response): Observable<any> {
    const msg = error.toString();
    return _throw(msg);
  }

}

