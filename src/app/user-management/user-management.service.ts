import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


import { environment } from '../../environments/environment';
import { IActiveDirectoryUser } from './active-directory-user.interface';
import { IUserDetail } from './user-detail.interface';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { IAccessControlUser } from './access-control-user.interface';
import { ICurrentUser } from './current-user.interface';

@Injectable()
export class UserManagementService {
    /** Base URL for the User Management API. */
    private baseUrl = environment.userManagementApiUrl;
    private appId = environment.appId;

    headers = new HttpHeaders({
        'Content-Type': 'application/json',
        withCredentials: 'true'
      });
    params = new HttpParams();
    options: {
      headers?: HttpHeaders;
      observe?: 'body';
      params?: HttpParams;
      reportProgress?: boolean;
      responseType: 'text';
      withCredentials?: boolean;
    } = {
      headers: this.headers,
      params: this.params,
      responseType: 'text',
      withCredentials: true
    };

    constructor(private http: HttpClient) {}


    /** get the current AD user and store */
    getCurrentUser(): Observable<ICurrentUser> {
        const url = `${this.baseUrl}/UserDetails/CurrentUser`;
        // const headers = new Headers({ 'Content-Type': 'application/json' });
        // const options = new RequestOptions({ headers: headers });

        return this.http
            .get(url, this.options)
            .pipe(
                map(
                  (response: any) => <ICurrentUser>JSON.parse(response),
                  (error: Response) => this.handleError(error)
                )
              );
    }

    /** get the full list of active directory users that aren't in user management */
    getActiveDirectoryUsers(): Observable<ICurrentUser[]> {
      const url = `${this.baseUrl}/UserDetails/ActiveDirectoryUsers`;
      // const headers = new Headers({ 'Content-Type': 'application/json' });
      // const options = new RequestOptions({ headers: headers });

      return this.http
          .get(url, this.options)
          .pipe(
              map(
                (response: any) => <ICurrentUser[]>JSON.parse(response),
                (error: Response) => this.handleError(error)
              )
            );
    }

    /** get the full list of user management users */
    getUserManagementUsers(): Observable<ICurrentUser[]> {
      const url = `${this.baseUrl}/UserDetails/UserDetailList`;
      // const headers = new Headers({ 'Content-Type': 'application/json' });
      // const options = new RequestOptions({ headers: headers });

      return this.http
          .get(url, this.options)
          .pipe(
              map(
                (response: any) => <ICurrentUser[]>JSON.parse(response),
                (error: Response) => this.handleError(error)
              )
            );
    }

    /** Get the full user detail by username */
    getUserDetails(username: string): Observable<IUserDetail> {
        const url = `${this.baseUrl}/UserDetails/ByUsername/` + username;
        // const headers = new Headers({ 'Content-Type': 'application/json' });
        // const options = new RequestOptions({ headers: headers });

        return this.http
            .get(url, this.options)
            .pipe(
                map(
                  (response: any) => <IUserDetail>JSON.parse(response),
                  (error: Response) => this.handleError(error)
                )
              );
    }

    

    /** get the access control table rooted version of role assignments for a user */
    getRoleAssignments(username: string): Observable<IAccessControlUser> {
      const url = `${this.baseUrl}/AccessControl/ByApplicationUsername/` + this.appId + `/` + username;
        // const headers = new Headers({ 'Content-Type': 'application/json' });
        // const options = new RequestOptions({ headers: headers });

        return this.http
            .get(url, this.options)
            .pipe(
                map(
                  (response: any) => <IAccessControlUser>JSON.parse(response),
                  (error: Response) => this.handleError(error)
                )
              );
    }

    private handleError(error: Response): Observable<any> {
        console.error(error);
        return Observable.throw(error.json() || 'Server error');
    }

}
