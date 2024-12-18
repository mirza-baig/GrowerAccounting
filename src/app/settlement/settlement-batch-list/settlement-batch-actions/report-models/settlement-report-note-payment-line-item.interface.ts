export interface ISettlementReportNotePaymentLineItem {
  flockNo: string;
  growerName: string;
  growerPayment: number;
  regularDeduction: number | null;
  specialDeduction: number | null;
  specialInterest: number | null;
  uniqueDeduction: number | null;
  uniqueInterest: number | null;
  constructionDeduction: number | null;
  vendorNumber: number;
  vendorName: string;
  notePayment: number;
  centsDozen: number;
  dozen: number;
  rowType: string; // first, other, last
  netGrower: number;
  settlementId: number;
}
