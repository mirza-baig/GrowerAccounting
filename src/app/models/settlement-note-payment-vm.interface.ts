import { IGrowerBankNote } from './grower-bank-note.interface';

export interface ISettlementNotePaymentVM {
        id: number;
        settlementId: number;
        settlementDate: Date | string | null;
        bankNoteId: number | null;
        originalPayment: number | null;
        adjustedPayment: number | null;
        status: string;
        growerBankNote: IGrowerBankNote;
}


/*


export interface IGrowerBankNote {
	id: number;
	growerId: number | null;
	noteType: string;
	noteVendorNumber: number | null;
	noteLoanNumber: string;
	notePaymentAmount: number | null;
	notePaymentCentsDoz: number | null;
	notePaymentActual: number | null;
	noteLastPaymentAmount: number | null;
	noteNetProceeds: string;
}
private loadNetProceedsList() {
    this.netProceedsList.push({
      Value: '',
      Text: 'N/A'
    } as IDropdownListItem);
    this.netProceedsList.push({
      Value: 'N',
      Text: 'Net Proceeds'
    } as IDropdownListItem);
    this.netProceedsList.push({
      Value: 'G',
      Text: 'Gross Proceeds'
    } as IDropdownListItem);
    this.dropdownsLoaded = true;
  }



*/