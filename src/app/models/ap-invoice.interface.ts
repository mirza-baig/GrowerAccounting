export interface IApInvoice {
    id: number;
    company: number | null;
    vendorId: number | null;
    payDate: Date | string | null;
    account: number | null;
    invoiceDate: Date | string | null;
    amount: number | null;
    invoiceNumber: string;
    description: string;
    remittanceNote: string;
    separateCheck: boolean | null;
    growerId: number;
    apvoucherId: number;
    status: string;
    batchId: number;
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
