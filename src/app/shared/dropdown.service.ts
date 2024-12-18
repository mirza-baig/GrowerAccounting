import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { environment } from '../../environments/environment';
import { AuthorizationUtilities } from './auth-utilities';
import { HttpClient } from '@angular/common/http';
import { _throw } from 'rxjs/observable/throw';
import { IAccountVM } from 'src/app/models/account-vm.interface';
import { IDropdownListItem } from '../models/dropdown-list-item.interface';

import { ITransactionType } from '../models/transaction-type.interface';
import { IAccountType } from '../models/account-type.interface';
import { of } from 'rxjs';
import { IGLAccountMaster } from '../models/gl-account-master.interface';
import { IVwApvendorMaster } from '../models/vw-apvendor-master.interface';


@Injectable()
export class DropdownService {
  /** Base URL for the Grower API. */
  private baseUrl = environment.apiUrl;

  constructor(
    private http: Http,
    private _authUtil: AuthorizationUtilities
  ) {}

  /** Get the transaction type list */
  getTransactionTypes(): Observable<ITransactionType[]> {
    const url = `${this.baseUrl}/Utility/GetGrowerTransactionTypes/`;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        const resp = response.json();
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        return <ITransactionType[]>resp;
      })
      .catch(this.handleError);
  }

  getAccountTypes(): Observable<IAccountType[]> {
    const url = `${this.baseUrl}/Utility/GetGrowerAccountTypes/`;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        const resp = <IAccountType[]>response.json();
        const mappedResult = resp.map(at => {
          at.accountCode = at.accountCode.trim();
          at.accountType = at.accountType.trim();
          return at;
        });
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        return <IAccountType[]>resp;
      })
      .catch(this.handleError);
  }

  getGLAccounts(): Observable<IGLAccountMaster[]> {
    const url = `${this.baseUrl}/Utility/GetGLAccounts/`;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        const resp = response.json();
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        return <IGLAccountMaster[]>resp;
      })
      .catch(this.handleError);
  }

  getVendorMasterById(id: number): Observable<IVwApvendorMaster> {
    const url = `${this.baseUrl}/Utility/GetVendorMasterById?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        const resp = response.json();
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        return <IVwApvendorMaster>resp;
      })
      .catch(this.handleError);
  }

  getAPVendors(): Observable<IVwApvendorMaster[]> {
    const url = `${this.baseUrl}/Utility/GetAPVendors/`;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        const resp = response.json();
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        return <IVwApvendorMaster[]>resp;
      })
      .catch(this.handleError);
  }

  /*
1	Broilers
2	Breeders
3	Misc
4	Corporate
  */

  /** return a hardcoded list of farm types  */
  getFarmTypes(): Observable<IDropdownListItem[]> {

    // todo - eventually return by the api, or not?
    const list = [];
    list.push({ Value: '1', Text: 'Broilers'} as IDropdownListItem);
    list.push({ Value: '2', Text: 'Breeders'} as IDropdownListItem);
    list.push({ Value: '3', Text: 'Misc'} as IDropdownListItem);
    list.push({ Value: '4', Text: 'Corporate'} as IDropdownListItem);
    
    return of(list);
  }


  /** return a hardcoded list of companies  */
  getCompanies(): Observable<IDropdownListItem[]> {

    // todo - eventually return by the api, or not?
    const list = [];
    list.push({ Value: '1', Text: 'FIELDALE FARMS CORPORATION'} as IDropdownListItem);
    // list.push({ Value: '2', Text: 'BEST TRUCKING INC'} as IDropdownListItem);
    list.push({ Value: '4', Text: 'FIELDALE FARMS POULTRY, LLC'} as IDropdownListItem);
    // list.push({ Value: '6', Text: 'BEST AVIATION'} as IDropdownListItem);
    return of(list);
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

