'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Invoice,
  CreateInvoiceData,
  UpdateInvoiceData,
  InvoiceFilters,
  InvoiceStats,
  InvoiceStatus,
  InvoiceWorkflow
} from '@/types/invoice';
import { useAuth } from './AuthContext';
import { invoicesService } from '@/services/invoices.service';
import { getErrorMessage } from '@/lib/utils';

interface InvoicesContextType {
  // Estado
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
  
  // Dados filtrados
  filteredInvoices: Invoice[];
  filters: InvoiceFilters;
  setFilters: (filters: InvoiceFilters) => void;
  clearFilters: () => void;
  
  // CRUD
  createInvoice: (data: CreateInvoiceData) => Promise<Invoice>;
  updateInvoice: (data: UpdateInvoiceData) => Promise<Invoice>;
  deleteInvoice: (id: string) => Promise<void>;
  getInvoice: (id: string) => Invoice | undefined;
  
  // Workflow
  validateInvoice: (id: string, notes?: string) => Promise<void>;
  approveForPayment: (id: string, notes?: string) => Promise<void>;
  markAsPaid: (id: string, paymentData: { amount: number; reference: string; date: Date }) => Promise<void>;
  contestInvoice: (id: string, reason: string) => Promise<void>;
  
  // Utilitários
  generateFromPaymentRequest: () => Promise<Invoice>;
  generateInvoiceNumber: () => string;
  
  // Estatísticas e relatórios
  getStats: () => InvoiceStats;
  getWorkflow: (id: string) => InvoiceWorkflow | undefined;
  
  // Ações
  refreshInvoices: () => Promise<void>;
  canUserValidate: () => boolean;
  canUserApprovePayment: () => boolean;
  getOverdueInvoices: () => Invoice[];
  getInvoicesBySupplier: (supplierId: string) => Invoice[];
  
  // Relatórios
  exportToAccounting: () => Promise<void>;
  generateReport: () => Promise<unknown>;
}

const InvoicesContext = createContext<InvoicesContextType | undefined>(undefined);

