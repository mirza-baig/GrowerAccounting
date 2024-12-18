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
import { IGrowerAccount } from 'src/app/models/grower-account.interface';
import { IApiResponse } from 'src/app/models/api-response.interface';
import { IGrowerAccountPost } from 'src/app/models/grower-account-post.interface';


@Injectable()
export class EditAccountService {
  /** Base URL for the Grower API. */
  private baseUrl = environment.apiUrl;

  constructor(
    private http: Http,
    private _authUtil: AuthorizationUtilities
  ) {}

  /** Get the account by the id */
  getAccountById(id: number): Observable<IGrowerAccountPost> {
    const url = `${this.baseUrl}/Grower/GetGrowerAccount?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        const resp = response.json();
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        return <IGrowerAccount>resp;
      })
      .catch(this.handleError);
  }

  /** post an grower account */
  postGrowerAccount(account: IGrowerAccountPost): Observable<IApiResponse> {
    const url = `${this.baseUrl}/Grower/PostGrowerAccount/`;
    const options = this._authUtil.getWildcardHeaderOptions();
    return this.http
      .post(url, account, options)
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

