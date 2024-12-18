// getGrowerById


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
import { IGrowerMaster } from '../../models/grower-master.interface';
import { IGrowerTransaction } from '../../models/grower-transaction.interface';
import { IGrowerAccount } from 'src/app/models/grower-account.interface';
import { IGrowerTransactionBatch } from 'src/app/models/grower-transaction-batch.interface';
import { IApiResponse } from 'src/app/models/api-response.interface';

@Injectable()
export class AccountTransferService {
  /** Base URL for the Grower API. */
  private baseUrl = environment.apiUrl;

  constructor(
    private http: Http,
    private _authUtil: AuthorizationUtilities
  ) {}



  /** get the individual grower */
  getGrower(id: number): Observable<IGrowerMaster> {
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
    const url = `${this.baseUrl}/Grower/getGrowerAccounts?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        // const resp = JSON.parse(response);
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        return <IGrowerAccount[]>response.json();
      })
      .catch(this.handleError);
  }


  /** Get the matching growers by the group code (usually a vendor id) */
  getGrowerRelationsByGroupCode(id: string): Observable<IGrowerMaster[]> {
    const url = `${this.baseUrl}/Grower/GetGrowerRelationsByGroupCode?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        const resp = response.json();
        return <IGrowerMaster[]>resp;
      })
      .catch(this.handleError);
  }

  /** post an individual batch */
  postTransactionBatch(batch: IGrowerTransactionBatch): Observable<IApiResponse> {
    const url = `${this.baseUrl}/Transaction/PostTransactionBatch/`;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .post(url, batch, options)
      .map(response => {
        const resp = response.json();

        if (resp.statusCode !== 200) {
          throw new Error(resp.error);
        }
        return <IApiResponse>resp;
      })
      .catch(this.handleError);
  }

  /** post an individual transaction */
  postTransaction(transaction: IGrowerTransaction): Observable<IApiResponse> {
    const url = `${this.baseUrl}/Transaction/PostTransaction/`;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .post(url, transaction, options)
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

