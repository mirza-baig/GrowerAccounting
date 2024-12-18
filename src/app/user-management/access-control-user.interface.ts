import { IAccessControlRole } from './access-control-role.interface';

export interface IAccessControlUser {
    userLoginId: number;
    displayName: string;
    roleList: IAccessControlRole[];
}
