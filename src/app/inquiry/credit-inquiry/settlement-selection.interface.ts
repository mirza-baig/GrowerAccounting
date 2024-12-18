import { ISettlement } from "src/app/models/settlement.interface";

export interface ISettlementSelection {
    isSelected: boolean;
    settlement: ISettlement;
}
