import {IApinvoicePaymentRequestBatch} from './ap-invoice-payment-request-batch.interface';

export interface IVmApInvoicePaymentRequestBatch extends IApinvoicePaymentRequestBatch {
  email: string;
}
