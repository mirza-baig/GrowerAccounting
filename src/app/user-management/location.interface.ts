import { IDepartment } from './department.interface';

export interface ILocation {
    id: number;
    name: string;
    description: string;
    departmentList: IDepartment[];
}
