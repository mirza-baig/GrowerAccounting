import {Injectable} from '@angular/core';
import {UserManagementService} from './user-management/user-management.service';
import {DropdownService} from './shared/dropdown.service';
import {ICurrentUser} from './user-management/current-user.interface';
import {IAccessControlUser} from './user-management/access-control-user.interface';
import {forkJoin} from 'rxjs';

@Injectable()
export class AppInitService {

  constructor(
    private _userManagementService: UserManagementService,
    private _dropdownService: DropdownService,
  ) {
  }

  private static clearAllStorage() {
    localStorage.clear();
    sessionStorage.clear();
  }

  private static saveUserAccountToLocalStorage(adUser: ICurrentUser) {
    adUser.username = adUser.username.toLocaleLowerCase().replace('fieldale\\', '');
    localStorage.setItem('ActiveDirectoryUser', JSON.stringify(adUser));
  }

  private static saveUserWithRolesToLocalStorage(user: IAccessControlUser) {
    localStorage.setItem('CurrentUserWithRoles', JSON.stringify(user));
    localStorage.setItem('UserRoles', JSON.stringify(user.roleList));
  }

  public async saveUserAndUserRolesToLocalStorage(adUser: ICurrentUser): Promise<void> {
    AppInitService.clearAllStorage();
    AppInitService.saveUserAccountToLocalStorage(adUser);
    const rolesResponse = await this._userManagementService.getRoleAssignments(adUser.username).toPromise();
    AppInitService.saveUserWithRolesToLocalStorage(rolesResponse);
  }


  // tslint:disable-next-line:naming-convention
  async Init() {
    try {
      const [userResponse, apVendorResponse] = await forkJoin(
        this._userManagementService.getCurrentUser(),
        this._dropdownService.getAPVendors()).toPromise();

      await this.saveUserAndUserRolesToLocalStorage(userResponse);
      localStorage.setItem('APVendorList', JSON.stringify(apVendorResponse));
      return;
    } catch (e) {
      console.error(e);
    }
  }
}
