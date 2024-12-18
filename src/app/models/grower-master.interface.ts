import {IGrowerAccount} from './grower-account.interface';
import {IGrowerBankNote} from './grower-bank-note.interface';
import {IGrowerBankNoteMaster} from './grower-bank-note-master.interface';


export interface IGrowerMaster {
  id: number;
  farmType: string | number;
  farmName: string;
  farmAddress1: string;
  farmAddress2: string;
  phone: string;
  cellPhone: string;
  email: string;
  ownerName: string;
  // new PCS data for display in farm information modal

  supervisor: string;
  numberOfHouses: string;
  houseSize: number | null;
  directions: Array<string>;
  mostRecentSaleDate: string;
  mostRecentPlaceDate: string;

  groupCode: string;
  initializeDate: Date | string | null;
  ytdinterestCharged: number | null;
  ytdinterestPaid: number | null;
  lastSettlementDate: Date | string | null;
  lastStatementDate: Date | string | null;
  lastSettlementAmount: number | null;
  lastNotePaymentAmount: number | null;
  numberOfSettlements: number | null;
  accumulatedSettlementAmount: number | null;
  vendorId: number | null;
  growerComment: string;
  growerAccount: IGrowerAccount[]; // class {{GrowerAccount}};
  growerBankNote: IGrowerBankNote[]; // class {{GrowerBankNote}};
  growerBankNoteMaster: IGrowerBankNoteMaster[]; // class {{GrowerBankNoteMaster}};
  glaccountNumber: number | null;
  status: string;
}


