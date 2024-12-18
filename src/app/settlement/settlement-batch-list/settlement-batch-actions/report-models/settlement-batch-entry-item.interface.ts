export interface ISettlementEntryItem {
  accountNo: string;
  accountName: string;
  arType: string;
  date: Date | string | null;
  quantity: number;
  amount: number;
  description: string;
  ref: string;
  lpARNo: string;
  orderNo: number;
}
