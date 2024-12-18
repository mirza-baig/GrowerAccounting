import { ISettlement } from 'src/app/models/settlement.interface';


export interface ISettlementCorrectionItem {
    settlement: ISettlement;
    growerName: string;
    vendorName: string;
}
