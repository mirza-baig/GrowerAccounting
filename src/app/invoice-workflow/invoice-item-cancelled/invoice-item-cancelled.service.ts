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
import { IApiResponse } from 'src/app/models/api-response.interface';
import { IApInvoiceBatch } from 'src/app/models/ap-invoice-batch.interface';
import { IApinvoicePaymentRequestBatch } from 'src/app/models/ap-invoice-payment-request-batch.interface';
import { IApinvoicePaymentRequest } from 'src/app/models/ap-invoice-payment-request.interface';
import { IWorkflowActionHistory } from 'src/app/models/workflow-action-history.interface';


@Injectable()
export class InvoiceItemCancelledService {
  /** Base URL for the Grower API. */
  private baseUrl = environment.apiUrl;

  constructor(
    private http: Http,
    private _authUtil: AuthorizationUtilities
  ) {}

  /** get a list of all the invoice batches */
  getInvoiceByToken(token: string): Observable<IApinvoicePaymentRequest> {
    const url = `${this.baseUrl}/Invoice/GetAPInvoicePaymentRequestForApprovalToken?token=` + token;
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

  getWorkflowActionHistory(id: number): Observable<IWorkflowActionHistory[]> {
    const url = `${this.baseUrl}/Workflow/GetWorkflowActionHistoriesByInvoicePaymentRequestId?invoicePaymentRequestId=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        // const resp = JSON.parse(response);
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        return <IWorkflowActionHistory[]>response.json();
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

