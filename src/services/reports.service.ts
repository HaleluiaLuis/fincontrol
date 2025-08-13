import { apiService, ApiResponse, PaginatedResponse } from './api';
import {
  FinancialMetrics,
  CashFlowData,
  CategoryAnalysis,
  MonthlyComparison,
  PaymentStatusReport,
  SupplierReport,
  InvoiceReport,
  DashboardData,
  ReportFilters
} from '@/types/reports';

// Utilitário para converter filtros para parâmetros de query string
function filtersToParams(filters: ReportFilters): Record<string, string> {
  const params: Record<string, string> = {};
  
  if (filters.startDate) {
    params.startDate = filters.startDate.toISOString().split('T')[0];
  }
  if (filters.endDate) {
    params.endDate = filters.endDate.toISOString().split('T')[0];
  }
  if (filters.categories?.length) {
    params.categories = filters.categories.join(',');
  }
  if (filters.suppliers?.length) {
    params.suppliers = filters.suppliers.join(',');
  }
  if (filters.status?.length) {
    params.status = filters.status.join(',');
  }
  if (filters.paymentMethods?.length) {
    params.paymentMethods = filters.paymentMethods.join(',');
  }
  
  return params;
}

export class ReportsService {
  private readonly baseEndpoint = '/reports';

  // Relatório financeiro consolidado
  async getFinancialReport(filters: ReportFilters): Promise<ApiResponse<FinancialMetrics>> {
    return apiService.get<FinancialMetrics>(`${this.baseEndpoint}/financial`, filtersToParams(filters));
  }

  // Fluxo de caixa
  async getCashFlowReport(filters: ReportFilters): Promise<ApiResponse<CashFlowData[]>> {
    return apiService.get<CashFlowData[]>(`${this.baseEndpoint}/cash-flow`, filtersToParams(filters));
  }

  // Análise por categorias
  async getCategoryAnalysis(filters: ReportFilters): Promise<ApiResponse<CategoryAnalysis[]>> {
    return apiService.get<CategoryAnalysis[]>(`${this.baseEndpoint}/categories`, filtersToParams(filters));
  }

  // Comparação mensal
  async getMonthlyComparison(filters: ReportFilters): Promise<ApiResponse<MonthlyComparison[]>> {
    return apiService.get<MonthlyComparison[]>(`${this.baseEndpoint}/monthly-comparison`, filtersToParams(filters));
  }

  // Status de pagamentos
  async getPaymentStatusReport(filters: ReportFilters): Promise<ApiResponse<PaymentStatusReport>> {
    return apiService.get<PaymentStatusReport>(`${this.baseEndpoint}/payment-status`, filtersToParams(filters));
  }

  // Relatório de fornecedores
  async getSupplierReport(
    filters: ReportFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<PaginatedResponse<SupplierReport>>> {
    const params = {
      ...filtersToParams(filters),
      page: page.toString(),
      limit: limit.toString(),
    };
    return apiService.get<PaginatedResponse<SupplierReport>>(`${this.baseEndpoint}/suppliers`, params);
  }

  // Relatório de faturas
  async getInvoiceReport(
    filters: ReportFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<PaginatedResponse<InvoiceReport>>> {
    const params = {
      ...filtersToParams(filters),
      page: page.toString(),
      limit: limit.toString(),
    };
    return apiService.get<PaginatedResponse<InvoiceReport>>(`${this.baseEndpoint}/invoices`, params);
  }

  // Dashboard consolidado
  async getDashboardData(filters: ReportFilters): Promise<ApiResponse<DashboardData>> {
    return apiService.get<DashboardData>(`${this.baseEndpoint}/dashboard`, filtersToParams(filters));
  }

  // Exportar relatórios
  async exportReport(
    type: 'financial' | 'cash-flow' | 'categories' | 'suppliers' | 'invoices',
    format: 'pdf' | 'excel' | 'csv',
    filters: ReportFilters
  ): Promise<Blob> {
    const params = {
      type,
      format,
      ...filtersToParams(filters),
    };

    const response = await fetch(`${apiService['baseUrl']}${this.baseEndpoint}/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...apiService['headers'],
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Erro ao exportar relatório');
    }

    return response.blob();
  }

  // Agendar relatório automático
  async scheduleReport(config: {
    type: 'financial' | 'cash-flow' | 'categories' | 'suppliers' | 'invoices';
    frequency: 'daily' | 'weekly' | 'monthly';
    format: 'pdf' | 'excel' | 'csv';
    email: string;
    filters: ReportFilters;
  }): Promise<ApiResponse<{ scheduledId: string }>> {
    return apiService.post<{ scheduledId: string }>(`${this.baseEndpoint}/schedule`, config);
  }

  // Obter relatórios agendados
  async getScheduledReports(): Promise<ApiResponse<{
    id: string;
    type: string;
    frequency: string;
    format: string;
    email: string;
    nextRun: string;
    isActive: boolean;
  }[]>> {
    return apiService.get<{
      id: string;
      type: string;
      frequency: string;
      format: string;
      email: string;
      nextRun: string;
      isActive: boolean;
    }[]>(`${this.baseEndpoint}/scheduled`);
  }

  // Cancelar relatório agendado
  async cancelScheduledReport(scheduledId: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.delete<{ success: boolean }>(`${this.baseEndpoint}/scheduled/${scheduledId}`);
  }
}

// Instância global do serviço de relatórios
export const reportsService = new ReportsService();
