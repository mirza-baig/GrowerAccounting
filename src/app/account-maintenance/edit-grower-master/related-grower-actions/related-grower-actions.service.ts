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
import { HttpClient, HttpParams } from '@angular/common/http';
import { _throw } from 'rxjs/observable/throw';
import { IAccountVM } from 'src/app/models/account-vm.interface';
import { IGrowerAccount } from 'src/app/models/grower-account.interface';
import { IGrowerMaster } from 'src/app/models/grower-master.interface';
import { IApiResponse } from 'src/app/models/api-response.interface';
import { IRelatedGrower } from 'src/app/models/related-grower.interface';


@Injectable()
export class RelatedGrowerActionsService {
  /** Base URL for the Grower API. */
  private baseUrl = environment.apiUrl;

  constructor(
    private http: Http,
    private httpClient: HttpClient,
    private _authUtil: AuthorizationUtilities
  ) {}

  /** Get the set of sub accounts for a grower by the GrowerId */
  getGrowerSubAccounts(growerId: number): Observable<IGrowerAccount[]> {
    const url = `${this.baseUrl}/Grower/GetGrowerAccounts/` + growerId;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        const resp = response.json();
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        // return <IAccountVM>resp.data;
        return <IGrowerAccount[]>resp;
      })
      .catch(this.handleError);
  }

  // CLEANUP: remove dead method
    /** delete a related grower */
  /*deleteGrowerRelation(related: IRelatedGrower): Observable<any> {
    const url = `${this.baseUrl}/Grower/DeleteGrowerRelation?id=` + related.id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .delete(url, options)
      .map(response => {

        const resp = response.json();
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        return <any>resp;
      })
      .catch(this.handleError);
    // this.http.delete()
    // return this.http
    //   .delete(url, related, options)
    //   .map(response => {
    //     const resp = response.json();
    //     if (resp.statusCode !== 200) {
    //       throw new Error(resp.error);
    //     }
    //     return <IApiResponse>resp;
    //   })
    //   .catch(this.handleError);
  }*/

  /** delete and revert a grower relation */
  removeGrowerRelation(grower: IGrowerMaster): Observable<IApiResponse> {
    const url = `${this.baseUrl}/Grower/RemoveGrowerRelation/`;
    const options = this._authUtil.getWildcardHeaderOptions();
    return this.http
      .post(url, grower, options)
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

