import { IApiResponse } from '../../models/api-response.interface';
import { IInvoiceSearchVM } from '../../models/invoice-search-vm.interface';
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
import { IVwApinvoiceWithRequest } from 'src/app/models/vw-ap-invoice-with-request.interface';

@Injectable()
export class InvoiceSearchService {
  /** Base URL for the Grower API. */
  private baseUrl = environment.apiUrl;

  constructor(
    private http: Http,
    private _authUtil: AuthorizationUtilities
  ) {}

  /** sync the check data with the AS400 */
  syncInvoiceCheckData(): Observable<IApiResponse> {
    const url = `${this.baseUrl}/Invoice/SyncInvoiceCheckData`;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {

        const resp = response.json();
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        // return <IAccountVM>resp.data;
        return <IApiResponse>resp;
      })
      .catch(this.handleError);
  }

  /** search te historical invoice list */
  searchInvoices(searchModel: IInvoiceSearchVM): Observable<IVwApinvoiceWithRequest[]> {
    const url = `${this.baseUrl}/Invoice/SearchInvoices/`;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .post(url, searchModel, options)
      .map(response => {
        const resp = response.json();
        return <IVwApinvoiceWithRequest[]>resp;
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

