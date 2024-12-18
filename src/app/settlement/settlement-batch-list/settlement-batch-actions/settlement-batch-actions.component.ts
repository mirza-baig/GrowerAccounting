import { ICreditInquiryVM } from 'src/app/models/credit-inquiry-vm.interface';
import { CreditInquiryService } from './../../../inquiry/credit-inquiry/credit-inquiry.service';

import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ISettlementBatch } from 'src/app/models/settlement-batch.interface';
import { ISettlement } from 'src/app/models/settlement.interface';
import { ISettlementFull } from './settlement-full.interface';
import { SettlementListService } from '../../settlement-list/settlement-list.service';
import { AccountMaintenanceService } from 'src/app/account-maintenance/account-maintenance.service';
import { GrowerMasterListService } from 'src/app/account-maintenance/grower-master-list/grower-master-list.service';
import { DropdownService } from 'src/app/shared/dropdown.service';
import { BankNoteListService } from 'src/app/bank-note-list/bank-note-list.service';
import { SettlementInfoDetailPanelService } from '../../settlement-list/settlement-info-detail-panel/settlement-info-detail-panel.service';
import { IGrowerAccount } from 'src/app/models/grower-account.interface';
import { IGrowerMaster } from 'src/app/models/grower-master.interface';
import { IAccountType } from 'src/app/models/account-type.interface';
import { HttpClient } from '@angular/common/http';
import { IVwApvendorMaster } from 'src/app/models/vw-apvendor-master.interface';
import { IBankNoteDeductionDetail } from 'src/app/bank-note/add-bank-note/bank-note-deduction-detail.interface';
import { ISettlementTransferItem } from '../../settlement-list/settlement-info-detail-panel/settlement-transfer-item.interface';
import { IDeductionDetailRow } from '../../settlement-list/settlement-info-detail-panel/deduction-detail-row.interface';
import { SettlementBatchActionsService } from './settlement-batch-actions.service';
import { ICurrentUser } from 'src/app/user-management/current-user.interface';
import { UtilityService } from 'src/app/shared/utility.service';
import { ISettlementAccountTotal } from './report-models/settlement-batch-account-total.interface';
import { ISettlementEntryItem } from './report-models/settlement-batch-entry-item.interface';
import { ISettlementGLAccountTotal } from './report-models/settlement-batch-gl-total.interface';
import { ISettlementTransactionTotal } from './report-models/settlement-batch-transaction-total.interface';
import { ISettlementReportDeductionLineItem } from './report-models/settlement-report-deduction-line-item.interface';
import { ISettlementReportNotePaymentLineItem } from './report-models/settlement-report-note-payment-line-item.interface';

@Component({
  selector: 'app-settlement-batch-actions',
  templateUrl: './settlement-batch-actions.component.html',
  styleUrls: ['./settlement-batch-actions.component.css']
})
export class SettlementBatchActionsComponent implements ICellRendererAngularComp {
  public params: any;
  public lockSettlements: boolean = true; // todo - pull down from the service or by some other means
  public lockTransactions: boolean = true;
  public lockBegin: boolean = false;
  public postBatchSubmitted: boolean = false;

  // modals
  postBatchModal: boolean = false;
  deleteBatchModal: boolean = false;
  postBatchErrorModal: boolean = false;

  batchSettlements: ISettlement[] = [];
  errorSettlements: ISettlement[] = [];
  printSettlementList: ISettlementFull[] = [];
  printReady = false;
  enablePrint: boolean = true;
  printModelsLoaded: boolean = false;

  deductionsLoaded: boolean = false;
  bankNotesLoaded: boolean = false;
  transfersLoaded: boolean = false;
  loaded: boolean = false;

  // lookups
  growerList: IGrowerMaster[] = [];
  accounts: IGrowerAccount[] = [];
  accountTypes: IAccountType[] = [];
  vendorList: IVwApvendorMaster[] = [];

  // some lists for printout stuff
  accountTotals: ISettlementAccountTotal[] = [];
  glTotals: ISettlementGLAccountTotal[] = [];
  transactionTotals: ISettlementTransactionTotal[] = [];
  entryItems: ISettlementEntryItem[] = [];
  glTotalAmount: number = 0;
  allNotePayments: IBankNoteDeductionDetail[] = [];
  printSettlementListForDeductions: ISettlementReportDeductionLineItem[] = [];
  printSettlementListForNotePayments: ISettlementReportNotePaymentLineItem[] = [];

  inquiry: ICreditInquiryVM;


  constructor(
    private _router: Router,
    private _http: HttpClient,
    private messageService: MessageService,
    private _growerService: AccountMaintenanceService,
    private _growerListService: GrowerMasterListService,
    private _dropdownService: DropdownService,
    private _bankNoteService: BankNoteListService,
    private _settlementListService: SettlementListService,
    private _settlementDetailService: SettlementInfoDetailPanelService,
    private _actionService: SettlementBatchActionsService,
    private _creditService: CreditInquiryService,
    private _utilityService: UtilityService,
  ) { }

