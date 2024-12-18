import { IGrowerMaster } from './grower-master.interface';
import { IGrowerAccount } from './grower-account.interface';
import { IGrowerBankNote } from './grower-bank-note.interface';
import { ISettlementNotePaymentVM } from './settlement-note-payment-vm.interface';

export interface ICreditInquiryVM {
    growerMaster: IGrowerMaster;
    currentAge: number;
    birdsPlaced: number;
    numberofHousesPlaced: number;
    uniquePaySchedule: string;
    sixFlockSettlementAverage: number;
    numberOfSettlementsAveraged: number;
    combinedDebt: number;
    availableCredit: number;
    growerAccounts: IGrowerAccount[];
    settlementNotePaymentVMs: ISettlementNotePaymentVM[];
}
