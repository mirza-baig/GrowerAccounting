

export interface ISettlementNotePayment {
	id: number;
	settlementId: number;
	bankNoteId: number | null;
	originalPayment: number | null;
	adjustedPayment: number | null;
	status: string;
}


