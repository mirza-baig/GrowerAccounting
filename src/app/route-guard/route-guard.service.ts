import { environment } from '../../environments/environment.test';
import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { IAccessControlUser } from '../user-management/access-control-user.interface';
import { IAccessControlRole } from '../user-management/access-control-role.interface';
@Injectable()
export class RouteGuardService {
  userLogin = true;
  currentUserLoaded = false;
  currentUser: IAccessControlUser;
  userRoles: IAccessControlRole[];

  constructor(private router: Router) {
    // save the user info
    this.currentUser = JSON.parse(
      localStorage.getItem('CurrentUserWithRoles')
    ) as IAccessControlUser;
    this.userRoles = JSON.parse(
      localStorage.getItem('UserRoles')
    ) as IAccessControlRole[];
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const roles = route.data['role'] as string;
    if (roles === '') {
      return true;
    }

    const activate = this.checkRoles(roles);
    if (activate) {
      return activate;
    } else {
      // todo - add error page instead?
      // tslint:disable-next-line:max-line-length
      this.router.navigateByUrl('ErrorComponent?errorMessage=You%20are%20missing%20the%20needed%20permissions%20to%20view%20the%20requested%20page');
    }
  }

  /** Checks if a user has any of the roles from the list */
  public checkRoles(roles: string): boolean {
    return this.checkRolesHelper(roles);
  }

  /** helper for common code with role parsing */
  private checkRolesHelper(roles: string) {
    let flag = false;
    const roleList = roles.split(',');
    roleList.forEach(role => {
      if (flag === false) {
        flag = this.isUserInRole(role);
        if (flag === true) {
          return flag;
        }
      }
    });
    return flag;
  }

  /** check if a user is in a specific role */
  public isUserInRole(role: string) {

    if (environment.bypassUserManagement) {
      return true;
    }

    const match = this.userRoles.find(x => x.roleName === role);
    return match != null;
  }


}
