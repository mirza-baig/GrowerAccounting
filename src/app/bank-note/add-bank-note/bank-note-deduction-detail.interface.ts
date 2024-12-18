import { IGrowerBankNote } from 'src/app/models/grower-bank-note.interface';
import { ISettlementNotePayment } from 'src/app/models/settlement-note-payment.interface';


export interface IBankNoteDeductionDetail {
    bankNote: IGrowerBankNote;
    vendorName: string;
    vendorNameOnly: string;
    notePayment: ISettlementNotePayment;
    rrnCounter: number;
    growerName: string;
    accountNo: string;
    settlementDate: Date | string | null;
}



