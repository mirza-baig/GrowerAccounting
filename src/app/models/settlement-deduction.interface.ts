

export interface ISettlementDeduction {
	id: number;
	growerId: number;
	growerAccountId: number;
	accountType: string;
	settlementId: number | null;
	originalDeduction: number | null;
	adjustedDeduction: number | null;
	originalInterest: number | null;
	adjustedInterest: number | null;
	status: string;
}


