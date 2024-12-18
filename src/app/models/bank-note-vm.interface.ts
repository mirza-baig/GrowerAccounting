export interface IBankNoteVM {
    Id: number;
    GrowerId: number;
    NoteType: string;
    NoteVendorNumber: number | null;
    NoteLoanNumber: string;
    NotePaymentAmount: number | null;
    NotePaymentCentsDoz: number | null;
    NotePaymentActual: number | null;
    NoteLastPaymentAmount: number | null;
    NotePrincipalAmount: number | null;
    TotalNotePayments: number | null;
    RemainingBalance: number | null;
}
