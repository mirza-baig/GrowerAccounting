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


@Injectable()
export class ViewGrowerMasterService {
  /** Base URL for the Grower API. */
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private _authUtil: AuthorizationUtilities
  ) {}

  /** Get the account by the id */
  getAccountById(id: number): Observable<IAccountVM> {
    const url = `${this.baseUrl}/Grower/getGrowerById/` + id;
    const options = this._authUtil.getHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        const resp = JSON.parse(response);
        if (resp.statusCode !== 200) {
          throw new Error(resp.error);
        }
        return <IAccountVM>resp.data;
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

