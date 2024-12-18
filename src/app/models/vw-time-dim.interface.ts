

export interface IVwTimeDim {
	dateFieldale: number;
	dateStandard: string;
	fiscalMonth: string;
	fiscalYear: number | null;
	ffJulian: number | null;
	ffGreg: number | null;
	dayOfWeek: string;
	generalDate: Date | string | null;
	calendarYear: number | null;
	fiscalCalendarYear: number | null;
	weekEndingDate: Date | string | null;
	qtrGreg: string;
	qtrFiscal: string;
	fiscalPeriodNo: number | null;
	productionDaysInPeriod: number | null;
	fiscalMonthJulian: number | null;
	totalDaysInPeriod: number | null;
	dayOfFiscalMonth: number | null;
	weekStartingDate: Date | string | null;
	dayOfFiscalYear: number | null;
	weekOfFiscalYear: number | null;
}


