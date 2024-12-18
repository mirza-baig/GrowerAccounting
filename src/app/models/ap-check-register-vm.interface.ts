export interface IAPCheckRegisterVM {
    VendorId: number;
    VendorName: string;
    CheckNumber: number;
    Amount: number;
    CapJobNumber: number;
    Reference: string;
    Company: number;
    GeneralDate: Date | string;
    PONumber: number;
    Active: boolean;
    Selected: boolean;
    FiscalYear: number;
    FiscalPeriod: number;
}
