export interface IWorkflowContact {
    id: number;
    firstName: string;
    lastName: string;
    stage: string;
    isActive: boolean | null;
    email: string;
}
