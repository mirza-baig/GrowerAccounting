import { IEmailAddress } from './email-address.interface';
import { IApplication } from './application.interface';
import { ILocation } from './location.interface';

export interface IUserDetail {
    loginId: number;
    username: string;
    firstName: string;
    lastName: string;
    displayName: string;
    employeeNumber: number;
    emailAddressList: IEmailAddress[];
    noteList: any[]; // todo - create user note interface
    applicationList: IApplication[];
    locationList: ILocation[];
}
