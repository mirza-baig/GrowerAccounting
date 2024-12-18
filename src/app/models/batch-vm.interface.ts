export interface IBatchVM {
    Id: number;
    BatchId: number;
    Batch: number;
    Description: string;
    CreatedBy: string;
    CreatedDate: Date | String | null;
    Total: number;
    Status: string;
    PostedBy: string;
    PostedDate: Date | String | null;
}
