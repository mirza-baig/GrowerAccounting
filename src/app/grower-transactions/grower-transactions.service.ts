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
import { IAccountVM } from 'src/app/models/account-vm.interface';
import { ITransactionVM } from '../models/transaction-vm.interface';
import { IGrowerTransactionVM } from '../models/grower-transaction-vm.interface';
import { IGrowerTransactionBatch } from '../models/grower-transaction-batch.interface';
import { IGrowerTransaction } from '../models/grower-transaction.interface';
import { IApiResponse } from '../models/api-response.interface';


@Injectable()
export class GrowerTransactionsService {
  /** Base URL for the Grower API. */
  private baseUrl = environment.apiUrl;

  constructor(
    private http: Http,
    private _authUtil: AuthorizationUtilities
  ) {}

  /** Get the transaction by the id */
  getGrowerTransactionById(id: number): Observable<IGrowerTransactionVM> {
    // todo - this says grower id, but is actual transaction id
    const url = `${this.baseUrl}/Transaction/getGrowerTransactionById?growerId=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        // const resp = JSON.parse(response);
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        return <IGrowerTransactionVM>response.json();
      })
      .catch(this.handleError);
  }

  /** Get the list of all batches transaction pairings (need to filter down on calling end) */
  getGrowerTransactionsBatches(): Observable<IGrowerTransactionBatch[]> {
    const url = `${this.baseUrl}/Transaction/GetGrowerTransactionsBatches/`;
    const options = this._authUtil.getWildcardHeaderOptions();



    return this.http
      .get(url, options)
      .map(response => {
        // const resp = JSON.parse(response);
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        return <IGrowerTransactionBatch[]>response.json();
      })
      .catch(this.handleError);
  }

  /** Get the list of all transactions for a batch */
  getGrowerTransactionsByBatchId(id: number): Observable<IGrowerTransaction[]> {
    const url = `${this.baseUrl}/Transaction/GetGrowerTransactionsByBatchId?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();



    return this.http
      .get(url, options)
      .map(response => {
        // const resp = JSON.parse(response);
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        return <IGrowerTransaction[]>response.json();
      })
      .catch(this.handleError);
  }


  /** Get the transaction by the grower id */
  getGrowerTransactions(id: number): Observable<IGrowerTransactionVM[]> {
    const url = `${this.baseUrl}/Transaction/getGrowerTransactions?growerId=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        // const resp = JSON.parse(response);
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        return <IGrowerTransactionVM[]>response.json();
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

  /** delete a matching grower transaction batch */
  deleteTransactionBatch(id: number): Observable<any> {
    const url = `${this.baseUrl}/Transaction/DeleteGrowerTransactionBatch?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .delete(url, options)
      .map(response => {

        const resp = response.json();
        return <any>resp;
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

