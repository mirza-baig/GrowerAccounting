import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { environment } from '../../environments/environment';
import { _throw } from 'rxjs/observable/throw';
import { IApiResponse } from '../models/api-response.interface';
import { AuthorizationUtilities } from 'src/app/shared/auth-utilities';
import { IApinvoicePaymentRequest } from 'src/app/models/ap-invoice-payment-request.interface';
import { IApinvoicePaymentRequestBatch } from 'src/app/models/ap-invoice-payment-request-batch.interface';
import { IGrowerBonusPayment } from '../models/grower-bonus-payment.interface';



@Injectable()
export class GrowerBonusUploadService {
  /** Base URL for the Grower API. */
  private baseUrl = environment.apiUrl;

  constructor(
    private http: Http,
    private _authUtil: AuthorizationUtilities
  ) {}

   
  /**  */
  postGrowerBonuses(payments: IGrowerBonusPayment[]): Observable<IApiResponse> {
    const url = `${this.baseUrl}/Grower/PostGrowerBonuses`;
    const options = this._authUtil.getWildcardHeaderOptions();
    return this.http
      .post(url, payments, options)
      .map(response => {
        const resp = response.json();
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

