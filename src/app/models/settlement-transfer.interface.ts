

export interface ISettlementTransfer {
	id: number;
	fromSettlementId: number | null;
	toSettlementId: number | null;
	transferAmount: number | null;
	status: string;
}


