import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { environment } from '../../../../environments/environment';
import { AuthorizationUtilities } from '../../../shared/auth-utilities';
import { HttpClient } from '@angular/common/http';
import { _throw } from 'rxjs/observable/throw';
import { IAccountVM } from 'src/app/models/account-vm.interface';
import { IApiResponse } from 'src/app/models/api-response.interface';
import { ISettlementBatch } from 'src/app/models/settlement-batch.interface';
import { ISettlement } from 'src/app/models/settlement.interface';


@Injectable()
export class SettlementBatchActionsService {
  /** Base URL for the Grower API. */
  private baseUrl = environment.apiUrl;

  constructor(
    private http: Http,
    private _authUtil: AuthorizationUtilities
  ) {}

  /** Get the account by the id */
  // getAccountById(id: number): Observable<IAccountVM> {
  //   const url = `${this.baseUrl}/Grower/getGrowerById/` + id;
  //   const options = this._authUtil.getHeaderOptions();

  //   return this.http
  //     .get(url, options)
  //     .map(response => {
  //       const resp = JSON.parse(response);
  //       if (resp.statusCode !== 200) {
  //         throw new Error(resp.error);
  //       }
  //       return <IAccountVM>resp.data;
  //     })
  //     .catch(this.handleError);
  // }

   /** get a settlement batch by id*/
   getSettlementBatch(id: number): Observable<ISettlementBatch> {
    const url = `${this.baseUrl}/Settlement/GetSettlementBatch?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url,  options)
      .map(response => {
        const resp = response.json();

        return <ISettlementBatch>resp;
      })
      .catch(this.handleError);
  }

  /** post a settlement batch */
  postSettlementBatch(batch: ISettlementBatch): Observable<IApiResponse> {
    const url = `${this.baseUrl}/Settlement/PostSettlementBatch/`;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .post(url, batch, options)
      .map(response => {
        const resp = response.json();

        if (resp.statusCode !== 200) {
          throw new Error(resp.error);
        }
        return <IApiResponse>resp;
      })
      .catch(this.handleError);
  }

  /** delete a settlement batch by id */
  deleteSettlementBatch(id: number): Observable<any> {
    const url = `${this.baseUrl}/Settlement/DeleteSettlementBatch?id=` + id;
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

