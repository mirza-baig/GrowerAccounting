import { IApinvoicePaymentFarmDistribution } from './ap-invoice-payment-farm-distribution.interface';

export interface IApinvoicePaymentRequest {
    id: number;
    company: number | null;
    farm: number | null;
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
    stage: string;
    batchId: number | null;
    fileData: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    apinvoiceId: string;
    payTo: string;
    apinvoicePaymentFarmDistribution: IApinvoicePaymentFarmDistribution[];
}
