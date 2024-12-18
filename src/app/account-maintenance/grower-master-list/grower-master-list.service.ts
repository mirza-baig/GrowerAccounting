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
import { IGrowerMaster } from 'src/app/models/grower-master.interface';


@Injectable()
export class GrowerMasterListService {
  /** Base URL for the Grower API. */
  private baseUrl = environment.apiUrl;

  constructor(
    private http: Http,
    private _authUtil: AuthorizationUtilities
  ) {}

  /** get the list of all grower masters*/
  getGrowers(getAll: boolean): Observable<IGrowerMaster[]> {
    const url = `${this.baseUrl}/Grower/GetGrowers?getAll=` + getAll;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {

        const resp = response.json();
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        // return <IAccountVM>resp.data;
        return <IGrowerMaster[]>resp;
      })
      .catch(this.handleError);
  }

  /** get growers in a settlement batch for lookups */
  getGrowersForSettlementBatch(id: number): Observable<IGrowerMaster[]> {
    const url = `${this.baseUrl}/Settlement/GetGrowersInSettlementBatch?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {

        const resp = response.json();
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        // return <IAccountVM>resp.data;
        return <IGrowerMaster[]>resp;
      })
      .catch(this.handleError);
  }

  getGrowersForDate(getAll: boolean): Observable<IGrowerMaster[]> {
    const url = `${this.baseUrl}/Grower/GetGrowers?getAll=` + getAll;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {

        const resp = response.json();
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        // return <IAccountVM>resp.data;
        return <IGrowerMaster[]>resp;
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

