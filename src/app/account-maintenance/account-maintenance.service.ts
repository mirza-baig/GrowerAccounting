// getGrowerById


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
import { IGrowerVM } from '../models/grower-vm.interface';
import { IAccountVM } from '../models/account-vm.interface';
import { IGrowerMasterVM } from '../models/grower-master.vm.interface';
import { IGrowerMaster } from '../models/grower-master.interface';
import { IGrowerAccount } from '../models/grower-account.interface';
import { IApiResponse } from '../models/api-response.interface';
import { IGrowerAccountPost } from '../models/grower-account-post.interface';

@Injectable()
export class AccountMaintenanceService {
  /** Base URL for the Grower API. */
  private baseUrl = environment.apiUrl;

  constructor(
    private http: Http,
    private _authUtil: AuthorizationUtilities
  ) {}

  /** get an individual grower sub account */
  getGrowerMaster(id: number): Observable<IGrowerMaster> {
    const url = `${this.baseUrl}/Grower/GetGrowerById?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();
    return this.http
      .get(url, options)
      .map(response => {

        const resp = response.json();
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        // return <IAccountVM>resp.data;
        return <IGrowerMaster>resp;
      })
      .catch(this.handleError);
  }

  /** Get a list of accounts for a grower */
  getGrowerAccounts(id: number): Observable<IGrowerAccount[]> {
    const url = `${this.baseUrl}/Grower/GetGrowerAccounts?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        let accounts = <IGrowerAccount[]>response.json();
        accounts = accounts.map(a => {
          a.accountType = a.accountType.toString();
          return a;
        });

        // const resp = JSON.parse(response);
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        return accounts;
      })
      .catch(this.handleError);
  }

  /** Get the account by the id */
  getAccountById(id: number): Observable<IGrowerAccountPost> {
    const url = `${this.baseUrl}/Grower/GetGrowerAccount?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        const resp = response.json();
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        return <IGrowerAccount>resp;
      })
      .catch(this.handleError);
  }


  /** post an individual grower's sub account */
  postGrowerSubAccount(account: IGrowerAccountPost): Observable<IApiResponse> {
    const url = `${this.baseUrl}/Grower/PostGrowerAccount/`;
    const options = this._authUtil.getWildcardHeaderOptions();
    return this.http
      .post(url, account, options)
      .map(response => {
        const resp = response.json();

        if (resp.statusCode !== 200) {
          throw new Error(resp.error);
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

