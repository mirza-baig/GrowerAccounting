export interface IApinvoicePaymentRequestBatch {
    id: number;
    description: string;
    createdDate: Date | string | null;
    createdBy: string;
    postedDate: Date | string | null;
    postedBy: string;
    lastReviewedBy: string;
    lastReviewDate: Date | string | null;
    status: string;
    stage: string;
    approverId: number | null;
    batchCreatorEmail: string;

}
