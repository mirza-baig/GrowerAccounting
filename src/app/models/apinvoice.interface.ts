

export interface IApinvoice {
	id: number;
    company: number | null;
    vendorId: number | null;
    payDate: Date | string | null;
    account: number | null;
    invoiceDate: Date | string | null;
    amount: number | null;
    invoiceNumber: string;
    description: string;
    remittanceNote: string;
    separateCheck: boolean | null;
    growerId: number;
    apvoucherId: number;
    status: string;
}