  agInit(params: any): void {
    this.params = params; // has the full model

    this.getLockStatus();

    this.params.data.status = this.params.data.status.trim();


    // load vendor list
    this.vendorList = JSON.parse(localStorage.getItem('APVendorList')) as IVwApvendorMaster[];

    // init some of our lists (accounts, transaction types)
    // account totals
    this.accountTotals.push({ accountLabel: 'REPORT TOTALS', total: 0 } as ISettlementAccountTotal);
    this.accountTotals.push({ accountLabel: '9994 TOTALS', total: 0 } as ISettlementAccountTotal);
    this.accountTotals.push({ accountLabel: '9996 TOTALS', total: 0 } as ISettlementAccountTotal);
    this.accountTotals.push({ accountLabel: '9997 TOTALS', total: 0 } as ISettlementAccountTotal);
    this.accountTotals.push({ accountLabel: '9918 TOTALS', total: 0 } as ISettlementAccountTotal);
    this.accountTotals.push({ accountLabel: '9987 TOTALS', total: 0 } as ISettlementAccountTotal);
    this.accountTotals.push({ accountLabel: '9988 TOTALS', total: 0 } as ISettlementAccountTotal);
    this.accountTotals.push({ accountLabel: '9989 TOTALS', total: 0 } as ISettlementAccountTotal);
    this.accountTotals.push({ accountLabel: '9900 TOTALS', total: 0 } as ISettlementAccountTotal);
    this.accountTotals.push({ accountLabel: '9902 TOTALS', total: 0 } as ISettlementAccountTotal);
    this.accountTotals.push({ accountLabel: '9906 TOTALS', total: 0 } as ISettlementAccountTotal);
    this.accountTotals.push({ accountLabel: '9999 TOTALS', total: 0 } as ISettlementAccountTotal);
    this.accountTotals.push({ accountLabel: 'INTRACOMPANY TOTALS', total: 0 } as ISettlementAccountTotal);
    this.accountTotals.push({ accountLabel: 'OUTSIDE TOTALS', total: 0 } as ISettlementAccountTotal);


    // transaction totals
    this.transactionTotals.push({ transactionType: 'Warehouse Ticket', total: 0 });
    this.transactionTotals.push({ transactionType: 'L/P Gas Tickets', total: 0 });
    this.transactionTotals.push({ transactionType: 'A/P Advice Slip', total: 0 });
    this.transactionTotals.push({ transactionType: 'Labor Advance', total: 0 });
    this.transactionTotals.push({ transactionType: 'Cash Advance', total: 0 });
    this.transactionTotals.push({ transactionType: 'Misc Invoices', total: 0 });
    this.transactionTotals.push({ transactionType: 'Cash Receipts', total: 0 });
    this.transactionTotals.push({ transactionType: 'Misc Entries/Transfer', total: 0 });
    this.transactionTotals.push({ transactionType: 'Flock Settlement', total: 0 });
    this.transactionTotals.push({ transactionType: 'Interest Charged', total: 0 });
    this.transactionTotals.push({ transactionType: 'Interest Paid', total: 0 });
    this.transactionTotals.push({ transactionType: 'Note Payment', total: 0 });
    this.transactionTotals.push({ transactionType: 'Poultry Purchases', total: 0 });

    // gl totals
    this.glTotals.push({ accountNo: '4-118-00', accountName: 'Regular', total: 0} as ISettlementGLAccountTotal);
    this.glTotals.push({ accountNo: '4-118-00', accountName: 'Special Interest Paid', total: 0} as ISettlementGLAccountTotal);
    this.glTotals.push({ accountNo: '4-118-00', accountName: 'Special Balance', total: 0} as ISettlementGLAccountTotal);
    this.glTotals.push({ accountNo: '4-112-00', accountName: 'Notes Payable', total: 0} as ISettlementGLAccountTotal);
    this.glTotals.push({ accountNo: '4-802-00', accountName: 'Note Interest Paid', total: 0} as ISettlementGLAccountTotal);
    this.glTotals.push({ accountNo: '4-118-00', accountName: 'Construction Interest Paid', total: 0} as ISettlementGLAccountTotal);
    this.glTotals.push({ accountNo: '4-118-00', accountName: 'Construction Balance', total: 0} as ISettlementGLAccountTotal);
    this.glTotals.push({ accountNo: '4-118-00', accountName: 'Unique Interest Paid', total: 0} as ISettlementGLAccountTotal);
    this.glTotals.push({ accountNo: '4-118-00', accountName: 'Unique Balance', total: 0} as ISettlementGLAccountTotal);
    /*
    accountNo: string;
  accountName: string;
  total: number;
    */
  }

  /** start loading stuff for printing a batch (also lock) */
  public printBatchStart() {
    this.enablePrint = false;


    // todo - only do this once
    if (this.printModelsLoaded) {
      this.showPrintBatch();
    } else {
      // we have to load the models
      this.infoToast('Please wait while we prepare your printout');
      this.loadAccountTypes();
    }

  }

  /** Check to see if the site needs to be locked down */
  public getLockStatus() {
    this._utilityService
      .isSettlementInProcess()
      .subscribe(
        data => {
          try {
            this.lockSettlements = data;
          } catch (e) {
            console.error(e);
          }
        },
        error => {
          console.error(error);
        }
      );

    this._utilityService
      .isTransactionInProcess()
      .subscribe(
        data => {
          try {
            this.lockTransactions = data;
            this.loaded = true;
          } catch (e) {
            console.error(e);
          }
        },
        error => {
          console.error(error);
        }
      );

  }

