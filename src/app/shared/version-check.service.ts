import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DialogService, DialogRef } from '@progress/kendo-angular-dialog';
import { AuthorizationUtilities } from './auth-utilities';

@Injectable()
export class VersionCheckService {
  // this will be replaced by actual hash post-build.js
  private currentHash = '{{POST_BUILD_ENTERS_HASH_HERE}}';

  constructor(
    private http: HttpClient,
    private dialogService: DialogService,
    private _authUtil: AuthorizationUtilities
  ) {}

  /**
   * Checks in every set frequency the version of frontend application
   * @param url
   * @param {number} frequency - in milliseconds, defaults to 30 minutes
   */
  public initVersionCheck(url, frequency = 1000 * 60 * 30) {
    this.checkVersion(url);
    setInterval(() => {
      this.checkVersion(url);
    }, frequency);
  }

  /**
   * Will do the call and check if the hash has changed or not
   * @param url
   */
  private checkVersion(url) {
    if (!environment.production) {
      // this.reloadPage(); // ? for testing purposes, shows the dialog in dev mode
      return;
    }
    const options = this._authUtil.getHeaderOptions();
    // timestamp these requests to invalidate caches
    this.http
      // .get('http://sql_test:10211/version.json')
      .get(url + '?t=' + new Date().getTime(), options)
      // .first()
      .subscribe(
        (response: any) => {
          const resp = JSON.parse(response);
          const hash = resp.hash;
          const hashChanged = this.hasHashChanged(this.currentHash, hash);
          // If new version, do something
          if (hashChanged) {
            // ENTER YOUR CODE TO DO SOMETHING UPON VERSION CHANGE
            this.reloadPage();
          } else {
            // CLEANUP: was logging the message 'Hash is valid, will check again in 30 minutes.' Do we need to do something here?
          }
          // store the new hash so we wouldn't trigger versionChange again
          // only necessary in case you did not force refresh
          this.currentHash = hash;
        },
        err => {
          console.error(err, 'Could not get version');
        }
      );
  }

  /**
   * Checks if hash has changed.
   * This file has the JS hash, if it is a different one than in the version.json
   * we are dealing with version change
   * @param currentHash
   * @param newHash
   * @returns {boolean}
   */
  private hasHashChanged(currentHash, newHash) {
    if (!currentHash || currentHash === '{{POST_BUILD_ENTERS_HASH_HERE}}') {
      return false;
    }

    return currentHash !== newHash;
  }

  /**
   * Forces a page reload
   */
  private reloadPage() {
    // const dialog: DialogRef = this.dialogService.open({
    //   title: 'Version Out of Date',
    //   content:
    //     'There is a newer version of CapX than the one you are currently using. The page must now reload to ensure you have the latest, most stable version possible.',
    //   actions: [{ text: 'Reload', primary: true }],
    //   width: 450,
    //   height: 300
    // });
    // dialog.result.subscribe(result => {
    location.reload(true);
    // });
  }
}
