import { IApInvoiceTall } from '../models/ap-invoice-tall.interface';

export interface IInvoiceItem {
    invoice: IApInvoiceTall;
    vendorName: string;
    companyName: string;
    accountName: string;
    growerName: string;
}