  public loadGrowers() {
    this._growerListService
      .getGrowers(false)
      .subscribe(
        data => {
          try {
            this.growerList = data.map(g => {
              g.farmName = g.id + ' - ' + g.farmName;
              return g;
            });
            // this.growerList.forEach(g => {
            //   this.loadAccounts(g.id);
            // });

            // load settlements
            this.loadBatchSettlements();

          } catch (e) {
            console.error(e);
          }
        },
        error => {
          console.error(error);
        }
      );
  }

  private loadAccountTypes() {
    this._dropdownService
      .getAccountTypes()
      .subscribe(
        data => {
          try {
            this.accountTypes = data;

            // kick off our loads with grower
            this.loadGrowers();
          } catch (e) {
            console.error(e);
          }
        },
        error => {
          console.error(error);
          this.errorToast(error);
        }
      );
  }
  public loadAccounts(id: number) {
    this._growerService.getGrowerAccounts(id)
    .subscribe(
      data => {
        try {
          data = data.map(a => {
            a.accountSuffix = this.accountTypes.find(t => t.id.toString() === a.accountType.toString()).accountType + ' - ' + a.accountSuffix;
            return a;
          });

        } catch (e) {
          console.error(e);
        }
      },
      error => {
        console.error(error);
        this.errorToast(error);
      }
    );
  }

