import { IVwApinvoiceWithRequest } from './vw-ap-invoice-with-request.interface';

export interface IInvoiceSearchVM extends IVwApinvoiceWithRequest {
    growerName: string;
    vendorName: string;
    startDate: Date | string | null;
    endDate: Date | string | null;
}
