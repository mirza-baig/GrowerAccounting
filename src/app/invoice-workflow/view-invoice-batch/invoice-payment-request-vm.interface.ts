import { IApinvoicePaymentRequest } from 'src/app/models/ap-invoice-payment-request.interface';
import { IApInvoice } from 'src/app/models/ap-invoice.interface';
import { IApinvoice } from 'src/app/models/apinvoice.interface';

export interface IInvoicePaymentRequestVM {
    invoice: IApinvoicePaymentRequest;
    farmName: string;
    vendorName: string;
    approval: string;
    comment: string;
    isFileViewed: boolean;
    apInvoice: IApInvoice;
    accountName: string;
    description: string;
    apAmount: number | null;
}