  public loadBatchSettlements() {
    this._settlementListService
      .getSettlementsByBatchId(this.params.value)
      .subscribe(
        data => {
          try {
            this.batchSettlements = data;
            let fullCount = 0;
            if (data.length === 0) {
              this.printSettlementList = [];
              this.printModelsLoaded = true;
              this.showPrintBatch();
            }

            let rrnCounter = 0;

            this.printSettlementList = data.map(s => {
              const gmatch = this.growerList.find(g => g.id.toString() === s.growerId.toString());
              s.growerName = !!gmatch ? gmatch.farmName : 'Invalid';
              const item = {
                settlement: s,
                deductions: [],
                notePayments: [],
                transfers: [],
              } as ISettlementFull;

              this._creditService.getCreditInquiry(s.id).subscribe(credit => {
                item.creditInquiry = credit;
              }, error => {
                console.error(error);
              });


              let loadcount = 0;

              // from the settlement level we can directly add to report totals on accounts
              this.accountTotals[0].total -= parseFloat(s.netGrowerPayment.toString());

              // update the settlement transaction total
              const tindex = this.transactionTotals.findIndex(t => t.transactionType === 'Flock Settlement');
              this.transactionTotals[tindex].total -= parseFloat(s.netGrowerPayment.toString());

              // note payments
              this._bankNoteService.getBankNotesByGrowerId(s.growerId).subscribe(
                notes => {
                  try {
                    this._settlementDetailService.getSettlementBankNotes(s.id).subscribe(
                      payments => {
                        try {
                          item.notePayments = payments.map(p => {
                            const noteMatch = notes.find(b => b.id.toString() === p.bankNoteId.toString());
                            const vendorMatch = this.vendorList.find(v => v.vnumb.toString() === noteMatch.noteVendorNumber.toString());
                            const growerMatch = this.growerList.find(g => g.id.toString() === noteMatch.growerId.toString());
                            const notePaymentFull = {
                              notePayment: p,
                              vendorName: vendorMatch.vnumb + ' - ' + vendorMatch.vname.trim(),
                              vendorNameOnly: vendorMatch.vname.trim(),
                              bankNote: noteMatch,
                              rrnCounter: ++rrnCounter,
                              accountNo: this.getGrowerNumberFormatted(noteMatch.growerId),
                              growerName: growerMatch.farmName.trim(),
                              settlementDate: s.settlementDate,
                            } as IBankNoteDeductionDetail;
                            this.allNotePayments.push(notePaymentFull);




                            // piggy back on note payment map to add to the GL account list and the transaction total
                            const glindex = this.glTotals.findIndex(t => t.accountName === 'Notes Payable');
                            this.glTotals[glindex].total += parseFloat(p.adjustedPayment.toString());

                            // todo - how do i get note payment interest?

                            const tindex2 = this.transactionTotals.findIndex(t => t.transactionType === 'Note Payment');
                            this.transactionTotals[tindex2].total -= parseFloat(p.adjustedPayment.toString());


                            return notePaymentFull;
                          });

                          for (let i = 0; i <  item.notePayments.length; i++) {
                            const vendor = this.vendorList.find(v => v.vnumb.toString() === item.notePayments[i].bankNote.noteVendorNumber.toString());
                            if (i === 0) {
                              this.printSettlementListForNotePayments.push({
                                flockNo: item.settlement.entity,
                                growerName: item.settlement.growerName,
                                growerPayment: item.settlement.settlementAmount,
                                vendorNumber: item.notePayments[i].bankNote.noteVendorNumber,
                                vendorName: !!!vendor ? '' : vendor.vname.trim(),
                                notePayment: item.notePayments[i].notePayment.adjustedPayment,
                                centsDozen: item.notePayments[i].bankNote.notePaymentCentsDoz,
                                dozen: item.settlement.dozenEggs,
                                rowType: 'first',
                                settlementId: item.settlement.id
                              } as ISettlementReportNotePaymentLineItem);
                            } else {
                              this.printSettlementListForNotePayments.push({
                                vendorNumber: item.notePayments[i].bankNote.noteVendorNumber,
                                vendorName: !!!vendor ? '' : vendor.vname.trim(),
                                notePayment: item.notePayments[i].notePayment.adjustedPayment,
                                centsDozen: item.notePayments[i].bankNote.notePaymentCentsDoz,
                                dozen: item.settlement.dozenEggs,
                                rowType: 'other',
                                settlementId: item.settlement.id
                              } as ISettlementReportNotePaymentLineItem);
                            }
                            if (i === item.notePayments.length - 1) {
                              this.printSettlementListForNotePayments.push({
                                rowType: 'last',
                                netGrower: item.settlement.netGrowerPayment,
                                settlementId: item.settlement.id,
                              } as ISettlementReportNotePaymentLineItem);
                            }

                          }




                          item.notePaymentsLoaded = true;
                          this.bankNotesLoaded = true;
                          loadcount++;
                          if (loadcount === 3) {
                            fullCount++;
                            if (fullCount === data.length) {
                              this.glTotalAmount = this.getGLTotal();
                              this.printModelsLoaded = true;
                              this.showPrintBatch();
                            }
                          }
                        } catch (e) {
                          console.error(e);
                        }
                      },
                      error => {
                        console.error(error);
                      }
                    );


                  } catch (e) {
                    console.error(e);
                  }
                },
                error => {
                  console.error(error);
                }
              );

              // deductions
              this._growerService.getGrowerAccounts(s.growerId)
              .subscribe(
                accounts => {
                  try {
                    accounts = accounts.map(a => {
                      a.accountSuffix = this.accountTypes.find(t => t.id.toString() === a.accountType.toString()).accountType + ' - ' + a.accountSuffix;
                      return a;
                    });

                    // ! here we can do the entry items where we need the AR type

                    this._settlementDetailService.getSettlementDeductions(s.id)
                    .subscribe(
                      deductionData => {
                        try {

                          // transform the object

                          item.deductions = deductionData.map(d => {
                            const acct = accounts.find(a => a.id.toString() === d.growerAccountId.toString());
                            return {
                              deduction: d,
                              order: this.getAccountOrder(acct),
                              growerAccountName: this.getAccountName(acct),
                            } as IDeductionDetailRow;
                          });
                          const sortedDeductions = item.deductions
                            .filter(d => d.deduction.adjustedDeduction > 0 || d.deduction.adjustedInterest > 0)
                            .sort((a, b) => a.order - b.order);
                          // add to the printSettlementListForDeductions
                          let total = 0;
                          for (let i = 0; i < sortedDeductions.length; i++) {
                            // add the header row if the first one else just the line item
                            const deduct = sortedDeductions[i];
                            if (i === 0) {
                              if (deduct.deduction.adjustedDeduction > 0) {
                                this.printSettlementListForDeductions.push({
                                  flockNo: s.entity,
                                  growerName: item.settlement.growerName,
                                  age: !!!item.creditInquiry ? 'N/A' : item.creditInquiry.currentAge.toString(),
                                  arAccount: deduct.growerAccountName,
                                  type: deduct.growerAccountName.substr(0, 1),
                                  glAccount: '4-118-00',
                                  amount: deduct.deduction.adjustedDeduction,
                                  date: item.settlement.settlementDate,
                                  growerPay: item.settlement.settlementAmount,
                                } as ISettlementReportDeductionLineItem);
                              } else if (deduct.deduction.adjustedInterest > 0) {
                                this.printSettlementListForDeductions.push({
                                  flockNo: s.entity,
                                  growerName: item.settlement.growerName,
                                  age: !!!item.creditInquiry ? 'N/A' : item.creditInquiry.currentAge.toString(),
                                  arAccount: deduct.growerAccountName + ' Int Paid',
                                  type: deduct.growerAccountName.substr(0, 1),
                                  glAccount: '4-118-00',
                                  amount: deduct.deduction.adjustedInterest,
                                  date: s.settlementDate,
                                  growerPay: item.settlement.settlementAmount,
                                } as ISettlementReportDeductionLineItem);
                              }
                            } else {
                              if (deduct.deduction.adjustedDeduction > 0) {
                                this.printSettlementListForDeductions.push({
                                  arAccount: deduct.growerAccountName,
                                  type: deduct.growerAccountName.substr(0, 1),
                                  glAccount: '4-118-00',
                                  amount: deduct.deduction.adjustedDeduction,
                                  date: s.settlementDate,
                                } as ISettlementReportDeductionLineItem);
                              }

                              if (deduct.deduction.adjustedInterest > 0) {
                                this.printSettlementListForDeductions.push({
                                  arAccount: deduct.growerAccountName + ' Int Paid',
                                  type: deduct.growerAccountName.substr(0, 1),
                                  glAccount: '4-118-00',
                                  amount: deduct.deduction.adjustedInterest,
                                  date: s.settlementDate,
                                } as ISettlementReportDeductionLineItem);
                              }
                            }
                            total += deduct.deduction.adjustedDeduction;
                            total += deduct.deduction.adjustedInterest;
                          }

                          // then append a total
                          this.printSettlementListForDeductions.push({
                            glAccount: 'Flock Total',
                            amount: total,
                          } as ISettlementReportDeductionLineItem);


                          // add them to the account totals for each one
                          // regular, const, unique, special
                          const regDeduct = item.deductions.filter(d => d.growerAccountName.startsWith('Regular'));
                          const constDeduct = item.deductions.filter(d => d.growerAccountName.startsWith('Construction'));
                          const uniqueDeduct = item.deductions.filter(d => d.growerAccountName.startsWith('Unique'));
                          const specDeduct = item.deductions.filter(d => d.growerAccountName.startsWith('Special'));

                          const indexIntCharged = this.transactionTotals.findIndex(t => t.transactionType === 'Interest Charged');
                          const indexIntPaid = this.transactionTotals.findIndex(t => t.transactionType === 'Interest Paid');


                          let orderNo = parseInt(s.growerId.toString(), 10) * 100;

                          if (!!regDeduct && regDeduct.length > 1) {
                            const index = this.glTotals.findIndex(t => t.accountName === 'Regular');
                            this.glTotals[index].total += regDeduct.map(d => parseFloat(d.deduction.adjustedDeduction.toString())).reduce((a, b) => a + b);

                            // line items
                            for (let j = 0; j < regDeduct.length; j++) {
                              const acct = accounts.find(a => a.id.toString() === regDeduct[j].deduction.growerAccountId.toString());
                              this.entryItems.push({
                                accountNo: this.getGrowerNumberFormatted(s.growerId),
                                accountName: s.growerName.trim(),
                                arType: 'R ' + (acct.accountSuffix.endsWith('A') ? '' : acct.accountSuffix.substring(acct.accountSuffix.length - 1)),
                                date: s.settlementDate,
                                quantity: 0,
                                amount: parseFloat(s.netGrowerPayment.toString()) * -1,
                                description: 'Settlement',
                                ref: '',
                                lpARNo: '',
                                orderNo: orderNo++,
                              } as ISettlementEntryItem);
                            }


                          }


                          if (!!constDeduct && constDeduct.length > 1) {
                            // tslint:disable-next-line:no-shadowed-variable
                            const iindex = this.glTotals.findIndex(t => t.accountName === 'Construction Balance');
                            this.glTotals[iindex].total += constDeduct.map(d => parseFloat(d.deduction.adjustedDeduction.toString())).reduce((a, b) => a + b);

                            const index2 = this.glTotals.findIndex(t => t.accountName === 'Construction Interest Paid');
                            this.glTotals[index2].total += constDeduct.map(d => parseFloat(d.deduction.adjustedInterest.toString())).reduce((a, b) => a + b);
                            this.transactionTotals[indexIntCharged].total += constDeduct.map(d => parseFloat(d.deduction.adjustedInterest.toString())).reduce((a, b) => a + b);
                            this.transactionTotals[indexIntPaid].total -= constDeduct.map(d => parseFloat(d.deduction.adjustedInterest.toString())).reduce((a, b) => a + b);

                            // line items
                            for (let j = 0; j < constDeduct.length; j++) {
                              const acct = accounts.find(a => a.id.toString() === constDeduct[j].deduction.growerAccountId.toString());
                              this.entryItems.push({
                                accountNo: this.getGrowerNumberFormatted(s.growerId),
                                accountName: s.growerName.trim(),
                                arType: 'C ' + (acct.accountSuffix.endsWith('A') ? '' : acct.accountSuffix.substring(acct.accountSuffix.length - 1)),
                                date: s.settlementDate,
                                quantity: 0,
                                amount: parseFloat(constDeduct[j].deduction.adjustedDeduction.toString()) * -1,
                                description: 'Settlement',
                                ref: '',
                                lpARNo: '',
                                orderNo: orderNo++,
                              } as ISettlementEntryItem);

                              if (parseFloat(constDeduct[j].deduction.adjustedInterest.toString()) !== 0) {
                                this.entryItems.push({
                                  accountNo: this.getGrowerNumberFormatted(s.growerId),
                                  accountName: s.growerName.trim(),
                                  arType: 'C ' + (acct.accountSuffix.endsWith('A') ? '' : acct.accountSuffix.substring(acct.accountSuffix.length - 1)),
                                  date: s.settlementDate,
                                  quantity: 0,
                                  amount: parseFloat(constDeduct[j].deduction.adjustedInterest.toString()),
                                  description: 'Interest Charged',
                                  ref: '',
                                  lpARNo: '',
                                  orderNo: orderNo++,
                                } as ISettlementEntryItem);
                                this.entryItems.push({
                                  accountNo: this.getGrowerNumberFormatted(s.growerId),
                                  accountName: s.growerName.trim(),
                                  arType: 'C ' + (acct.accountSuffix.endsWith('A') ? '' : acct.accountSuffix.substring(acct.accountSuffix.length - 1)),
                                  date: s.settlementDate,
                                  quantity: 0,
                                  amount: parseFloat(constDeduct[j].deduction.adjustedInterest.toString()) * -1,
                                  description: 'Interest Paid',
                                  ref: '',
                                  lpARNo: '',
                                  orderNo: orderNo++,
                                } as ISettlementEntryItem);
                              }
                            }
                          }

                          if (!!uniqueDeduct && uniqueDeduct.length > 1) {
                            const iindex = this.glTotals.findIndex(t => t.accountName === 'Unique Balance');
                            this.glTotals[iindex].total += uniqueDeduct.map(d => parseFloat(d.deduction.adjustedDeduction.toString())).reduce((a, b) => a + b);

                            const index2 = this.glTotals.findIndex(t => t.accountName === 'Unique Interest Paid');
                            this.glTotals[index2].total += uniqueDeduct.map(d => parseFloat(d.deduction.adjustedInterest.toString())).reduce((a, b) => a + b);
                            this.transactionTotals[indexIntCharged].total += uniqueDeduct.map(d => parseFloat(d.deduction.adjustedInterest.toString())).reduce((a, b) => a + b);
                            this.transactionTotals[indexIntPaid].total -= uniqueDeduct.map(d => parseFloat(d.deduction.adjustedInterest.toString())).reduce((a, b) => a + b);

                            // line items
                            for (let j = 0; j < uniqueDeduct.length; j++) {
                              const acct = accounts.find(a => a.id.toString() === uniqueDeduct[j].deduction.growerAccountId.toString());
                              this.entryItems.push({
                                accountNo: this.getGrowerNumberFormatted(s.growerId),
                                accountName: s.growerName.trim(),
                                arType: 'U ' + (acct.accountSuffix.endsWith('A') ? '' : acct.accountSuffix.substring(acct.accountSuffix.length - 1)),
                                date: s.settlementDate,
                                quantity: 0,
                                amount: parseFloat(uniqueDeduct[j].deduction.adjustedDeduction.toString()) * -1,
                                description: 'Settlement',
                                ref: '',
                                lpARNo: '',
                                orderNo: orderNo++,
                              } as ISettlementEntryItem);

                              if (parseFloat(uniqueDeduct[j].deduction.adjustedInterest.toString()) !== 0) {
                                this.entryItems.push({
                                  accountNo: this.getGrowerNumberFormatted(s.growerId),
                                  accountName: s.growerName.trim(),
                                  arType: 'U ' + (acct.accountSuffix.endsWith('A') ? '' : acct.accountSuffix.substring(acct.accountSuffix.length - 1)),
                                  date: s.settlementDate,
                                  quantity: 0,
                                  amount: parseFloat(uniqueDeduct[j].deduction.adjustedInterest.toString()),
                                  description: 'Interest Charged',
                                  ref: '',
                                  lpARNo: '',
                                  orderNo: orderNo++,
                                } as ISettlementEntryItem);
                                this.entryItems.push({
                                  accountNo: this.getGrowerNumberFormatted(s.growerId),
                                  accountName: s.growerName.trim(),
                                  arType: 'U ' + (acct.accountSuffix.endsWith('A') ? '' : acct.accountSuffix.substring(acct.accountSuffix.length - 1)),
                                  date: s.settlementDate,
                                  quantity: 0,
                                  amount: parseFloat(uniqueDeduct[j].deduction.adjustedInterest.toString()) * -1,
                                  description: 'Interest Paid',
                                  ref: '',
                                  lpARNo: '',
                                  orderNo: orderNo++,
                                } as ISettlementEntryItem);
                              }
                            }
                          }

                          if (!!specDeduct && specDeduct.length > 1) {
                            const iindex = this.glTotals.findIndex(t => t.accountName === 'Special Balance');
                            this.glTotals[iindex].total += specDeduct.map(d => parseFloat(d.deduction.adjustedDeduction.toString())).reduce((a, b) => a + b);

                            const index2 = this.glTotals.findIndex(t => t.accountName === 'Special Interest Paid');
                            this.glTotals[index2].total += specDeduct.map(d => parseFloat(d.deduction.adjustedInterest.toString())).reduce((a, b) => a + b);
                            this.transactionTotals[indexIntCharged].total += specDeduct.map(d => parseFloat(d.deduction.adjustedInterest.toString())).reduce((a, b) => a + b);
                            this.transactionTotals[indexIntPaid].total -= specDeduct.map(d => parseFloat(d.deduction.adjustedInterest.toString())).reduce((a, b) => a + b);

                            // line items
                            for (let j = 0; j < specDeduct.length; j++) {
                              const acct = accounts.find(a => a.id.toString() === specDeduct[j].deduction.growerAccountId.toString());
                              this.entryItems.push({
                                accountNo: this.getGrowerNumberFormatted(s.growerId),
                                accountName: s.growerName.trim(),
                                arType: 'S ' + (acct.accountSuffix.endsWith('A') ? '' : acct.accountSuffix.substring(acct.accountSuffix.length - 1)),
                                date: s.settlementDate,
                                quantity: 0,
                                amount: parseFloat(specDeduct[j].deduction.adjustedDeduction.toString()) * -1,
                                description: 'Settlement',
                                ref: '',
                                lpARNo: '',
                                orderNo: orderNo++,
                              } as ISettlementEntryItem);

                              if (parseFloat(specDeduct[j].deduction.adjustedInterest.toString()) !== 0) {
                                this.entryItems.push({
                                  accountNo: this.getGrowerNumberFormatted(s.growerId),
                                  accountName: s.growerName.trim(),
                                  arType: 'S ' + (acct.accountSuffix.endsWith('A') ? '' : acct.accountSuffix.substring(acct.accountSuffix.length - 1)),
                                  date: s.settlementDate,
                                  quantity: 0,
                                  amount: parseFloat(specDeduct[j].deduction.adjustedInterest.toString()),
                                  description: 'Interest Charged',
                                  ref: '',
                                  lpARNo: '',
                                  orderNo: orderNo++,
                                } as ISettlementEntryItem);
                                this.entryItems.push({
                                  accountNo: this.getGrowerNumberFormatted(s.growerId),
                                  accountName: s.growerName.trim(),
                                  arType: 'S ' + (acct.accountSuffix.endsWith('A') ? '' : acct.accountSuffix.substring(acct.accountSuffix.length - 1)),
                                  date: s.settlementDate,
                                  quantity: 0,
                                  amount: parseFloat(specDeduct[j].deduction.adjustedInterest.toString()) * -1,
                                  description: 'Interest Paid',
                                  ref: '',
                                  lpARNo: '',
                                  orderNo: orderNo++,
                                } as ISettlementEntryItem);
                              }
                            }
                          }






                          // sort the final product
                          item.deductions = item.deductions.sort((a, b) => a.order - b.order);
                          item.deductionsLoaded = true;
                          loadcount++;
                          if (loadcount === 3) {
                            fullCount++;
                            if (fullCount === data.length) {
                              this.glTotalAmount = this.getGLTotal();
                              this.printModelsLoaded = true;
                              this.showPrintBatch();
                            }
                          }

                        } catch (e) {
                          console.error(e);
                        }
                      },
                      error => {

                        console.error(error);
                        this.errorToast(error);
                      }
              );


                  } catch (e) {
                    console.error(e);
                  }
                },
                error => {
                  console.error(error);
                  this.errorToast(error);
                }
              );

              // transfers
              this._settlementDetailService.getSettlementTransfers(s.id, 'From')
              .subscribe(
                fromData => {
                  try {
                    this._settlementDetailService.getSettlementTransfers(s.id, 'To')
                    .subscribe(
                      toData => {
                        const trans = fromData
                        .map(t => { t.transferAmount = t.transferAmount * -1.0; return t; }) // stupid hack to invert transfers as needed
                        .concat(toData);

                        item.transfers = trans.map(t => {

                        const toSettle = this.batchSettlements.find(s2 => s2.id === t.toSettlementId);
                        const fromSettle = this.batchSettlements.find(s2 => s2.id === t.fromSettlementId);
                        // must get both settlements
                        const row = {
                          transferModel: t,
                          type: t.fromSettlementId === s.id ? 'From' : 'To',
                          toSettlement: toSettle,
                          fromSettlement: fromSettle,
                          toGrower: this.growerList.find(g => g.id === toSettle.growerId),
                          fromGrower: this.growerList.find(g => g.id === fromSettle.growerId),
                        } as ISettlementTransferItem;

                        // add to the transfer counts
                        const transindex = this.transactionTotals.findIndex(tr => tr.transactionType === 'Misc Entries/Transfer');
                        this.transactionTotals[transindex].total += parseFloat(t.transferAmount.toString());
                        // ! may need to adjust the way this is done

                        return row;
                      });
                      item.transfersLoaded = true;

                      loadcount++;
                      if (loadcount === 3) {
                        fullCount++;
                        if (fullCount === data.length) {
                          this.glTotalAmount = this.getGLTotal();
                          this.printModelsLoaded = true;
                          this.showPrintBatch();
                        }
                      }
                      }, error => {

                        console.error(error);
                      }
                    );



                  } catch (e) {
                    console.error(e);
                  }
                },
                error => {

                  console.error(error);
                  this.errorToast(error);
                }
              );


              return item;
            });
            // todo - flag that we finished loading



          } catch (e) {
            console.error(e);
          }
        },
        error => {
          console.error(error);
        }
      );
  }

