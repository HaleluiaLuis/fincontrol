import type {
	FinancialSummaryReport,
	InvoicesStatusSummaryReport,
	CategoryBreakdownReport,
	SuppliersSummaryReport,
	MonthlyComparisonReport,
	CashFlowReport,
	DashboardSnapshotReport,
	ScheduleUpcomingReport,
	PaymentStatusSummaryReport
} from './reports';

export interface ReportsApi {
	getFinancialSummary: () => Promise<FinancialSummaryReport>;
	getInvoicesStatusSummary: () => Promise<InvoicesStatusSummaryReport>;
	getCategoryBreakdown: () => Promise<CategoryBreakdownReport>;
	getSuppliersSummary: () => Promise<SuppliersSummaryReport>;
	getMonthlyComparison: (year?: number) => Promise<MonthlyComparisonReport>;
	getCashFlow: (year?: number) => Promise<CashFlowReport>;
	getDashboardSnapshot: () => Promise<DashboardSnapshotReport>;
	getScheduleUpcoming: (limit?: number) => Promise<ScheduleUpcomingReport>;
	getPaymentStatusSummary: () => Promise<PaymentStatusSummaryReport>;
}

