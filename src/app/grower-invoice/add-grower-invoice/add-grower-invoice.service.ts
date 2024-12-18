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
import { IApInvoice } from 'src/app/models/ap-invoice.interface';
import { IApiResponse } from 'src/app/models/api-response.interface';
import { IApgldistributionAccounts } from 'src/app/models/apgldistribution-accounts.interface';
import { IAPVoucher } from 'src/app/models/ap-voucher.interface';


@Injectable()
export class AddGrowerInvoiceService {
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

  /** Get the invoice by the id */
  getInvoice(id: number): Observable<IApInvoice> {
    const url = `${this.baseUrl}/Invoice/GetInvoiceById?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        // const resp = JSON.parse(response);
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        return <IApInvoice>response.json();
      })
      .catch(this.handleError);
  }

  /** post a grower invoice */
  postVoucher(voucher: IAPVoucher): Observable<IApiResponse> {
    const url = `${this.baseUrl}/Invoice/PostVoucher/`;
    const options = this._authUtil.getWildcardHeaderOptions();


    return this.http
      .post(url, voucher, options)
      .map(response => {
        const resp = response.json();

        if (resp.statusCode !== 200) {
          throw new Error(resp.error);
        }
        return <IApiResponse>resp;
      })
      .catch(this.handleError);
  }

  /** get the AP Voucher */
  getAPVoucherById(id: number): Observable<IAPVoucher> {
    const url = `${this.baseUrl}/Invoice/GetAPVoucherById?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        // const resp = JSON.parse(response);
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        return <IAPVoucher>response.json();
      })
      .catch(this.handleError);
  }



  /** Get the account distributions for an invoice*/
  getAPGLDistributionAccountsByInvoiceId(id: number): Observable<IApgldistributionAccounts[]> {
    const url = `${this.baseUrl}/Invoice/GetAPInvoiceDistributionsByInvoiceId?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        // const resp = JSON.parse(response);
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        return <IApgldistributionAccounts[]>response.json();
      })
      .catch(this.handleError);
  }


  /** post a grower invoice */
  postInvoice(invoice: IApInvoice): Observable<IApiResponse> {
    const url = `${this.baseUrl}/Invoice/PostInvoice/`;
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

  /** post the account distributions */
  postAPGLDistributionAccounts(distributions: IApgldistributionAccounts[]): Observable<IApiResponse> {
    const url = `${this.baseUrl}/Invoice/PostAPInvoiceDistribution/`;
    const options = this._authUtil.getWildcardHeaderOptions();


    return this.http
      .post(url, distributions, options)
      .map(response => {
        const resp = response.json();

        if (resp.statusCode !== 200) {
          throw new Error(resp.error);
        }
        return <IApiResponse>resp;
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


  /** delete an AP voucher */
  deleteVoucher(id: number): Observable<any> {
    const url = `${this.baseUrl}/Invoice/DeleteVoucher?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .delete(url, options)
      .map(response => {

        const resp = response.json();
        return <any>resp;
      })
      .catch(this.handleError);
  }

  /** delete an AP GL acct distribution */
  deleteAPGLDistributionAccount(id: number): Observable<any> {
    const url = `${this.baseUrl}/Invoice/DeleteAPGLDistributionAccount?id=` + id;
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

