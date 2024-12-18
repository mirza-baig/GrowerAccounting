

export interface IGrowerBankNote {
	id: number;
	growerId: number | null;
	noteType: string;
	noteVendorNumber: number | null;
	noteVendorName: string;
	noteLoanNumber: string;
	notePaymentAmount: number | null;
	notePaymentCentsDoz: number | null;
	notePaymentActual: number | null;
	noteLastPaymentAmount: number | null;
	noteNetProceeds: string;
}


