

export interface IGrowerDeductions {
	id: number;
	growerId: number;
	settlementId: number | null;
	originalDeduction: number | null;
	adjustedDeduction: number | null;
	originalInterest: number | null;
	adjustedInterest: number | null;
}


