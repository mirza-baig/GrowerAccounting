import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { RequestOptions, Headers } from '@angular/http';

@Injectable()
/** Class for helpers with authorization and service calls */
export class AuthorizationUtilities {
  constructor() {}

  /** Returns the header options needed for authorized requests  */
  public getHeaderOptions() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    //  'Access-Control-Allow-Origin': 'http://localhost:4200',
      withCredentials: 'true'
    });
    const params = new HttpParams();
    const options: {
      headers?: HttpHeaders;
      observe?: 'body';
      params?: HttpParams;
      reportProgress?: boolean;
      responseType: 'text';
      withCredentials?: boolean;
    } = {
      headers: headers,
      params: params,
      responseType: 'text',
      withCredentials: true
    };
    return options;
  }

  /** version for making .NET Core api requests */
  public getCoreHeaderOptions() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      withCredentials: 'true'
    });
    const params = new HttpParams();
    const options: {
      headers?: HttpHeaders;
      observe?: 'body';
      params?: HttpParams;
      reportProgress?: boolean;
      responseType: 'text';
      withCredentials?: boolean;
    } = {
      headers: headers,
      params: params,
      responseType: 'text',
      withCredentials: true
    };
    return options;
  }

  /** Returns the header options needed for authorized requests to the anonymous api */
  public getAnonymousHeaderOptions() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Access-Control-Allow-Origin': 'http://localhost:4200',
      withCredentials: 'false'
    });
    const params = new HttpParams();
    const options: {
      headers?: HttpHeaders;
      observe?: 'body';
      params?: HttpParams;
      reportProgress?: boolean;
      responseType: 'text';
      withCredentials?: boolean;
    } = {
      headers: headers,
      params: params,
      responseType: 'text',
      withCredentials: false
    };
    return options;
  }

  /** Returns header options when the API is configured for simple wildcard allow */
  public getWildcardHeaderOptions() {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return options;
  }
}
