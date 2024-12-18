import { IGrowerAccount } from 'src/app/models/grower-account.interface';
import { ISettlementDeduction } from 'src/app/models/settlement-deduction.interface';

export interface IDeductionDetailRow {
    deduction: ISettlementDeduction;
    growerAccountName: string;
    order: number;
    growerAccount: IGrowerAccount;
}
