export interface IApInvoiceSearchVM {
    id: number;
    company: number | null;
    vendorId: number | null;
    payDate: Date | string | null;
    growerId: number | null;
    account: number | null;
    invoiceDate: Date | string | null;
    amount: number | null;
    invoiceNumber: string;
    description: string;
    remittanceNote: string;
    separateCheck: boolean | null;
    apvoucherId: number | null;
    status: string;
    daysBackFromToday: number;
}
