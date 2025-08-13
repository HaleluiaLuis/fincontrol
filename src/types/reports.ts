// Tipos para utilitários de relatórios

export interface FinancialSummaryReport {
	period: string;
	totalReceitas: number;
	totalDespesas: number;
	saldo: number;
}

export interface InvoicesStatusSummaryReport {
	total: number;
	statuses: Record<string, { count:number; amount:number }>; 
}

export interface CategoryBreakdownItem { id:string; name:string; type:string; total:number; }
export type CategoryBreakdownReport = CategoryBreakdownItem[];

export interface SuppliersSummaryItem { id:string; name:string; totalInvoices:number; totalAmount:number; }
export type SuppliersSummaryReport = SuppliersSummaryItem[];

export interface MonthlyComparisonItem { month:string; receitas:number; despesas:number; }
export type MonthlyComparisonReport = MonthlyComparisonItem[];

export interface CashFlowItem extends MonthlyComparisonItem { saldo:number; }
export type CashFlowReport = CashFlowItem[];

export interface DashboardSnapshotReport {
	financial: FinancialSummaryReport;
	invoices: InvoicesStatusSummaryReport;
	categories: CategoryBreakdownReport;
	suppliers: SuppliersSummaryReport;
	cashFlow: CashFlowReport;
}

export interface ScheduleUpcomingItem { id:string; invoiceNumber:string; dueDate:string; amount:number; status:string; }
export type ScheduleUpcomingReport = ScheduleUpcomingItem[];

export interface PaymentStatusSummaryReport {
	total: number;
	counts: { pendentes:number; aprovadas:number; pagas:number; vencidas:number; rejeitadas:number; canceladas:number };
	valores: { pendentes:number; aprovadas:number; pagas:number; vencidas:number };
	updatedAt: string;
}

