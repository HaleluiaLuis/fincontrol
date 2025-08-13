'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { paymentsService } from '@/services/payments.service';
import { getErrorMessage } from '@/lib/utils';
import { 
  Payment, 
  CreatePaymentData, 
  UpdatePaymentData, 
  ProcessPaymentData,
  PaymentFilters,
  PaymentStats,
  BankAccount,
  CashFlowEntry,
  CashFlowReport
} from '@/types/payment';

interface PaymentsContextType {
  // Estado
  payments: Payment[];
  bankAccounts: BankAccount[];
  cashFlow: CashFlowEntry[];
  loading: boolean;
  error: string | null;
  
  // Filtros
  filters: PaymentFilters;
  filteredPayments: Payment[];
  
  // Ações CRUD
  createPayment: (data: CreatePaymentData) => Promise<Payment>;
  updatePayment: (data: UpdatePaymentData) => Promise<Payment>;
  deletePayment: (id: string) => Promise<void>;
  getPayment: (id: string) => Payment | undefined;
  
  // Ações de fluxo
  approvePayment: (id: string, comments?: string) => Promise<void>;
  rejectPayment: (id: string, reason: string, comments?: string) => Promise<void>;
  processPayment: (data: ProcessPaymentData) => Promise<void>;
  cancelPayment: (id: string, reason: string) => Promise<void>;
  schedulePayment: (id: string, scheduledDate: Date) => Promise<void>;
  
  // Contas bancárias
  createBankAccount: (data: Omit<BankAccount, 'id' | 'createdAt' | 'updatedAt'>) => Promise<BankAccount>;
  updateBankAccount: (data: Partial<BankAccount> & { id: string }) => Promise<BankAccount>;
  deleteBankAccount: (id: string) => Promise<void>;
  
  // Filtros
  setFilters: (filters: PaymentFilters) => void;
  clearFilters: () => void;
  
  // Relatórios
  generateCashFlowReport: (startDate: Date, endDate: Date) => Promise<CashFlowReport>;
  getStats: () => PaymentStats;
  getOverduePayments: () => Payment[];
  getScheduledPayments: () => Payment[];
  getTodaysPayments: () => Payment[];
  
  // Utilitários
  refreshPayments: () => Promise<void>;
  canUserApprovePayment: (paymentId: string) => boolean;
  canUserProcessPayment: (paymentId: string) => boolean;
  generatePaymentNumber: () => string;
  validatePaymentData: (data: CreatePaymentData) => string[];
  calculateTotalFees: (amount: number, paymentMethod: string) => number;
  simulateBankProcessing: (paymentId: string) => Promise<{ success: boolean; reference: string; fee: number }>;
}

const PaymentsContext = createContext<PaymentsContextType | undefined>(undefined);

interface PaymentsProviderProps {
  children: React.ReactNode;
}

const DEFAULT_FILTERS: PaymentFilters = {
  status: undefined,
  method: undefined,
  type: undefined,
  priority: undefined,
  dateFrom: undefined,
  dateTo: undefined,
  amountFrom: undefined,
  amountTo: undefined,
  supplierId: undefined,
  bankAccountId: undefined,
  search: '',
};

