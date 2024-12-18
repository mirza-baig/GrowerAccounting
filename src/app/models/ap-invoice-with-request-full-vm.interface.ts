import { IApgldistributionAccounts } from './apgldistribution-accounts.interface';

import { IApinvoicePaymentRequest } from 'src/app/models/ap-invoice-payment-request.interface';
import { IApInvoice } from 'src/app/models/ap-invoice.interface';
import { IApinvoicePaymentFarmDistributionVM } from './ap-invoice-payment-farm-distribution-vm.interface';
export interface IApInvoiceWithRequestFullVM {
  invoice: IApInvoice;
  request: IApinvoicePaymentRequest;
  glDistributions: IApgldistributionAccounts[];
  growerDistributions: IApinvoicePaymentFarmDistributionVM[];
}

