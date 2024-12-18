import { IGrowerMaster } from './grower-master.interface';

export interface IRelatedGrowerDetail {
    id: number;
    growerRelationId: number;
    growerId: number;
    vendorId: number;
    growerName: string;
    grower: IGrowerMaster;
    isVendorRelation: boolean;
}
