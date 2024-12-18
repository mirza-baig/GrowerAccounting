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
import { IWorkflowActionHistory } from 'src/app/models/workflow-action-history.interface';



@Injectable()
export class InvoiceBatchApprovalService {
  /** Base URL for the Grower API. */
  private baseUrl = environment.apiUrl;

  constructor(
    private http: Http,
    private _authUtil: AuthorizationUtilities
  ) {}

  /** get an individual payment request batch */
  getAPInvoicePaymentRequestBatchByToken(token: string): Observable<IApinvoicePaymentRequestBatch> {
    const url = `${this.baseUrl}/Invoice/GetAPInvoicePaymentRequestBatchForApprovalToken?token=` + token;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        const resp = response.json();
        // temp bypass for testing!
        return <IApinvoicePaymentRequestBatch>resp;
      })
      .catch(this.handleError);
  }

  getAPInvoicePaymentRequestBatchById(id: number): Observable<IApinvoicePaymentRequestBatch> {
    const url = `${this.baseUrl}/Invoice/GetAPInvoicePaymentRequestBatchById?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        const resp = response.json();
        // temp bypass for testing!
        return <IApinvoicePaymentRequestBatch>resp;
      })
      .catch(this.handleError);
  }


  /** get the payment requests in a batch */
  getAPInvoicePaymentRequestsByBatchId(id: number): Observable<IApinvoicePaymentRequest[]> {
    const url = `${this.baseUrl}/Invoice/GetAPInvoicePaymentRequestsByBatchId?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        const resp = response.json();
        // temp bypass for testing!
        return <IApinvoicePaymentRequest[]>resp;
      })
      .catch(this.handleError);
  }
 
  /** submit the approvals */
  submitApprovalActions(actions: IWorkflowActionHistory[]): Observable<IApiResponse> {
    const url = `${this.baseUrl}/Invoice/SubmitApprovalActions`;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .post(url, actions, options)
      .map(response => {
        const resp = response.json();
        // temp bypass for testing!
        return <IApiResponse>resp;
      })
      .catch(this.handleError);
  }
  
  


  // GetTransactionBatchLockStatus

  private handleError(error: Response): Observable<any> {
    const msg = error.toString();
    return _throw(msg);
  }

}

