import { ISettlementTransfer } from 'src/app/models/settlement-transfer.interface';
import { ISettlement } from 'src/app/models/settlement.interface';
import { IGrowerMaster } from 'src/app/models/grower-master.interface';
import { ISettlementWithCounts } from 'src/app/models/settlement-with-counts.interface';

export interface ISettlementTransferItem {
    transferModel: ISettlementTransfer;
	fromSettlement: ISettlementWithCounts;
	fromGrower: IGrowerMaster;
	toSettlement: ISettlementWithCounts;
	toGrower: IGrowerMaster;
    type: string;
}

/*


export interface ISettlement {
	id: number;
	growerId: number;
	growerName: string;
	entity: string;
	settlementAmount: number | null;
	dozenEggs: number | null;
	netGrowerPayment: number | null;
	settlementDate: Date | string | null;
	statementDate: Date | string | null;
	status: string;
	message: string;
	groupCode: string;
	settlementBatchId: number | null;
}

export interface ISettlementTransfer {
	id: number;
	fromSettlementId: number | null;
	toSettlementId: number | null;
	transferAmount: number | null;
}




*/