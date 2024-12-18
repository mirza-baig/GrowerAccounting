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
import { AuthorizationUtilities } from '../shared/auth-utilities';
import { ISettlementDatesVM } from './settlement-dates-vm.interface';



@Injectable()
export class WeekEndingDatePickerService {
  /** Base URL for the Grower API. */
  private baseUrl = environment.apiUrl;

  constructor(
    private http: Http,
    private _authUtil: AuthorizationUtilities,
  ) {}

  /** gets the list of unique settlement dates (with status) for imports */
  getSettlementDatesWithStatus(): Observable<ISettlementDatesVM[]> {
    const url = `${this.baseUrl}/Settlement/GetSettlementDatesWithStatus/`;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        const resp = response.json();
        return <ISettlementDatesVM[]>resp;
      })
      .catch(this.handleError);
  }

  private handleError(error: Response): Observable<any> {
    const msg = error.toString();
    return _throw(msg);
  }

}