  /** runs the calculations on a settlement batch for the first time to generate deductions/transfers/note payments */
  public beginSettlement() {
    /*
    1.
    */
   this.infoToast('Please wait for calculations to be generated for this settlement batch');
   this.lockBegin = true;
   this._settlementListService.getSettlementCalculationsByBatchId(this.params.value).subscribe(result => {

    try {
      this.goToEdit();
    } catch (e) {
      console.error(e);
    }
   }, error => {
     console.error(error);
   });
  }

  /** helper to generate account mae */
  private getAccountName(account: IGrowerAccount): string {
    // const type = this.accountTypes.find(t => t.id.toString() === account.accountType.toString());
    // console.log(account.accountSuffix);
    // const result = account.accountSuffix.toUpperCase() === 'A' ? type.accountType : type.accountType + ' - ' + account.accountSuffix;
    // console.log(result);
    return account.accountSuffix;
  }

  private getGrowerNumberFormatted(growerId: number): string {
    const grower = this.growerList.find(g => g.id.toString() === growerId.toString());
    return growerId.toString().substr(0, 4) + '-' + growerId.toString().substr(3, 1) + '-' + (grower.farmType.toString() === '1' ? 'B' : 'H');
  }

  /** helper to determine the order of the account for the deductions */
  private getAccountOrder(account: IGrowerAccount): number {
    // get the account
    const type = this.accountTypes.find(t => t.id.toString() === account.accountType.toString());
    // our logic is use a base number for each account type, then incrememnt for each account
    /*
      Construction - 0
      Unique - 100
      Special - 200
      Regular - 300
    */
    let order = 0;
    // todo - construction is used when remaining number of flocks is greater than 0
    switch (type.accountType) {
      case 'Regular':
        order = 300;
        break;
      case 'Unique':
        order = 100;
        break;
      case 'Special':
        order = 200;
        break;
      default:
        order = 0;
    }

    // now we have the base, now to offset by the account suffix
    // a = 97, and so on
    order += account.accountSuffix.toLowerCase().charCodeAt(0) - 97;

    // now we are done
    return order;
  }

