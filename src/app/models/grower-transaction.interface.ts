

export interface IGrowerTransaction {
	id: number;
	growerId: number;
	growerAccountId: number;
	transactionCode: string;
	artype: string;
	accountSuffix: string;
	transactionDate: Date | string | null;
	quantity: number | null;
	transactionAmount: number | null;
	transactionDescription: string;
	referenceNumber: string;
	transactionAccountName: string;
	transactionTaxExemptCode: string;
	lpserviceArnumber: number | null;
	vendorId: string;
	transactionStatus: string;
	settlementProcessDate: Date | string | null;
	batchId: number | null;
	growerName: string;
	storeId: number | string;
}


