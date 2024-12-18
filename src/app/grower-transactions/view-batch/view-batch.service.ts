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
import { IGrowerTransactionBatch } from 'src/app/models/grower-transaction-batch.interface';
import { IGrowerTransaction } from 'src/app/models/grower-transaction.interface';
import { ITransactionBatchGldistributions } from 'src/app/models/transaction-batch-gl-distributions.interface';
import { IApiResponse } from 'src/app/models/api-response.interface';


@Injectable()
export class ViewBatchService {
  /** Base URL for the Grower API. */
  private baseUrl = environment.apiUrl;

  constructor(
    private http: Http,
    private _authUtil: AuthorizationUtilities
  ) {}

  /** Get the list of all batches transaction pairings (need to filter down on calling end) */
  getGrowerTransactionsBatches(id: number): Observable<IGrowerTransactionBatch[]> {
    const url = `${this.baseUrl}/Transaction/GetGrowerTransactionsBatches/` + id;
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

  getGrowerTransactionBatchGldistributions(id: number): Observable<ITransactionBatchGldistributions[]> {
    const url = `${this.baseUrl}/Transaction/GetGrowerTransactionBatchGldistributions?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();



    return this.http
      .get(url, options)
      .map(response => {
        // const resp = JSON.parse(response);
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        return <ITransactionBatchGldistributions[]>response.json();
      })
      .catch(this.handleError);
  }

  postGrowerTransactionBatchGldistributions(model: ITransactionBatchGldistributions[]): Observable<IApiResponse> {
    const url = `${this.baseUrl}/Transaction/PostGrowerTransactionBatchGldistributions/`;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .post(url, model, options)
      .map(response => {
        const resp = response.json();

        if (resp.statusCode !== 200) {
          throw new Error(resp.error);
        }
        return <IApiResponse>resp;
      })
      .catch(this.handleError);
  }


  // ITransactionBatchGldistributions

  /** delete a matching grower transaction */
  deleteTransaction(id: number): Observable<any> {
    const url = `${this.baseUrl}/Transaction/DeleteGrowerTransaction?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .delete(url, options)
      .map(response => {

        const resp = response.json();
        return <any>resp;
      })
      .catch(this.handleError);
  }

  undoTransactionBatch(id: number): Observable<IApiResponse> {
    const url = `${this.baseUrl}/Transaction/UndoTransactionBatch?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();



    return this.http
      .get(url, options)
      .map(response => {
        // const resp = JSON.parse(response);
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        return <IApiResponse>response.json();
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

