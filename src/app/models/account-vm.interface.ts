export interface IAccountVM {
    Id: number;
    GrowerId: number;
    AccountType: string;
    AccountSuffix: string;
    DateOpened: Date | null;
    DeductChargeInterestFromDate: Date | null;
    InterestRate: number | null;
    NoFlocksToPay: number | null;
    RemainingFlocksToPay: number | null;
    BalanceGoalStartDeduction: number | null;
    BeginYearBalance: number | null;
    BalanceForward: number | null;
    CurrentCharges: number | null;
    LastChargeDate: Date | null;
    CurrentCredits: number | null;
    LastCreditDate: Date | null;
    CashAdvances: number | null;
    AmountDue: number | null;
    YTDInterestCharged: number | null;
    YTDInterestPaid: number | null;
    AccountComment: string;
}
