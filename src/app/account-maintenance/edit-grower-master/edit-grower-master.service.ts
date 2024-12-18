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
import { IGrowerMaster } from 'src/app/models/grower-master.interface';
import { IApiResponse } from 'src/app/models/api-response.interface';
import { IRelatedGrower } from 'src/app/models/related-grower.interface';
import { IGrowerAccountPost } from 'src/app/models/grower-account-post.interface';


@Injectable()
export class EditGrowerMasterService {
  /** Base URL for the Grower API. */
  private baseUrl = environment.apiUrl;

  constructor(
    private http: Http,
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

  /** get an individual grower sub account */
  getSubAccount(id: number): Observable<IGrowerAccount> {
    const url = `${this.baseUrl}/Grower/GetGrowerAccount/` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        const resp = response.json();
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        // return <IAccountVM>resp.data;
        return <IGrowerAccount>resp;
      })
      .catch(this.handleError);
  }

  /** get an individual grower sub account */
  getGrowerMaster(id: number): Observable<IGrowerMaster> {
    const url = `${this.baseUrl}/Grower/GetGrowerById?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {

        const resp = response.json();
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        // return <IAccountVM>resp.data;
        return <IGrowerAccount>resp;
      })
      .catch(this.handleError);
  }

  /** get the related growers for a grower (non vendor ones) */
  getRelatedGrowers(growerId: number): Observable<IRelatedGrower[]> {
    const url = `${this.baseUrl}/Grower/GetGrowerRelationsByGrowerId?id=` + growerId;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {

        const resp = response.json();
        // CLEANUP: remove after testing
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        // return <IAccountVM>resp.data;
        return <IRelatedGrower[]>resp;
      })
      .catch(this.handleError);
  }

  /** Get the matching growers by the group code (usually a vendor id) */
  getGrowerRelationsByGroupCode(id: string): Observable<IGrowerMaster[]> {
    const url = `${this.baseUrl}/Grower/GetGrowerRelationsByGroupCode?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {

        const resp = response.json();
        return <IGrowerMaster[]>resp;
      })
      .catch(this.handleError);
  }

  /** post a new related grower */
  postGrowerRelation(baseGrowerId: number, relatedGrowerId: number): Observable<IApiResponse> {
    const url = `${this.baseUrl}/Grower/PostGrowerRelation/?baseGrowerId=` + baseGrowerId + `&relatedGrowerId=` + relatedGrowerId;
    const options = this._authUtil.getWildcardHeaderOptions();
    return this.http
      .post(url, { baseGrowerId, relatedGrowerId }, options)
      .map(response => {
        const resp = response.json();
        if (resp.statusCode !== 200) {
          throw new Error(resp.error);
        }
        return <IApiResponse>resp;
      })
      .catch(this.handleError);
  }

  // CLEANUP: unused method?? Remove after testing
  /** get the related vendor growers for a grower  */
  /*getRelatedVendorGrowers(vendorId: number): Observable<IGrowerMaster[]> {
    const url = `${this.baseUrl}/Grower/GetGrowersByVendorId?id=` + vendorId;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {

        const resp = response.json();
        console.log(resp);
        return <IGrowerMaster[]>resp;
      })
      .catch(this.handleError);
  }*/


  // CLEANUP: unused method?? Remove after testing
  /** post an individual grower's sub account */
  /*postGrowerSubAccount(account: IGrowerAccountPost): Observable<IApiResponse> {
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
  }*/

  /** post an grower master */
  postGrowerMaster(grower: IGrowerMaster): Observable<IApiResponse> {
    const url = `${this.baseUrl}/Grower/PostGrowerMaster/`;
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

  /** add a new related grower */
  postRelatedGrower(related: IRelatedGrower): Observable<IApiResponse> {
    const url = `${this.baseUrl}/Grower/PostGrowerRelation/`;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .post(url, related, options)
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

