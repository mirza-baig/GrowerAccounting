import { IBankNoteVM } from './bank-note-vm.interface';

export interface ISettlementItemVM {
    Id: number;
    FarmId: number;
    FarmName: string;
    FlockId: number;
    SettlementId: number;
    SettlementNumber: string; // farm/flock
    GrowerSettlement: number;
    GrowerId: number;
    Date: Date;
    TransferIn: number;
    // original deductions
    RegularOriginalDeduction: number;
    RegularOriginalDeductionInterest: number;
    SpecialOriginalDeduction: number;
    SpecialOriginalDeductionInterest: number;
    SpecialBOriginalDeduction: number;
    SpecialBOriginalDeductionInterest: number;
    UniqueOriginalDeduction: number;
    UniqueOriginalDeductionInterest: number;

    // adjusted
    RegularAdjustedDeduction: number;
    RegularAdjustedDeductionInterest: number;
    SpecialAdjustedDeduction: number;
    SpecialAdjustedDeductionInterest: number;
    SpecialBAdjustedDeduction: number;
    SpecialBAdjustedDeductionInterest: number;
    UniqueAdjustedDeduction: number;
    UniqueAdjustedDeductionInterest: number;

    BankNotes: IBankNoteVM[]; // these are an id, a name, a Deduction and an interest OriginalDeduction
    NetGrower: number;
    Const: number;
    VendorId: number;
    VendorName: string;

    NetProceedsUsed: boolean;
    NotePayment: number;

}