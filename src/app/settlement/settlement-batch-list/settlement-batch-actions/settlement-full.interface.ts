import { ICreditInquiryVM } from 'src/app/models/credit-inquiry-vm.interface';
// tslint:disable-next-line:max-line-length
import { IDeductionDetailRow } from '../../settlement-list/settlement-info-detail-panel/deduction-detail-row.interface';import { IBankNoteDeductionDetail } from "src/app/bank-note/add-bank-note/bank-note-deduction-detail.interface";import { ISettlementTransferItem } from "../../settlement-list/settlement-info-detail-panel/settlement-transfer-item.interface";
import { ISettlement } from 'src/app/models/settlement.interface';
import { ISettlementWithCounts } from 'src/app/models/settlement-with-counts.interface';



export interface ISettlementFull {
	settlement: ISettlementWithCounts;
    deductions: IDeductionDetailRow[];
    notePayments: IBankNoteDeductionDetail[];
    transfers: ISettlementTransferItem[];
    deductionsLoaded: boolean;
    notePaymentsLoaded: boolean;
    transfersLoaded: boolean;
    creditInquiry: ICreditInquiryVM;
}


