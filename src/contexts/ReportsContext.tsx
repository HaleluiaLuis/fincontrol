'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { reportsService } from '@/services';
import {
  FinancialMetrics,
  CashFlowData,
  CategoryAnalysis,
  MonthlyComparison,
  PaymentStatusReport,
  SupplierReport,
  InvoiceReport,
  DashboardData,
  ReportFilters,
} from '@/types/reports';

interface ReportsContextType {
  // Estados
  isLoading: boolean;
  loading: boolean; // Alias para isLoading (compatibilidade)
  error: string | null;
  
  // Dados de relatórios
  financialMetrics: FinancialMetrics | null;
  cashFlowData: CashFlowData[] | null;
  categoryAnalysis: CategoryAnalysis[] | null;
  monthlyComparison: MonthlyComparison[] | null;
  paymentStatusReport: PaymentStatusReport | null;
  supplierReports: SupplierReport[] | null;
  invoiceReport: InvoiceReport | null;
  dashboardData: DashboardData | null;
  
  // Filtros ativos
  activeFilters: ReportFilters;
  
  // Ações
  generateFinancialReport: (filters: ReportFilters) => Promise<void>;
  generateCashFlowReport: (filters: ReportFilters) => Promise<void>;
  generateCategoryReport: (filters: ReportFilters) => Promise<void>;
  generateMonthlyComparison: (filters: ReportFilters) => Promise<void>;
  generatePaymentStatusReport: (filters: ReportFilters) => Promise<void>;
  generateSupplierReport: (filters: ReportFilters, page?: number) => Promise<void>;
  generateInvoiceReport: (filters: ReportFilters, page?: number) => Promise<void>;
  generateDashboardReport: (filters: ReportFilters) => Promise<void>;
  refreshData: () => Promise<void>; // Função para recarregar dados
  exportReport: (
    data: DashboardData,
    options: {
      format: 'pdf' | 'excel' | 'csv';
      includeCharts?: boolean;
      includeDetails?: boolean;
      template?: string;
    }
  ) => Promise<string>;
  getFinancialMetrics: () => FinancialMetrics | null; // Getter para métricas
  setActiveFilters: (filters: ReportFilters) => void;
  clearError: () => void;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

interface ReportsProviderProps {
  children: ReactNode;
}

export function ReportsProvider({ children }: ReportsProviderProps) {
  // Estados
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Dados de relatórios
  const [financialMetrics, setFinancialMetrics] = useState<FinancialMetrics | null>(null);
  const [cashFlowData, setCashFlowData] = useState<CashFlowData[] | null>(null);
  const [categoryAnalysis, setCategoryAnalysis] = useState<CategoryAnalysis[] | null>(null);
  const [monthlyComparison, setMonthlyComparison] = useState<MonthlyComparison[] | null>(null);
  const [paymentStatusReport, setPaymentStatusReport] = useState<PaymentStatusReport | null>(null);
  const [supplierReports, setSupplierReports] = useState<SupplierReport[] | null>(null);
  const [invoiceReport, setInvoiceReport] = useState<InvoiceReport | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  
  // Filtros ativos
  const [activeFilters, setActiveFilters] = useState<ReportFilters>({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(),
  });

  // Função auxiliar para tratamento de erros
  const handleApiCall = async <T,>(
    apiCall: () => Promise<{ success: boolean; data: T; error?: string }>,
    onSuccess: (data: T) => void,
    errorContext: string
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiCall();
      if (response.success && response.data) {
        onSuccess(response.data);
      } else {
        throw new Error(response.error || `Erro ao ${errorContext}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Erro ao ${errorContext}`;
      setError(errorMessage);
      console.error(`${errorContext}:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  // Gerar relatório financeiro
  const generateFinancialReport = async (filters: ReportFilters) => {
    await handleApiCall(
      () => reportsService.getFinancialReport(filters),
      (data) => setFinancialMetrics(data),
      'gerar relatório financeiro'
    );
  };

  // Gerar relatório de fluxo de caixa
  const generateCashFlowReport = async (filters: ReportFilters) => {
    await handleApiCall(
      () => reportsService.getCashFlowReport(filters),
      (data) => setCashFlowData(data),
      'gerar relatório de fluxo de caixa'
    );
  };

  // Gerar análise de categorias
  const generateCategoryReport = async (filters: ReportFilters) => {
    await handleApiCall(
      () => reportsService.getCategoryAnalysis(filters),
      (data) => setCategoryAnalysis(data),
      'gerar análise de categorias'
    );
  };

  // Gerar comparação mensal
  const generateMonthlyComparison = async (filters: ReportFilters) => {
    await handleApiCall(
      () => reportsService.getMonthlyComparison(filters),
      (data) => setMonthlyComparison(data),
      'gerar comparação mensal'
    );
  };

  // Gerar relatório de status de pagamentos
  const generatePaymentStatusReport = async (filters: ReportFilters) => {
    await handleApiCall(
      () => reportsService.getPaymentStatusReport(filters),
      (data) => setPaymentStatusReport(data),
      'gerar relatório de status de pagamentos'
    );
  };

  // Gerar relatório de fornecedores
  const generateSupplierReport = async (filters: ReportFilters, page: number = 1) => {
    await handleApiCall(
      () => reportsService.getSupplierReport(filters, page, 10),
      (data) => setSupplierReports(data.data),
      'gerar relatório de fornecedores'
    );
  };

  // Gerar relatório de faturas
  const generateInvoiceReport = async (filters: ReportFilters, page: number = 1) => {
    await handleApiCall(
      () => reportsService.getInvoiceReport(filters, page, 10),
      (data) => setInvoiceReport(data.data[0] || null), // Assumindo que retorna uma lista mas queremos apenas o primeiro
      'gerar relatório de faturas'
    );
  };

  // Gerar dashboard consolidado
  const generateDashboardReport = async (filters: ReportFilters) => {
    await handleApiCall(
      () => reportsService.getDashboardData(filters),
      (data) => setDashboardData(data),
      'gerar dados do dashboard'
    );
  };

  // Exportar relatório
  const exportReport = async (
    data: DashboardData,
    options: {
      format: 'pdf' | 'excel' | 'csv';
      includeCharts?: boolean;
      includeDetails?: boolean;
      template?: string;
    }
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const blob = await reportsService.exportReport(
        'financial',
        options.format,
        activeFilters
      );
      
      // Criar URL do blob e fazer download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fileName = `relatorio-dashboard-${Date.now()}.${options.format}`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return fileName;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao exportar relatório';
      setError(errorMessage);
      console.error('Erro ao exportar relatório:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Limpar erro
  const clearError = () => {
    setError(null);
  };

  // Função para recarregar dados do dashboard
  const refreshData = async () => {
    await generateDashboardReport(activeFilters);
  };

  // Getter para métricas financeiras
  const getFinancialMetrics = () => financialMetrics;

  const value = {
    // Estados
    isLoading,
    loading: isLoading, // Alias para compatibilidade
    error,
    
    // Dados
    financialMetrics,
    cashFlowData,
    categoryAnalysis,
    monthlyComparison,
    paymentStatusReport,
    supplierReports,
    invoiceReport,
    dashboardData,
    
    // Filtros
    activeFilters,
    
    // Ações
    generateFinancialReport,
    generateCashFlowReport,
    generateCategoryReport,
    generateMonthlyComparison,
    generatePaymentStatusReport,
    generateSupplierReport,
    generateInvoiceReport,
    generateDashboardReport,
    refreshData,
    exportReport,
    getFinancialMetrics,
    setActiveFilters,
    clearError,
  };

  return (
    <ReportsContext.Provider value={value}>
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
}
