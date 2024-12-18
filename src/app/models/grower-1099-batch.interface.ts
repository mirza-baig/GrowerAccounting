import { IGrower1099Item } from './grower-1099-item.interface';

export interface IGrower1099VM {
    id: number;
    submittedBy: string;
    submittedDate: Date | string;

    growerItems: IGrower1099Item[];
}
