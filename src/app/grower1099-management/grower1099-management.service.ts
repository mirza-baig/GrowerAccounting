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
import { IGrower1099VM } from '../models/grower-1099-batch.interface';


@Injectable()
export class Grower1099ManagementService {
  /** Base URL for the Grower API. */
  private baseUrl = environment.apiUrl;

  constructor(
    private http: Http,
    private _authUtil: AuthorizationUtilities
  ) {}

  /** Get the transaction by the id */
  getGrower1099ForYear(year: number): Observable<IGrower1099VM> {
    const url = `${this.baseUrl}/Grower/GetGrower1099ForYear?Year=` + year;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        return <IGrower1099VM>response.json();
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

