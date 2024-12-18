export interface IWorkflowActionHistory {
    id: number;
    invoicePaymentRequestId: number;
    workflowContactId: number;
    stage: string;
    actionTaken: string;
    comment: string;
    date: Date | string | null;
}
