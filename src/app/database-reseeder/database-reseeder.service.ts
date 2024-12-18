import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { environment } from '../../environments/environment';
import { AuthorizationUtilities } from '../shared/auth-utilities';
import { HttpClient } from '@angular/common/http';
import { _throw } from 'rxjs/observable/throw';
import { IAccountVM } from 'src/app/models/account-vm.interface';
import { IApiResponse } from 'src/app/models/api-response.interface';
import { IResetTables } from './reset-tables.interface';


@Injectable()
export class DatabaseReseederService {
  /** Base URL for the Grower API. */
  private baseUrl = environment.apiUrl;

  constructor(
    private http: Http,
    private _authUtil: AuthorizationUtilities
  ) {}

  /** reset our tables */
  resetDataTables(): Observable<IApiResponse> {
    const url = `${this.baseUrl}/Utility/DeleteSettlementData?deleteCommand=DELETE`;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        const resp = response.json();
        if (resp.statusCode !== 200) {
          throw new Error(resp.error);
        }
        return <IApiResponse>resp;
      })
      .catch(this.handleError);
  }

  /** manually updates the grower master list (and bank notes and accounts?) */
  resetGrowerData(): Observable<IApiResponse> {
    const url = `${this.baseUrl}/Utility/ResetGrowerData?resetCommand=RESET`;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        const resp = response.json();
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

