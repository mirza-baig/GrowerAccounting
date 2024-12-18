export interface IReport {
  Name: string;
  Url: string;
  Roles: string;
}

export interface IReportCategory {
  Category: string;
  Reports: IReport[];
}
