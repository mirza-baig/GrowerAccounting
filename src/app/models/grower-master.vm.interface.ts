import { IAccountVM } from "./account-vm.interface";
import { IBankNoteVM } from "./bank-note-vm.interface";

export interface IGrowerMasterVM {
    /**
     * Initializes a new instance of the @see GrowerMaster  class.
     */

    /**
     * Gets or sets the identifier.
     * @value  The identifier.
     */
    Id: number;
    /**
     * Gets or sets the type of the farm.
     * @value  The type of the farm.
     */
    FarmType: string;
    /**
     * Gets or sets the name of the farm.
     * @value  The name of the farm.
     */
    FarmName: string;
    /**
     * Gets or sets the farm address1.
     * @value  The farm address1.
     */
    FarmAddress1: string;
    /**
     * Gets or sets the farm address2.
     * @value  The farm address2.
     */
    FarmAddress2: string;
    /**
     * Gets or sets the phone.
     * @value  The phone.
     */
    Phone: string;
    /**
     * Gets or sets the cell phone.
     * @value  The cell phone.
     */
    CellPhone: string;
    /**
     * Gets or sets the email.
     * @value  The email.
     */
    Email: string;
    /**
     * Gets or sets the initialize date.
     * @value  The initialize date.
     */
    InitializeDate: Date | string | null;
    /**
     * Gets or sets the ytdinterest charged.
     * @value  The ytdinterest charged.
     */
    YtdinterestCharged: number | null;
    /**
     * Gets or sets the ytdinterest paid.
     * @value  The ytdinterest paid.
     */
    YtdinterestPaid: number | null;
    /**
     * Gets or sets the last settlement date.
     * @value  The last settlement date.
     */
    LastSettlementDate: Date | string | null;
    /**
     * Gets or sets the last statement date.
     * @value  The last statement date.
     */
    LastStatementDate: Date | string | null;
    /**
     * Gets or sets the last settlement amount.
     * @value  The last settlement amount.
     */
    LastSettlementAmount: number | null;
    /**
     * Gets or sets the last note payment amount.
     * @value  The last note payment amount.
     */
    LastNotePaymentAmount: number | null;
    /**
     * Gets or sets the number of settlements.
     * @value  The number of settlements.
     */
    NumberOfSettlements: number | null;
    /**
     * Gets or sets the accumulated settlement amount.
     * @value  The accumulated settlement amount.
     */
    AccumulatedSettlementAmount: number | null;
    /**
     * Gets or sets the vendor identifier.
     * @value  The vendor identifier.
     */
    VendorId: number | null;
    /**
     * Gets or sets the grower comment.
     * @value  The grower comment.
     */
    GrowerComment: string;

    /**
     * Gets or sets the grower account.
     * @value  The grower account.
     */
    GrowerAccount: IAccountVM[];
    
    /**
     * Gets or sets the grower bank note.
     * @value  The grower bank note.
     */
    GrowerBankNote: IBankNoteVM;

    
    /**
     * Gets or sets the grower bank note master.
     * @value  The grower bank note master.
     */
    // export virtual ICollection<GrowerBankNoteMaster> GrowerBankNoteMaster { get; set; }
}