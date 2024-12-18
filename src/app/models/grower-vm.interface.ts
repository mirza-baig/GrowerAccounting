import { IAccountVM } from './account-vm.interface';

export interface IGrowerVM {
    Id: number;
    FarmType: string;
    FarmName: string;
    FarmAddress1: string;
    FarmAddress2: string;
    Phone: string;
    CellPhone: string;
    Email: string;

    AccountList: IAccountVM[];
}


