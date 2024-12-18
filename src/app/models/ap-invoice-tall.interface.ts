export interface IApInvoiceTall {
    Id: number;
    Company: number | null;
    VendorId: number | null;
    PayDate: Date | string | null;
    Account: number | null;
    InvoiceDate: Date | string | null;
    Amount: number | null;
    InvoiceNumber: string;
    Description: string;
    RemittanceNote: string;
    SeparateCheck: boolean | null;
    GrowerId: number;
    ApvoucherId: number;
    Status: string;
    GrowerName: string;
    payTo: string;
}

/*
 public int Id { get; set; }
        public int? Company { get; set; }
        public int? VendorId { get; set; }
        public DateTime? PayDate { get; set; }
        public int? GrowerId { get; set; }
        public int? Account { get; set; }
        public DateTime? InvoiceDate { get; set; }
        public decimal? Amount { get; set; }
        public string InvoiceNumber { get; set; }
        public string Description { get; set; }
        public string RemittanceNote { get; set; }
        public bool? SeparateCheck { get; set; }
        public int? ApvoucherId { get; set; }
        public string Status { get; set; }
*/
