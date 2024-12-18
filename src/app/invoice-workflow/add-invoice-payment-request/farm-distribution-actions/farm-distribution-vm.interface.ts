export interface IFarmDistributionVM {
    id: number;
    growerId: number | null;
    growerId2: number | null;
    name: string;
    paymentRequestId: number | null;
    amount: number | null;
    isLocked: boolean;
    growerAccountId: number | null;
    growerAccountName: string;
}
