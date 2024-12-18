import { IApInvoice } from 'src/app/models/ap-invoice.interface';
import { IApInvoiceAlternatePayee } from './ap-invoice-alternate-payee.interface';
import { IApinvoice } from './apinvoice.interface';

export interface IApInvoiceAlternatePayeeVM extends IApInvoiceAlternatePayee {
    growerName: string;
    vendorName: string;
    invoice: IApInvoice;
}

/*
id: number;
    apInvoiceId: number;
    datePosted: Date | string;
    isCompleted: boolean;
    dateCompleted: Date | string | null;
*/
