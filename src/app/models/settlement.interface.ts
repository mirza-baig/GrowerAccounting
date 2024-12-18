

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
	transferSelect: boolean;
}


