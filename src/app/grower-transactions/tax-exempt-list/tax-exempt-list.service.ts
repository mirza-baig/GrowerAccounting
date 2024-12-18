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


@Injectable()
export class TaxExemptListService {
  /** Base URL for the Grower API. */
  private baseUrl = environment.apiUrl;

  constructor(
    private http: Http,
    private _authUtil: AuthorizationUtilities
  ) {}

   /** Get the list of all transactions tax exempt for a date range */
  getTaxExemptGrowerTransactionsForDateRange(start: Date, end: Date): Observable<IGrowerTransaction[]> {
    // tslint:disable-next-line:max-line-length
    const url = `${this.baseUrl}/Transaction/GetTaxExemptGrowerTransactionsForDateRange?start=` + start.toISOString().replace('Z', '') + '&end=' + end.toISOString().replace('Z', '');
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

