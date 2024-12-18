

export interface IGrowerAccountPost {
	id: number;
	growerId: number;
	accountType: number;
	accountSuffix: string;
	dateOpened: Date | string | null;
	deductChargeInterestFromDate: Date | string | null;
	interestRate: number | null;
	noFlocksToPay: number | null;
	remainingFlocksToPay: number | null;
	balanceGoalStartDeduction: number | null;
	beginYearBalance: number | null;
	balanceForward: number | null;
	currentCharges: number | null;
	lastChargeDate: Date | string | null;
	currentCredits: number | null;
	lastCreditDate: Date | string | null;
	cashAdvances: number | null;
	amountDue: number | null;
	ytdinterestCharged: number | null;
	ytdinterestPaid: number | null;
	accountComment: string;
}


