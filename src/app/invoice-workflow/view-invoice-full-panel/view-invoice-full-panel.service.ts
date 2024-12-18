//


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
import { AuthorizationUtilities } from 'src/app/shared/auth-utilities';
import { IApInvoiceWithRequestFullVM } from 'src/app/models/ap-invoice-with-request-full-vm.interface';



@Injectable()
export class ViewInvoiceFullPanelService {
  /** Base URL for the Grower API. */
  private baseUrl = environment.apiUrl;

  constructor(
    private http: Http,
    private _authUtil: AuthorizationUtilities
  ) {}

  /** get an individual payment request batch */
  getFullInvoice(id: number): Observable<IApInvoiceWithRequestFullVM> {
    const url = `${this.baseUrl}/Invoice/GetFullInvoice?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        const resp = response.json();
        // temp bypass for testing!
        return <IApInvoiceWithRequestFullVM>resp;
      })
      .catch(this.handleError);
  }





  // GetTransactionBatchLockStatus

  private handleError(error: Response): Observable<any> {
    const msg = error.toString();
    return _throw(msg);
  }

}

