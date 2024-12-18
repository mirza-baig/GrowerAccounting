import { IAPComparisonVM } from './../../models/ap-comparison-vm.interface';
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



@Injectable()
export class APBalanceCompareService {
  /** Base URL for the Grower API. */
  private baseUrl = environment.apiUrl;

  constructor(
    private http: Http,
    private _authUtil: AuthorizationUtilities
  ) {}

  /** get  the compared AP files, test and live */
  getApInvoiceComparisons(): Observable<IAPComparisonVM> {
    const url = `${this.baseUrl}/Invoice/GetApInvoiceComparisons`;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        const resp = response.json();
        // temp bypass for testing!
        return <IAPComparisonVM>resp;
      })
      .catch(this.handleError);
  }
  /** reset the AP test files */
  resetTestAPFiles(): Observable<IApiResponse> {
    const url = `${this.baseUrl}/Invoice/ResetTestAPFiles`;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
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