export function PaymentsProvider({ children }: PaymentsProviderProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [bankAccounts] = useState<BankAccount[]>([]);
  const [cashFlow] = useState<CashFlowEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PaymentFilters>(DEFAULT_FILTERS);

  // Carregar pagamentos via API
  const loadPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await paymentsService.getPayments(1, 1000, filters);
      if (response.success && response.data) {
        setPayments(response.data.data);
      } else {
        setError('Erro ao carregar pagamentos');
      }
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error);
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  // Criar pagamento
  const createPayment = useCallback(async (data: CreatePaymentData): Promise<Payment> => {
    try {
      setError(null);
      const response = await paymentsService.createPayment(data);
      if (response.success && response.data) {
        setPayments(prev => [response.data, ...prev]);
        return response.data;
      } else {
        throw new Error(response.message || 'Erro ao criar pagamento');
      }
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      setError(getErrorMessage(error));
      throw error;
    }
  }, []);

  // Atualizar pagamento
  const updatePayment = useCallback(async (data: UpdatePaymentData): Promise<Payment> => {
    try {
      setError(null);
      const response = await paymentsService.updatePayment(data.id, data);
      if (response.success && response.data) {
        setPayments(prev => prev.map(payment => payment.id === data.id ? response.data : payment));
        return response.data;
      } else {
        throw new Error(response.message || 'Erro ao atualizar pagamento');
      }
    } catch (error) {
      console.error('Erro ao atualizar pagamento:', error);
      setError(getErrorMessage(error));
      throw error;
    }
  }, []);

  // Deletar pagamento
  const deletePayment = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      const response = await paymentsService.deletePayment(id);
      if (response.success) {
        setPayments(prev => prev.filter(payment => payment.id !== id));
      } else {
        throw new Error(response.message || 'Erro ao deletar pagamento');
      }
    } catch (error) {
      console.error('Erro ao deletar pagamento:', error);
      setError(getErrorMessage(error));
      throw error;
    }
  }, []);

  // Buscar pagamento por ID
  const getPayment = useCallback((id: string): Payment | undefined => {
    return payments.find(payment => payment.id === id);
  }, [payments]);

  // Aprovar pagamento
  const approvePayment = useCallback(async (id: string, comments?: string): Promise<void> => {
    try {
      setError(null);
      const response = await paymentsService.approvePayment(id, comments);
      if (response.success && response.data) {
        setPayments(prev => prev.map(payment => payment.id === id ? response.data : payment));
      } else {
        throw new Error(response.message || 'Erro ao aprovar pagamento');
      }
    } catch (error) {
      console.error('Erro ao aprovar pagamento:', error);
      setError(getErrorMessage(error));
      throw error;
    }
  }, []);

  // Rejeitar pagamento
  const rejectPayment = useCallback(async (id: string, reason: string, comments?: string): Promise<void> => {
    try {
      setError(null);
      const response = await paymentsService.rejectPayment(id, reason, comments);
      if (response.success && response.data) {
        setPayments(prev => prev.map(payment => payment.id === id ? response.data : payment));
      } else {
        throw new Error(response.message || 'Erro ao rejeitar pagamento');
      }
    } catch (error) {
      console.error('Erro ao rejeitar pagamento:', error);
      setError(getErrorMessage(error));
      throw error;
    }
  }, []);

  // Processar pagamento
  const processPayment = useCallback(async (data: ProcessPaymentData): Promise<void> => {
    try {
      setError(null);
      const response = await paymentsService.processPayment(data.paymentId, data.externalReference || '', data.processedDate);
      if (response.success && response.data) {
        setPayments(prev => prev.map(payment => payment.id === data.paymentId ? response.data : payment));
      } else {
        throw new Error(response.message || 'Erro ao processar pagamento');
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      setError(getErrorMessage(error));
      throw error;
    }
  }, []);

  // Cancelar pagamento
  const cancelPayment = useCallback(async (id: string, reason: string): Promise<void> => {
    try {
      setError(null);
      const response = await paymentsService.cancelPayment(id, reason);
      if (response.success && response.data) {
        setPayments(prev => prev.map(payment => payment.id === id ? response.data : payment));
      } else {
        throw new Error(response.message || 'Erro ao cancelar pagamento');
      }
    } catch (error) {
      console.error('Erro ao cancelar pagamento:', error);
      setError(getErrorMessage(error));
      throw error;
    }
  }, []);

  // Agendar pagamento
  const schedulePayment = useCallback(async (id: string, scheduledDate: Date): Promise<void> => {
    try {
      setError(null);
      const response = await paymentsService.schedulePayment(id, scheduledDate);
      if (response.success && response.data) {
        setPayments(prev => prev.map(payment => payment.id === id ? response.data : payment));
      } else {
        throw new Error(response.message || 'Erro ao agendar pagamento');
      }
    } catch (error) {
      console.error('Erro ao agendar pagamento:', error);
      setError(getErrorMessage(error));
      throw error;
    }
  }, []);

  // Contas bancárias
  const createBankAccount = async (data: Omit<BankAccount, 'id' | 'createdAt' | 'updatedAt'>): Promise<BankAccount> => {
    // Mock implementation - substituir pela API real quando disponível
    console.log('Creating bank account:', data);
    throw new Error('Função não implementada ainda');
  };

  const updateBankAccount = async (data: Partial<BankAccount> & { id: string }): Promise<BankAccount> => {
    // Mock implementation - substituir pela API real quando disponível
    console.log('Updating bank account:', data);
    throw new Error('Função não implementada ainda');
  };

  const deleteBankAccount = async (id: string): Promise<void> => {
    // Mock implementation - substituir pela API real quando disponível
    console.log('Deleting bank account:', id);
    throw new Error('Função não implementada ainda');
  };

  // Filtros
  const updateFilters = useCallback((newFilters: PaymentFilters) => {
    setFilters(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // Aplicar filtros
  const filteredPayments = React.useMemo(() => {
    let filtered = payments;

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(payment => 
        payment.paymentNumber.toLowerCase().includes(searchTerm) ||
        payment.description?.toLowerCase().includes(searchTerm) ||
        payment.supplierName?.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.status?.length) {
      filtered = filtered.filter(payment => filters.status!.includes(payment.status));
    }

    if (filters.method?.length) {
      filtered = filtered.filter(payment => filters.method!.includes(payment.paymentMethod));
    }

    if (filters.type?.length) {
      filtered = filtered.filter(payment => filters.type!.includes(payment.type));
    }

    if (filters.priority?.length) {
      filtered = filtered.filter(payment => filters.priority!.includes(payment.priority));
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(payment => new Date(payment.createdAt) >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      filtered = filtered.filter(payment => new Date(payment.createdAt) <= filters.dateTo!);
    }

    if (filters.amountFrom !== undefined) {
      filtered = filtered.filter(payment => payment.amount >= filters.amountFrom!);
    }

    if (filters.amountTo !== undefined) {
      filtered = filtered.filter(payment => payment.amount <= filters.amountTo!);
    }

    if (filters.supplierId) {
      filtered = filtered.filter(payment => payment.supplierId === filters.supplierId);
    }

    if (filters.bankAccountId) {
      filtered = filtered.filter(payment => payment.sourceAccount.id === filters.bankAccountId);
    }

    return filtered;
  }, [payments, filters]);

  // Relatórios e estatísticas
  const generateCashFlowReport = useCallback(async (startDate: Date, endDate: Date): Promise<CashFlowReport> => {
    // Mock implementation - substituir pela API real quando disponível
    console.log('Generating cash flow report:', { startDate, endDate });
    throw new Error('Função não implementada ainda');
  }, []);

  const getStats = useCallback((): PaymentStats => {
    const totalPayments = payments.length;
    
    return {
      totalPayments,
      pendingPayments: payments.filter(p => p.status === 'PENDENTE').length,
      processedPayments: payments.filter(p => p.status === 'PROCESSADO').length,
      failedPayments: payments.filter(p => p.status === 'FALHADO').length,
      totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
      pendingAmount: payments.filter(p => p.status === 'PENDENTE').reduce((sum, p) => sum + p.amount, 0),
      processedAmount: payments.filter(p => p.status === 'PROCESSADO').reduce((sum, p) => sum + p.amount, 0),
      averageAmount: totalPayments > 0 ? payments.reduce((sum, p) => sum + p.amount, 0) / totalPayments : 0,
      overduePayments: payments.filter(p => p.isOverdue).length,
      scheduledPayments: payments.filter(p => p.status === 'AGENDADO').length,
    };
  }, [payments]);

  const getOverduePayments = useCallback((): Payment[] => {
    return payments.filter(payment => payment.isOverdue);
  }, [payments]);

  const getScheduledPayments = useCallback((): Payment[] => {
    return payments.filter(payment => payment.status === 'AGENDADO');
  }, [payments]);

  const getTodaysPayments = useCallback((): Payment[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return payments.filter(payment => {
      const paymentDate = payment.scheduledDate || payment.createdAt;
      return paymentDate >= today && paymentDate < tomorrow;
    });
  }, [payments]);

  const refreshPayments = async (): Promise<void> => {
    await loadPayments();
  };

  const canUserApprovePayment = (paymentId: string): boolean => {
    console.log('Checking approval permission for payment:', paymentId);
    return true; // Mock - implementar lógica real de permissões
  };

  const canUserProcessPayment = (paymentId: string): boolean => {
    console.log('Checking processing permission for payment:', paymentId);
    return true; // Mock - implementar lógica real de permissões
  };

  const generatePaymentNumber = (): string => {
    const year = new Date().getFullYear();
    const nextNumber = payments.length + 1;
    return `PAY-${year}-${nextNumber.toString().padStart(6, '0')}`;
  };

  const validatePaymentData = (data: CreatePaymentData): string[] => {
    const errors: string[] = [];
    
    if (!data.amount || data.amount <= 0) {
      errors.push('Valor deve ser maior que zero');
    }
    
    if (!data.supplierId) {
      errors.push('Fornecedor é obrigatório');
    }
    
    if (!data.paymentMethod) {
      errors.push('Método de pagamento é obrigatório');
    }
    
    return errors;
  };

  const calculateTotalFees = (amount: number, paymentMethod: string): number => {
    // Mock implementation - calcular taxas baseadas no método de pagamento
    console.log('Calculating fees for:', { amount, paymentMethod });
    const baseFee = amount * 0.001; // 0.1%
    return baseFee;
  };

  const simulateBankProcessing = async (paymentId: string): Promise<{ success: boolean; reference: string; fee: number }> => {
    console.log('Simulating bank processing for payment:', paymentId);
    // Simula processamento bancário
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const success = Math.random() > 0.1; // 90% de sucesso
    const reference = `TXN-${Date.now()}`;
    const fee = Math.random() * 100;
    
    return { success, reference, fee };
  };

  const value: PaymentsContextType = {
    // Estado
    payments,
    bankAccounts,
    cashFlow,
    loading,
    error,
    
    // Filtros
    filters,
    filteredPayments,
    
    // Ações CRUD
    createPayment,
    updatePayment,
    deletePayment,
    getPayment,
    
    // Ações de fluxo
    approvePayment,
    rejectPayment,
    processPayment,
    cancelPayment,
    schedulePayment,
    
    // Contas bancárias
    createBankAccount,
    updateBankAccount,
    deleteBankAccount,
    
    // Filtros
    setFilters: updateFilters,
    clearFilters,
    
    // Relatórios
    generateCashFlowReport,
    getStats,
    getOverduePayments,
    getScheduledPayments,
    getTodaysPayments,
    
    // Utilitários
    refreshPayments,
    canUserApprovePayment,
    canUserProcessPayment,
    generatePaymentNumber,
    validatePaymentData,
    calculateTotalFees,
    simulateBankProcessing,
  };

  return (
    <PaymentsContext.Provider value={value}>
      {children}
    </PaymentsContext.Provider>
  );
}

export function usePayments() {
  const context = useContext(PaymentsContext);
  if (context === undefined) {
    throw new Error('usePayments must be used within a PaymentsProvider');
  }
  return context;
}
