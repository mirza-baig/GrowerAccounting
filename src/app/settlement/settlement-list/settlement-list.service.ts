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
import { ISettlement } from 'src/app/models/settlement.interface';
import { IApiResponse } from 'src/app/models/api-response.interface';
import { ISettlementTransfer } from 'src/app/models/settlement-transfer.interface';
import { ISettlementWithCounts } from 'src/app/models/settlement-with-counts.interface';


@Injectable()
export class SettlementListService {
  /** Base URL for the Grower API. */
  private baseUrl = environment.apiUrl;

  constructor(
    private http: Http,
    private _authUtil: AuthorizationUtilities
  ) {}

  /** Get a settlement by its id */
  getSettlementById(id: number): Observable<ISettlement> {
    const url = `${this.baseUrl}/Settlement/GetSettlementById?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        // const resp = JSON.parse(response);
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        return <ISettlement>response.json();
      })
      .catch(this.handleError);
  }

  /** Get a settlement list for a grower */
  getSettlementsByGrowerId(id: number): Observable<ISettlement[]> {
    const url = `${this.baseUrl}/Settlement/GetSettlementByGrowerId?id=` + id;
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

  /** init the process to import broiler settlements for a date */
  getSettlementsByBatchId(id: number): Observable<ISettlementWithCounts[]> {
    // GetSettlementBatchCalculations
    const url = `${this.baseUrl}/Settlement/GetSettlementsByBatchId?id=` + id;

    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url,  options)
      .map(response => {
        const resp = response.json();
        return <ISettlementWithCounts[]>resp;
      })
      .catch(this.handleError);
  }

  getSettlementCalculationsByBatchId(id: number): Observable<ISettlement[]> {
    // GetSettlementBatchCalculations
    const url = `${this.baseUrl}/Settlement/GetSettlementBatchCalculations?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url,  options)
      .map(response => {
        const resp = response.json();

        return <ISettlement[]>resp;
      })
      .catch(this.handleError);
  }

  /** post an individual settlement */
  postSettlement(settlement: ISettlement): Observable<IApiResponse> {
    const url = `${this.baseUrl}/Settlement/PostSettlement/`;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .post(url, settlement, options)
      .map(response => {
        const resp = response.json();

        if (resp.statusCode !== 200) {
          throw new Error(resp.error);
        }
        return <IApiResponse>resp;
      })
      .catch(this.handleError);
  }

  /** post an individual settlement transfer */
  postSettlementTransfers(transfer: ISettlementTransfer[]): Observable<IApiResponse> {
    const url = `${this.baseUrl}/Settlement/PostSettlementTransfers/`;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .post(url, transfer, options)
      .map(response => {
        const resp = response.json();

        if (resp.statusCode !== 200) {
          throw new Error(resp.error);
        }
        return <IApiResponse>resp;
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

