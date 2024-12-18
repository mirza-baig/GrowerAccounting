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


import { IApiResponse } from '../../models/api-response.interface';
import { ICreditInquiryVM } from 'src/app/models/credit-inquiry-vm.interface';
import { ISettlement } from 'src/app/models/settlement.interface';


@Injectable()
export class CreditInquiryService {
  /** Base URL for the Grower API. */
  private baseUrl = environment.apiUrl;

  constructor(
    private http: Http,
    private _authUtil: AuthorizationUtilities
  ) {}

  /** Get the transaction by the settlement id */
  getCreditInquiry(id: number): Observable<ICreditInquiryVM> {
    const url = `${this.baseUrl}/Settlement/GetCreditInquiry?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        // const resp = JSON.parse(response);
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        return <ICreditInquiryVM>response.json();
      })
      .catch(this.handleError);
  }

  /** Get a list of settlements by the grower id */
  getSettlementsByGrowerId(id: number): Observable<ISettlement[]> {
    const url = `${this.baseUrl}/Settlement/GetSettlementsByGrowerId?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        // const resp = JSON.parse(response);
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        return <ISettlement[]>response.json();
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

