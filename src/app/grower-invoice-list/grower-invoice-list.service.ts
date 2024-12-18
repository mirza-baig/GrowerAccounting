import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { environment } from '../../environments/environment';
import { AuthorizationUtilities } from '../shared/auth-utilities';
import { _throw } from 'rxjs/observable/throw';
import { IGrowerMaster } from 'src/app/models/grower-master.interface';
import { IApInvoice } from '../models/ap-invoice.interface';
import { IApiResponse } from '../models/api-response.interface';
import { IApInvoiceSearchVM } from '../models/ap-invoice-search-vm.interface';
import { IApInvoiceTall } from '../models/ap-invoice-tall.interface';


@Injectable()
export class GrowerInvoiceListService {
  /** Base URL for the Grower API. */
  private baseUrl = environment.apiUrl;

  constructor(
    private http: Http,
    private _authUtil: AuthorizationUtilities
  ) {}

  /** get the list of all invoices for a grower */
  getInvoicesByGrowerId(id: number): Observable<IApInvoice[]> {
    const url = `${this.baseUrl}/Invoice/getInvoicesByGrowerId?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {

        const resp = response.json();
        return <IApInvoice[]>resp;
      })
      .catch(this.handleError);
  }

  /** for retrying posting an invoice */
  exportAPInvoices(invoice: IApInvoice): Observable<IApiResponse> {
    const url = `${this.baseUrl}/Invoice/ExportAPInvoices/`;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .post(url, invoice, options)
      .map(response => {

        const resp = response.json();
        if (resp.statusCode !== 200) {

          throw new Error(resp.error);
        }
        return <IApiResponse>resp;
      })
      .catch(this.handleError);
  }

  /** get a list of invoices */
  searchInvoices(search: IApInvoiceSearchVM): Observable<IApInvoiceTall[]> {
    const url = `${this.baseUrl}/Invoice/PostReturnInvoicesByDaysBack/`;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .post(url, search, options)
      .map(response => {

        const resp = response.json();
        if (resp.statusCode !== 200) {

          throw new Error(resp.error);
        }

          return <IApInvoiceTall[]>JSON.parse(resp.data);


      })
      .catch(this.handleError);
  }

  // /api/Invoice/PostReturnInvoicesByDaysBack

  private handleError(error: Response): Observable<any> {
    const msg = error.toString();
    return _throw(msg);
  }

}

