import { IApgldistributionAccounts } from './apgldistribution-accounts.interface';
import { IApinvoice } from './apinvoice.interface';
import { IApvoucher } from './apvoucher.interface';
import { IApvoucherDistribution } from './apvoucher-distribution.interface';
import { IGrowerAccount } from './grower-account.interface';
import { IGrowerAccountType } from './grower-account-type.interface';
import { IGrowerBankNote } from './grower-bank-note.interface';
import { IGrowerMaster } from './grower-master.interface';
import { IGrowerTransaction } from './grower-transaction.interface';
import { IGrowerTransactionBatch } from './grower-transaction-batch.interface';
import { IGrowerTransactionType } from './grower-transaction-type.interface';
import { ISettlement } from './settlement.interface';
import { ISettlementBatch } from './settlement-batch.interface';
import { ISettlementDeduction } from './settlement-deduction.interface';
import { ISettlementNotePayment } from './settlement-note-payment.interface';
import { ISettlementTransfer } from './settlement-transfer.interface';
import { IVwApvendorMaster } from './vw-apvendor-master.interface';
import { IVwGlaccountMaster } from './vw-glaccount-master.interface';
import { IVwLastSettlementDate } from './vw-last-settlement-date.interface';
import { IVwRelatedGrowers } from './vw-related-growers.interface';
import { IVwTimeDim } from './vw-time-dim.interface';


export interface IGrowerAccountingContext {
	apgldistributionAccounts: IApgldistributionAccounts; // class {{ApgldistributionAccounts}};
	apinvoice: IApinvoice; // class {{Apinvoice}};
	apvoucher: IApvoucher; // class {{Apvoucher}};
	apvoucherDistribution: IApvoucherDistribution; // class {{ApvoucherDistribution}};
	growerAccount: IGrowerAccount; // class {{GrowerAccount}};
	growerAccountType: IGrowerAccountType; // class {{GrowerAccountType}};
	growerBankNote: IGrowerBankNote; // class {{GrowerBankNote}};
	growerMaster: IGrowerMaster; // class {{GrowerMaster}};
	growerTransaction: IGrowerTransaction; // class {{GrowerTransaction}};
	growerTransactionBatch: IGrowerTransactionBatch; // class {{GrowerTransactionBatch}};
	growerTransactionType: IGrowerTransactionType; // class {{GrowerTransactionType}};
	settlement: ISettlement; // class {{Settlement}};
	settlementBatch: ISettlementBatch; // class {{SettlementBatch}};
	settlementDeduction: ISettlementDeduction; // class {{SettlementDeduction}};
	settlementNotePayment: ISettlementNotePayment; // class {{SettlementNotePayment}};
	settlementTransfer: ISettlementTransfer; // class {{SettlementTransfer}};
	vwApvendorMaster: IVwApvendorMaster; // class {{VwApvendorMaster}};
	vwGlaccountMaster: IVwGlaccountMaster; // class {{VwGlaccountMaster}};
	vwLastSettlementDate: IVwLastSettlementDate; // class {{VwLastSettlementDate}};
	vwRelatedGrowers: IVwRelatedGrowers; // class {{VwRelatedGrowers}};
	vwTimeDim: IVwTimeDim; // class {{VwTimeDim}};
}


