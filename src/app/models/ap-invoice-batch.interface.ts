export interface IApInvoiceBatch {
    id: number;
    description: string;
    createdDate: Date | string | null;
    createdBy: string;
    postedDate: Date | string | null;
    postedBy: string;
    lastReviewDate: Date | string | null;
    lastReviewedBy: string;
    status: string;
}
