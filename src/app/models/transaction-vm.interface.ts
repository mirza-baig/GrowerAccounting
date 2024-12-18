export interface ITransactionVM {
    Id: number;
    GrowerId: number;
    GrowerAccountId: number;
    TransactionCode: string;
    ARType: string;
    AccountSuffix: string;
    TransactionDate: Date | null;
    Quantity: number | null;
    TransactionAmount: number | null;
    TransactionDescription: string;
    ReferenceNumber: string;
    TransactionAccountName: string;
    TransactionTaxExemptCode: string;
    LPServiceARNumber: number | null;
    VendorId: string;
    TransactionStatus: number | null;
    SettlementProcessDate: Date | null;
}
