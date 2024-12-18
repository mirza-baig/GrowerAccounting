import { IAccountType } from 'src/app/models/account-type.interface';

export class BatchTotal {
    constructor(
        public accountType: IAccountType,
        public total: number,
    ) {

    }
}