  private getGLAccountNumberString(no: number): string {
    const s = no.toString();
    return s.substr(0, 1) + '-' + s.substr(1, 3) + '-' + s.substring(4);
  }


  /***************************************************
   * Redirects
   **************************************************/

  /** redirect to editing a batch */
  public goToEdit() {
    // todo - switch between if New or InProcess
    this._router.navigateByUrl(
      'SettlementListComponent?id=' + this.params.value
    );
    return;
  }

  public goToView() {
    this._router.navigateByUrl(
      'ViewSettlementBatchComponent?Id=' + this.params.value
    );
    return;
  }

  public goToFixErrors() {
    this._router.navigateByUrl(
      'FixSettlementsComponent?Id=' + this.params.value
    );
    return;
  }

  /***************************************************
   * Modal submits and print
   **************************************************/

   public postBatchSubmit() {
     // need to validate that the batch can be submitted
     // postBatchErrorModal
     this.errorSettlements = [];
     this._settlementListService.getSettlementsByBatchId(this.params.value).subscribe(results => {
      try {
        this.errorSettlements = results
        .map(s => {
          if (!!!s.netGrowerPayment && s.status !== 'Duplicate') {
            s.netGrowerPayment = 0;
          }

          return s;
        })
        .filter(s => s.netGrowerPayment < 10);
        if (this.errorSettlements.length > 0) {
          this.postBatchErrorModal = true;
        } else {
          this.postBatch();
        }
      } catch (e) {
        console.error(e);
      }
     });
   }

