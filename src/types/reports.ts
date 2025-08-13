// Tipos para o sistema de relatórios
export interface ReportPeriod {
  startDate: Date;
  endDate: Date;
  label: string;
}

export interface FinancialMetrics {
  totalReceita: number;
  totalDespesas: number;
  saldoLiquido: number;
  crescimentoReceita: number;
  crescimentoDespesas: number;
  margemLiquida: number;
  ticketMedio: number;
  numeroTransacoes: number;
}

export interface CashFlowData {
  date: string;
  receitas: number;
  despesas: number;
  saldoAcumulado: number;
  saldoDiario: number;
}

export interface CategoryAnalysis {
  category: string;
  amount: number;
  percentage: number;
  transactions: number;
  averageAmount: number;
  color: string;
}

export interface MonthlyComparison {
  month: string;
  year: number;
  receitas: number;
  despesas: number;
  saldoLiquido: number;
  crescimento: number;
}

export interface PaymentStatusReport {
  status: string;
  count: number;
  amount: number;
  percentage: number;
  color: string;
}

export interface SupplierReport {
  supplierId: string;
  supplierName: string;
  totalAmount: number;
  transactionCount: number;
  averageAmount: number;
  lastTransaction: Date;
  status: 'ATIVO' | 'INATIVO';
}

export interface InvoiceReport {
  totalInvoices: number;
  pendingInvoices: number;
  approvedInvoices: number;
  rejectedInvoices: number;
  totalAmount: number;
  pendingAmount: number;
  approvedAmount: number;
  averageProcessingTime: number; // em dias
}

export interface ReportFilters {
  startDate?: Date;
  endDate?: Date;
  categories?: string[];
  suppliers?: string[];
  status?: string[];
  paymentMethods?: string[];
  minAmount?: number;
  maxAmount?: number;
  groupBy?: 'day' | 'week' | 'month' | 'quarter' | 'year';
}

export interface ExportOptions {
  format: 'PDF' | 'EXCEL' | 'CSV';
  includeCharts: boolean;
  includeDetails: boolean;
  template?: 'summary' | 'detailed' | 'executive';
}

export interface DashboardData {
  financialMetrics: FinancialMetrics;
  cashFlowData: CashFlowData[];
  categoryAnalysis: CategoryAnalysis[];
  monthlyComparison: MonthlyComparison[];
  paymentStatusReport: PaymentStatusReport[];
  supplierReport: SupplierReport[];
  invoiceReport: InvoiceReport;
  trends: {
    revenueGrowth: number[];
    expenseGrowth: number[];
    profitMargin: number[];
    labels: string[];
  };
}

export interface ReportGenerator {
  generateFinancialReport: (filters: ReportFilters) => Promise<DashboardData>;
  generateCashFlowReport: (filters: ReportFilters) => Promise<CashFlowData[]>;
  generateCategoryReport: (filters: ReportFilters) => Promise<CategoryAnalysis[]>;
  generateSupplierReport: (filters: ReportFilters) => Promise<SupplierReport[]>;
  generateInvoiceReport: (filters: ReportFilters) => Promise<InvoiceReport>;
  exportReport: (data: DashboardData, options: ExportOptions) => Promise<string>;
}

// Períodos pré-definidos
export const REPORT_PERIODS: ReportPeriod[] = [
  {
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(),
    label: 'Este Mês'
  },
  {
    startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
    label: 'Mês Passado'
  },
  {
    startDate: new Date(new Date().getFullYear(), 0, 1),
    endDate: new Date(),
    label: 'Este Ano'
  },
  {
    startDate: new Date(new Date().getFullYear() - 1, 0, 1),
    endDate: new Date(new Date().getFullYear() - 1, 11, 31),
    label: 'Ano Passado'
  },
  {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
    label: 'Últimos 30 Dias'
  },
  {
    startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
    label: 'Últimos 90 Dias'
  }
];

// Cores padrão para gráficos
export const CHART_COLORS = {
  primary: '#3B82F6',
  secondary: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#06B6D4',
  purple: '#8B5CF6',
  pink: '#EC4899',
  indigo: '#6366F1',
  gray: '#6B7280',
  emerald: '#059669'
};

export default DashboardData;
