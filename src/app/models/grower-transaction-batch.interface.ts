

export interface IGrowerTransactionBatch {
	id: number;
	description: string;
	createdDate: Date | string | null;
	createdBy: string;
	postedDate: Date | string | null;
	postedBy: string;
	status: string;
}


