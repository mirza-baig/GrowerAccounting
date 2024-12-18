

export interface IGrowerSettlement {
	id: number;
	growerId: number;
	entity: string;
	settlementAmount: number | null;
	dozenEggs: number | null;
	netGrowerPayment: number | null;
	settlementDate: Date | string | null;
	statementDate: Date | string | null;
	status: string;
}


