export interface ISettlementBatch {
  id: number;
  type: string;
  description: string;
  createdDate: Date | string | null;
  createdBy: string;
  postedDate: Date | string | null;
  postedBy: string;
  status: string;
  total: number;
  grossTotal: number;
  email: string;
}