export function InvoicesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<InvoiceFilters>({});

  // Carregar faturas via API
  const loadInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      // Por enquanto buscar todas as faturas sem paginação
      const response = await invoicesService.getInvoices(1, 1000);
      if (response.success && response.data) {
        setInvoices(response.data.data); // PaginatedResponse tem data.data
      } else {
        setError('Erro ao carregar faturas');
      }
    } catch (error) {
      console.error('Erro ao carregar faturas:', error);
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []); // Carregar inicialmente

  // Aplicar filtros
  const filteredInvoices = invoices.filter(invoice => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (
        !invoice.invoiceNumber.toLowerCase().includes(searchLower) &&
        !invoice.supplierName.toLowerCase().includes(searchLower) &&
        !invoice.supplierInvoiceNumber?.toLowerCase().includes(searchLower) &&
        !invoice.description?.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }
    
    if (filters.status && invoice.status !== filters.status) {
      return false;
    }
    
    if (filters.type && invoice.type !== filters.type) {
      return false;
    }
    
    if (filters.supplierId && invoice.supplierId !== filters.supplierId) {
      return false;
    }
    
    if (filters.paymentRequestId && invoice.paymentRequestId !== filters.paymentRequestId) {
      return false;
    }
    
    if (filters.issueDateFrom && invoice.issueDate < filters.issueDateFrom) {
      return false;
    }
    
    if (filters.issueDateTo && invoice.issueDate > filters.issueDateTo) {
      return false;
    }
    
    if (filters.dueDateFrom && invoice.dueDate < filters.dueDateFrom) {
      return false;
    }
    
    if (filters.dueDateTo && invoice.dueDate > filters.dueDateTo) {
      return false;
    }
    
    if (filters.amountMin && invoice.totalAmount < filters.amountMin) {
      return false;
    }
    
    if (filters.amountMax && invoice.totalAmount > filters.amountMax) {
      return false;
    }
    
    if (filters.isOverdue !== undefined && invoice.isOverdue !== filters.isOverdue) {
      return false;
    }
    
    if (filters.isPaid !== undefined && invoice.isPaid !== filters.isPaid) {
      return false;
    }
    
    if (filters.paymentTerm && invoice.paymentTerm !== filters.paymentTerm) {
      return false;
    }
    
    if (filters.createdBy && invoice.createdBy !== filters.createdBy) {
      return false;
    }
    
    if (filters.currentResponsible && invoice.currentResponsible !== filters.currentResponsible) {
      return false;
    }
    
    return true;
  });

  const createInvoice = async (data: CreateInvoiceData): Promise<Invoice> => {
    try {
      const response = await invoicesService.createInvoice(data);
      if (response.success && response.data) {
        setInvoices(prev => [...prev, response.data]);
        return response.data;
      } else {
        throw new Error(response.message || 'Erro ao criar fatura');
      }
    } catch (error) {
      console.error('Erro ao criar fatura:', error);
      setError(getErrorMessage(error));
      throw error;
    }
  };

  const updateInvoice = async (data: UpdateInvoiceData): Promise<Invoice> => {
    try {
      const response = await invoicesService.updateInvoice(data.id, data);
      if (response.success && response.data) {
        setInvoices(prev => prev.map(inv => inv.id === data.id ? response.data : inv));
        return response.data;
      } else {
        throw new Error(response.message || 'Erro ao atualizar fatura');
      }
    } catch (error) {
      console.error('Erro ao atualizar fatura:', error);
      setError(getErrorMessage(error));
      throw error;
    }
  };

  const deleteInvoice = async (id: string): Promise<void> => {
    try {
      const response = await invoicesService.deleteInvoice(id);
      if (response.success) {
        setInvoices(prev => prev.filter(inv => inv.id !== id));
      } else {
        throw new Error(response.message || 'Erro ao excluir fatura');
      }
    } catch (error) {
      console.error('Erro ao excluir fatura:', error);
      setError(getErrorMessage(error));
      throw error;
    }
  };

  const getInvoice = (id: string): Invoice | undefined => {
    return invoices.find(inv => inv.id === id);
  };

  const validateInvoice = async (id: string, notes?: string): Promise<void> => {
    try {
      const response = await invoicesService.approveInvoice(id, notes);
      if (response.success && response.data) {
        setInvoices(prev => prev.map(inv => inv.id === id ? response.data : inv));
      } else {
        throw new Error(response.message || 'Erro ao validar fatura');
      }
    } catch (error) {
      console.error('Erro ao validar fatura:', error);
      setError(getErrorMessage(error));
      throw error;
    }
  };

  const approveForPayment = async (id: string, notes?: string): Promise<void> => {
    try {
      const response = await invoicesService.approveInvoice(id, notes);
      if (response.success && response.data) {
        setInvoices(prev => prev.map(inv => inv.id === id ? response.data : inv));
      } else {
        throw new Error(response.message || 'Erro ao aprovar fatura');
      }
    } catch (error) {
      console.error('Erro ao aprovar fatura:', error);
      setError(getErrorMessage(error));
      throw error;
    }
  };

  const markAsPaid = async (id: string, paymentData: { amount: number; reference: string; date: Date }): Promise<void> => {
    try {
      // Usar o método de marcar como paga da API
      const response = await invoicesService.markAsPaid(id, paymentData.date, 'TRANSFERENCIA', paymentData.reference);
      if (response.success && response.data) {
        setInvoices(prev => prev.map(inv => inv.id === id ? response.data : inv));
      } else {
        throw new Error(response.message || 'Erro ao marcar fatura como paga');
      }
    } catch (error) {
      console.error('Erro ao marcar fatura como paga:', error);
      setError(getErrorMessage(error));
      throw error;
    }
  };

  const contestInvoice = async (id: string, reason: string): Promise<void> => {
    try {
      const response = await invoicesService.rejectInvoice(id, reason);
      if (response.success && response.data) {
        setInvoices(prev => prev.map(inv => inv.id === id ? response.data : inv));
      } else {
        throw new Error(response.message || 'Erro ao contestar fatura');
      }
    } catch (error) {
      console.error('Erro ao contestar fatura:', error);
      setError(getErrorMessage(error));
      throw error;
    }
  };

  const generateFromPaymentRequest = async (): Promise<Invoice> => {
    // TODO: Implementar geração automática a partir de solicitação
    throw new Error('Funcionalidade não implementada');
  };

  const generateInvoiceNumber = (): string => {
    const year = new Date().getFullYear();
    const nextNumber = invoices.length + 1;
    return `FT-${year}-${nextNumber.toString().padStart(3, '0')}`;
  };

  const clearFilters = () => {
    setFilters({});
  };

  const getStats = (): InvoiceStats => {
    const total = invoices.length;
    
    const byStatus = invoices.reduce((acc, invoice) => {
      acc[invoice.status] = (acc[invoice.status] || 0) + 1;
      return acc;
    }, {} as Record<InvoiceStatus, number>);

    const byType = invoices.reduce((acc, invoice) => {
      acc[invoice.type] = (acc[invoice.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
    const paidAmount = invoices.filter(inv => inv.isPaid).reduce((sum, invoice) => sum + invoice.totalAmount, 0);
    const pendingAmount = totalAmount - paidAmount;
    const overdueAmount = invoices.filter(inv => inv.isOverdue).reduce((sum, invoice) => sum + invoice.totalAmount, 0);

    const overdueInvoices = invoices.filter(inv => inv.isOverdue).length;
    const thisMonthInvoices = invoices.filter(inv => 
      inv.issueDate.getMonth() === new Date().getMonth() && 
      inv.issueDate.getFullYear() === new Date().getFullYear()
    ).length;
    const pendingValidation = invoices.filter(inv => 
      ['RECEBIDA', 'EM_VALIDACAO'].includes(inv.status)
    ).length;

    return {
      total,
      byStatus: byStatus as Record<InvoiceStatus, number>,
      byType: byType as Record<string, number>,
      totalAmount,
      paidAmount,
      pendingAmount,
      overdueAmount,
      averagePaymentTime: 25, // TODO: calcular real
      averageProcessingTime: 5, // TODO: calcular real
      overdueInvoices,
      thisMonthInvoices,
      pendingValidation,
      onTimePaymentRate: 85, // TODO: calcular real
      validationRate: 92 // TODO: calcular real
    };
  };

  const getWorkflow = (id: string): InvoiceWorkflow | undefined => {
    const invoice = invoices.find(inv => inv.id === id);
    if (!invoice) return undefined;

    const steps = [
      { id: 'created', title: 'Criada', description: 'Fatura registrada', status: 'COMPLETED' as const },
      { id: 'received', title: 'Recebida', description: 'Fatura recebida do fornecedor', status: 'COMPLETED' as const },
      { id: 'validated', title: 'Validada', description: 'Documentos validados', status: invoice.validatedDate ? 'COMPLETED' as const : 'IN_PROGRESS' as const },
      { id: 'approved', title: 'Aprovada', description: 'Aprovada para pagamento', status: invoice.approvedDate ? 'COMPLETED' as const : 'PENDING' as const },
      { id: 'paid', title: 'Paga', description: 'Pagamento executado', status: invoice.isPaid ? 'COMPLETED' as const : 'PENDING' as const }
    ];

    return {
      currentStep: steps.findIndex(step => step.status === 'IN_PROGRESS') + 1 || steps.filter(step => step.status === 'COMPLETED').length,
      totalSteps: steps.length,
      steps
    };
  };

  const refreshInvoices = async (): Promise<void> => {
    await loadInvoices();
  };

  const canUserValidate = (): boolean => {
    return user?.role === 'GABINETE_CONTRATACAO';
  };

  const canUserApprovePayment = (): boolean => {
    return user?.role === 'PRESIDENTE';
  };

  const getOverdueInvoices = (): Invoice[] => {
    return invoices.filter(inv => inv.isOverdue);
  };

  const getInvoicesBySupplier = (supplierId: string): Invoice[] => {
    return invoices.filter(inv => inv.supplierId === supplierId);
  };

  const exportToAccounting = async (): Promise<void> => {
    // TODO: Implementar exportação
  };

  const generateReport = async (): Promise<unknown> => {
    // TODO: Implementar geração de relatórios
    return {};
  };

  const value: InvoicesContextType = {
    invoices,
    loading,
    error,
    filters,
    filteredInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoice,
    validateInvoice,
    approveForPayment,
    markAsPaid,
    contestInvoice,
    generateFromPaymentRequest,
    generateInvoiceNumber,
    setFilters,
    clearFilters,
    getStats,
    getWorkflow,
    refreshInvoices,
    canUserValidate,
    canUserApprovePayment,
    getOverdueInvoices,
    getInvoicesBySupplier,
    exportToAccounting,
    generateReport
  };

  return (
    <InvoicesContext.Provider value={value}>
      {children}
    </InvoicesContext.Provider>
  );
}

export function useInvoices() {
  const context = useContext(InvoicesContext);
  if (context === undefined) {
    throw new Error('useInvoices must be used within an InvoicesProvider');
  }
  return context;
}
