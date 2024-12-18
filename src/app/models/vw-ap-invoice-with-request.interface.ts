export interface IVwApinvoiceWithRequest {
    id: number;
    company: number | null;
    vendorId: number | null;
    payDate: Date | string | null;
    growerId: number | null;
    farmName: string;
    account: number | null;
    invoiceDate: Date | string | null;
    amount: number | null;
    invoiceNumber: string;
    description: string;
    remittanceNote: string;
    separateCheck: boolean | null;
    apvoucherId: number | null;
    status: string;
    batchId: number | null;
    stage: string;
    requestId: number | null;
    fileData: string | null;
    fileName: string | null;
    fileSize: number | null;
    mimeType: string;
    checkNumber: string;
    vendorName: string;
}
