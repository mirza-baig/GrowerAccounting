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
import { ITransactionVM } from 'src/app/models/transaction-vm.interface';
import { IGrowerTransactionVM } from 'src/app/models/grower-transaction-vm.interface';
import { IGrowerTransaction } from 'src/app/models/grower-transaction.interface';
import { IGrowerMaster } from 'src/app/models/grower-master.interface';
import { IApiResponse } from 'src/app/models/api-response.interface';


@Injectable()
export class AddGrowerTransactionService {
  /** Base URL for the Grower API. */
  private baseUrl = environment.apiUrl;

  constructor(
    private http: Http,
    private _authUtil: AuthorizationUtilities
  ) {}

  getGrowerList(getAll: boolean): Observable<IGrowerMaster[]> {
    const url = `${this.baseUrl}/Grower/GetGrowers?getAll=` + getAll;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        // const resp = JSON.parse(response);
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        return <IGrowerMaster[]>response.json();
      })
      .catch(this.handleError);
  }

  /** Get the transaction by the id */
  getGrowerTransactionById(id: number): Observable<IGrowerTransaction> {
    // todo - this says grower id, but is actual transaction id
    const url = `${this.baseUrl}/Transaction/GetGrowerTransactionById?growerId=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        // const resp = JSON.parse(response);
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        return <IGrowerTransaction>response.json();
      })
      .catch(this.handleError);
  }

  /** Get the transaction by the grower id */
  getGrowerTransaction(id: number): Observable<IGrowerTransactionVM[]> {
    const url = `${this.baseUrl}/Transaction/getGrowerTransactionById?growerId=` + id;
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

