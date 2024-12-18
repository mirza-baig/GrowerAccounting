export class BudgetItem {
  constructor(
    public Id: number,
    public PlantId: number,
    public LocationName: string,
    public DeptId: number,
    public GLDeptName: string,
    public DateCreated: Date,
    public CreatedBy: number,
    public ProjectName: string,
    public ProjectDescription: string,
    public EstAmount: number,
    public EstRoi: number,
    public EstQtr: number,
    public Class: number,
    public FiscalYr: number,
    public ProjectType: number,
    public Status: string,
    public Designation: string,
    public Approval: string,
    public ReviewedBy: number,
    public ReviewDate: Date,
    public ReviewComments: string,
    public EndFiscalYr: number,
    public EndQuarter: number,
    public Priority: number,
    public Cojob: number
  ) {}
}