  public postBatch() {
    this.postBatchSubmitted = true;

    // todo - lock out if it is not finished properly, need to validate settlement

    const user = JSON.parse(localStorage.getItem('ActiveDirectoryUser')) as ICurrentUser;
    this.params.data.postedDate = new Date().toISOString();
    this.params.data.postedBy = user.username;
    this.params.data.status = 'Posted';
    this.params.data.email = user.email;
    this._actionService.postSettlementBatch(this.params.data)
    .subscribe(
      result => {
        try {
          if (result.statusCode === 200) {
            this.successToast('You have successfully posted the batch!');
            this.postBatchModal = false;
            this.postBatchSubmitted = false;
          }


        } catch (e) {
          console.error(e);
          this.postBatchSubmitted = false;
        }
      },
      error => {
        console.error(error);
        this.errorToast(error);
        this.postBatchSubmitted = false;
      }
    );


  }



  public deleteBatch() {
    this.deleteBatchModal = false;
    const templist = [];
    templist.push(this.params.data);
    this.params.api.updateRowData({ remove: templist});
    this.successToast('Batch has been deleted successfully!');

    // call the service, then run this -
    this._actionService.deleteSettlementBatch(this.params.data.id)
    .subscribe(
      result => {
        try {


        } catch (e) {
          console.error(e);
        }
      },
      error => {
        console.error(error);
        this.errorToast(error);
      }
    );




  }

