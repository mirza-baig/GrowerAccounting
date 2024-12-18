export interface ISettlementReportDeductionLineItem {
  flockNo: string;
  growerName: string;
  age: string;
  arAccount: string;
  glAccount: string;
  date: Date | string | null;
  amount: number;
  type: string;
  growerPay: number | null;
}
