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
import { IGrowerMaster } from '../models/grower-master.interface';
import { IGrowerTransaction } from '../models/grower-transaction.interface';

@Injectable()
export class AccountInquiryService {
  /** Base URL for the Grower API. */
  private baseUrl = environment.apiUrl;

  constructor(
    private http: Http,
    private _authUtil: AuthorizationUtilities
  ) {}

  

  /** get the list of all grower masters*/
  getGrowers(getAll: boolean): Observable<IGrowerMaster[]> {
    const url = `${this.baseUrl}/Grower/GetGrowers?getAll=` + getAll;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {

        const resp = response.json();
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        // return <IAccountVM>resp.data;
        return <IGrowerMaster[]>resp;
      })
      .catch(this.handleError);
  }


  /** Get the list of all transactions for a grower */
  getGrowerTransactionsByGrowerId(id: number): Observable<IGrowerTransaction[]> {
    const url = `${this.baseUrl}/Transaction/GetGrowerTransactionsByGrowerId?id=` + id;
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

  private handleError(error: Response): Observable<any> {
    const msg = error.toString();
    return _throw(msg);
  }

  /** combines the array of errors into a single string */
  private combineErrors(errors: string[]): string {
    return errors.join(', ');
  }
}

