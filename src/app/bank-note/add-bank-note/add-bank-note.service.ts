// getGrowerById


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
import { IGrowerVM } from '../../models/grower-vm.interface';
import { IGrowerBankNote } from 'src/app/models/grower-bank-note.interface';
import { IApiResponse } from 'src/app/models/api-response.interface';

@Injectable()
export class AddBankNoteService {
  /** Base URL for the Grower API. */
  private baseUrl = environment.apiUrl;

  constructor(
    private http: Http,
    private _authUtil: AuthorizationUtilities
  ) {}

  /** Get an individual bank note by id */
  getBankNoteById(id: number): Observable<IGrowerBankNote> {
    const url = `${this.baseUrl}/BankNote/GetBankNoteById?id=` + id;
    const options = this._authUtil.getWildcardHeaderOptions();

    return this.http
      .get(url, options)
      .map(response => {
        // const resp = JSON.parse(response);
        // if (resp.statusCode !== 200) {
        //   throw new Error(resp.error);
        // }
        return <IGrowerBankNote>response.json();
      })
      .catch(this.handleError);
  }

  /** post a grower bank note */
  postBankNote(note: IGrowerBankNote): Observable<IApiResponse> {
    const url = `${this.baseUrl}/BankNote/PostBankNote/`;
    const options = this._authUtil.getWildcardHeaderOptions();

    
    return this.http
      .post(url, note, options)
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

