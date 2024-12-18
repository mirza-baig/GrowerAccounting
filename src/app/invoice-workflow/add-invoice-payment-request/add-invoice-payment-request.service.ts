import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { environment } from '../../../environments/environment';
import { _throw } from 'rxjs/observable/throw';
import { IApiResponse } from '../../models/api-response.interface';
import { AuthorizationUtilities } from 'src/app/shared/auth-utilities';
import { IApinvoicePaymentRequest } from 'src/app/models/ap-invoice-payment-request.interface';
import { IApinvoicePaymentRequestBatch } from 'src/app/models/ap-invoice-payment-request-batch.interface';
import { IApinvoicePaymentFarmDistribution } from 'src/app/models/ap-invoice-payment-farm-distribution.interface';
import { IApinvoicePaymentFarmDistributionVM } from 'src/app/models/ap-invoice-payment-farm-distribution-vm.interface';



@Injectable()
export class AddInvoicePaymentRequestService {
  /** Base URL for the Grower API. */
  private baseUrl = environment.apiUrl;

  constructor(
    private http: Http,
    private _authUtil: AuthorizationUtilities
  ) {}

  /** get an individual payment request batch */
  getAPInvoicePaymentRequestBatchById(id: number): Observable<IApinvoicePaymentRequestBatch> {
    const url = `${this.baseUrl}/Invoice/GetAPInvoicePaymentRequestBatchById?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        const resp = response.json();
        return <IApinvoicePaymentRequestBatch[]>resp;
      })
      .catch(this.handleError);
  }


  getInvoicePaymentFarmDistributions(id: number): Observable<IApinvoicePaymentFarmDistribution[]> {
    const url = `${this.baseUrl}/Invoice/GetInvoicePaymentFarmDistributions?paymentRequestId=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        const resp = response.json();
        return <IApinvoicePaymentFarmDistribution[]>resp;
      })
      .catch(this.handleError);
  }

  getInvoicePaymentFarmDistributionVMs(id: number): Observable<IApinvoicePaymentFarmDistributionVM[]> {
    const url = `${this.baseUrl}/Invoice/GetInvoicePaymentFarmDistributionVMs?paymentRequestId=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        const resp = response.json();
        return <IApinvoicePaymentFarmDistributionVM[]>resp;
      })
      .catch(this.handleError);
  }



  /** get the payment requests in a batch */
  getAPInvoicePaymentRequestById(id: number): Observable<IApinvoicePaymentRequest> {
    const url = `${this.baseUrl}/Invoice/GetAPInvoicePaymentRequestById?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        const resp = response.json();
        return <IApinvoicePaymentRequest>resp;
      })
      .catch(this.handleError);
  }

  postAPInvoicePaymentRequest(request: IApinvoicePaymentRequest): Observable<IApiResponse> {
    const url = `${this.baseUrl}/Invoice/PostInvoicePaymentRequest`;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .post(url, request, options)
      .map(response => {
        const resp = response.json();
        return <IApiResponse>resp;
      })
      .catch(this.handleError);
  }

  // get and post for farm distributions


  /** delete a farm distribution */
  deleteAPInvoicePaymentFarmDistribution(id: number): Observable<any> {
    const url = `${this.baseUrl}/Invoice/DeleteAPInvoicePaymentFarmDistribution?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .delete(url, options)
      .map(response => {

        const resp = response.json();
        return <any>resp;
      })
      .catch(this.handleError);
  }

  getNextPaymentRequestInBatch(id: number): Observable<IApinvoicePaymentRequest> {
    // todo - this says grower id, but is actual transaction id
    const url = `${this.baseUrl}/Invoice/GetNextPaymentRequestInBatch?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        // const resp = JSON.parse(response);
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        return <IApinvoicePaymentRequest>response.json();
      })
      .catch(this.handleError);
  }


  // GetTransactionBatchLockStatus

  private handleError(error: Response): Observable<any> {
    const msg = error.toString();
    return _throw(msg);
  }

}