  /** gets the deduction of a category total for a settlement */
  public getDeductionTotal(type: string, settlementId: number): number {
    // get the settlement
    const settlement = this.printSettlementList.find(s => s.settlement.id.toString() === settlementId.toString());
    const deductions = settlement.deductions.filter(d => d.growerAccountName.substr(0, 1).toLowerCase() === type.substr(0, 1));
    if (deductions.length === 0) {
      return 0;
    } else if (type.includes('interest')) {
      return deductions.map(d => d.deduction.adjustedInterest).reduce((a, b) => a + b);
    } else {
      return deductions.map(d => d.deduction.adjustedDeduction).reduce((a, b) => a + b);
    }
  }




  public loadPrintModel() {
    this.showPrintBatch();

  }

  public getGLTotal(): number {
    this.glTotals = this.glTotals.map(t => {
      t.total *= -1;
      return t;
    });
    return this.glTotals.map(t => t.total).reduce((a, b) => a + b);
  }

  /** after we load all the models then we can print */
  public showPrintBatch() {
    this.printReady = true;
    this._http.get('assets/tablestyle.json').subscribe(res => {
      const tableStyle = res['style'];
      let printContents, popupWin;
      printContents = document.getElementById('print-section-settlements').innerHTML;
      popupWin = window.open(
        '',
        '_blank',
        'top=0,left=0,height=100%,width=auto'
      );
      popupWin.document.open();
      popupWin.document.write(`
        <html>
          <head>
            <title>Settlement Batch # ${this.params.value}</title>
            <style>
            ${tableStyle}
            </style>
          </head>
      <body onload="window.print();window.close()'">${printContents}</body>
        </html>`);
      popupWin.document.close();
      popupWin.print();
      this.enablePrint = true;
    });
  }

 /***************************************************
   * Modals/Dialogs
   **************************************************/

  /** Show a toast popup for an error message */
  private errorToast(error: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: error
    });
  }

  /** Show a toast popup for a success message */
  private successToast(msg: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: msg
    });
  }
  /** Show a toast popup for an info message */
  private infoToast(msg: string) {
    this.messageService.add({
      severity: 'info',
      summary: 'Information',
      detail: msg
    });
  }



  refresh(): boolean {
      return false;
  }


}
