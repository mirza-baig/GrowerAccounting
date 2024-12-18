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
import { ITransactionVM } from 'src/app/models/transaction-vm.interface';
import { IGrowerTransactionVM } from 'src/app/models/grower-transaction-vm.interface';
import { ISettlementNotePayment } from 'src/app/models/settlement-note-payment.interface';
import { ISettlementDeduction } from 'src/app/models/settlement-deduction.interface';
import { ISettlementTransfer } from 'src/app/models/settlement-transfer.interface';
import { ISettlement } from 'src/app/models/settlement.interface';
import { IApiResponse } from 'src/app/models/api-response.interface';


@Injectable()
export class SettlementInfoDetailPanelService {
  /** Base URL for the Grower API. */
  private baseUrl = environment.apiUrl;

  constructor(
    private http: Http,
    private _authUtil: AuthorizationUtilities
  ) {}

  /** Get the bank note payments for a settlement*/
  getSettlementBankNotes(id: number): Observable<ISettlementNotePayment[]> {
    // todo - this says grower id, but is actual transaction id
    const url = `${this.baseUrl}/Settlement/GetSettlementNotePayments?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        // const resp = JSON.parse(response);
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        return <ISettlementNotePayment[]>response.json();
      })
      .catch(this.handleError);
  }

  /** get the list of transfers for a settlement */
  getSettlementTransfers(id: number, type: string): Observable<ISettlementTransfer[]> {
    // todo - this says grower id, but is actual transaction id
    const url = `${this.baseUrl}/Settlement/GetSettlementTransfers?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url + '&Type=' + type, options)
      .map(response => {
        const fromResults = <ISettlementTransfer[]>response.json();

        // const resp = JSON.parse(response);
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        return fromResults;
      })
      .catch(this.handleError);
  }


  /** get the list of deductions for a settlement */
  getSettlementDeductions(id: number): Observable<ISettlementDeduction[]> {
    // todo - this says grower id, but is actual transaction id
    const url = `${this.baseUrl}/Settlement/GetSettlementDeductions?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        // const resp = JSON.parse(response);
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        return <ISettlementDeduction[]>response.json();
      })
      .catch(this.handleError);
  }

  /** get settlements for a group code */
  getSettlementsByGroupCode(groupCode: string): Observable<ISettlement[]> {
    const url = `${this.baseUrl}/Settlement/GetSettlementsByGroupCode?id=` + groupCode;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url,  options)
      .map(response => {
        const resp = response.json();

        return <ISettlement[]>resp;
      })
      .catch(this.handleError);
  }

  /*
  PostSettlementTransfer
  PostSettlementNotePayment
  PostSettlementDeduction
  */

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

  /** post an individual settlement note payment */
  postSettlementNotePayments(note: ISettlementNotePayment[]): Observable<IApiResponse> {
    const url = `${this.baseUrl}/Settlement/PostSettlementNotePayments/`;
    const options = this._authUtil.getWildcardHeaderOptions();
    return this.http
      .post(url, note, options)
      .map(response => {
        const resp = response.json();

        if (resp.statusCode !== 200) {
          throw new Error(resp.error);
        }
        return <IApiResponse>resp;
      })
      .catch(this.handleError);
  }

  /** post an individual settlement deduction */
  postSettlementDeductions(deduction: ISettlementDeduction[]): Observable<IApiResponse> {
    const url = `${this.baseUrl}/Settlement/PostSettlementDeduction/`;
    const options = this._authUtil.getWildcardHeaderOptions();
    return this.http
      .post(url, deduction, options)
      .map(response => {
        const resp = response.json();

        if (resp.statusCode !== 200) {
          throw new Error(resp.error);
        }
        return <IApiResponse>resp;
      })
      .catch(this.handleError);
  }



  /** delete a matching settlement transfer */
  deleteSettlementTransfer(id: number): Observable<any> {
    const url = `${this.baseUrl}/Settlement/DeleteSettlementTransfer?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .delete(url, options)
      .map(response => {

        const resp = response.json();
        return <any>resp;
      })
      .catch(this.handleError);
  }

  /** delete a matching settlement deduction */
  deleteSettlementDeduction(id: number): Observable<any> {
    const url = `${this.baseUrl}/Settlement/DeleteSettlementDeduction?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .delete(url, options)
      .map(response => {

        const resp = response.json();
        return <any>resp;
      })
      .catch(this.handleError);
  }

  /** delete a matching settlement note payment */
  deleteSettlementNotePayment(id: number): Observable<any> {
    const url = `${this.baseUrl}/Settlement/DeleteSettlementNotePayment?id=` + id;
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

