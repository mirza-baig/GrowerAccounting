export interface IGrowerBonusPayment {
    id: number;
    growerId: number;
    bonusPaymentDate: Date | string;
    uploadUser: string;
    paymentAmount: number;
}
