import { IGrowerMaster } from './grower-master.interface';


export interface IGrowerBankNoteMaster {
	id: number;
	growerId: number;
	noteType: string;
	noteVendorNumber: number | null;
	noteLoanNumber: string;
	notePaymentAmount: number | null;
	notePaymentCentsDoz: number | null;
	notePaymentActual: number | null;
	noteLastPaymentAmount: number | null;
	notePrincipalAmount: number | null;
	totalNotePayments: number | null;
	remainingBalance: number | null;
	grower: IGrowerMaster; // class {{GrowerMaster}};
}


