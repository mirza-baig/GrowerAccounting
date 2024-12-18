import { IRole } from './role.interface';

export interface IApplication {
    applicationName: string;
    roleList: IRole[];
}
