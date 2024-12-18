import { IAccountVM } from './account-vm.interface';

export interface IGrowerTransactionVM {
    /**
     * Gets or sets the identifier.
     * @value  The identifier.
     */
    Id: number;
    /**
     * Gets or sets the grower identifier.
     * @value  The grower identifier.
     */
    GrowerId: number;
    /**
     * Gets or sets the grower account identifier.
     * @value  The grower account identifier.
     */
    GrowerAccountId: number;
    /**
     * Gets or sets the transaction code.
     * @value  The transaction code.
     */
    TransactionCode: string;
    /**
     * Gets or sets the artype.
     * @value  The artype.
     */
    Artype: string;
    /**
     * Gets or sets the account suffix.
     * @value  The account suffix.
     */
    AccountSuffix: string;
    /**
     * Gets or sets the transaction date.
     * @value  The transaction date.
     */
    TransactionDate: Date | string | null;
    /**
     * Gets or sets the quantity.
     * @value  The quantity.
     */
    Quantity: number | null;
    /**
     * Gets or sets the transaction amount.
     * @value  The transaction amount.
     */
    TransactionAmount: number | null;
    /**
     * Gets or sets the transaction description.
     * @value  The transaction description.
     */
    TransactionDescription: string;
    /**
     * Gets or sets the reference number.
     * @value  The reference number.
     */
    ReferenceNumber: string;
    /**
     * Gets or sets the name of the transaction account.
     * @value  The name of the transaction account.
     */
    TransactionAccountName: string;
    /**
     * Gets or sets the transaction tax exempt code.
     * @value  The transaction tax exempt code.
     */
    TransactionTaxExemptCode: string;
    /**
     * Gets or sets the lpservice arnumber.
     * @value  The lpservice arnumber.
     */
    LpserviceArnumber: number | null;
    /**
     * Gets or sets the vendor identifier.
     * @value  The vendor identifier.
     */
    VendorId: string;
    /**
     * Gets or sets the transaction status.
     * @value  The transaction status.
     */
    TransactionStatus: number | null;
    /**
     * Gets or sets the settlement process date.
     * @value  The settlement process date.
     */
    SettlementProcessDate: Date | string | null;
    /**
     * Gets or sets the grower account.
     * @value  The grower account.
     */
    GrowerAccount: IAccountVM;

}
