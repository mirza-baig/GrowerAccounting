export interface IApInvoiceAlternatePayee {
    id: number;
    apInvoiceId: number;
    datePosted: Date | string;
    isCompleted: boolean;
    dateCompleted: Date | string | null;
}
