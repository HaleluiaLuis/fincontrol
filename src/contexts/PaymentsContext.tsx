'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { paymentsService } from '@/services/payments.service';
import { getErrorMessage } from '@/lib/utils';
import { 
  Payment, 
  BankAccount, 
  CashFlowEntry,
  PaymentFilters,
  PaymentStats,
  PaymentWorkflow,
  CreatePaymentData,
  UpdatePaymentData,
  ProcessPaymentData,
  CashFlowReport
} from '@/types/payment';

interface PaymentsContextTyp  const simulateBankProcessing = async (paymentId: string): Promise<{ success: boolean; reference: string; fee: number }> => {
    console.log('Simulating bank processing for payment:', paymentId);
    // Simula processamento bancário{
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
  
  // Ações específicas de pagamento
  schedulePayment: (id: string, scheduledDate: Date) => Promise<void>;
  processPayment: (data: ProcessPaymentData) => Promise<void>;
  cancelPayment: (id: string, reason: string) => Promise<void>;
  revertPayment: (id: string, reason: string) => Promise<void>;
  
  // Aprovações
  approvePayment: (id: string, notes?: string) => Promise<void>;
  rejectPayment: (id: string, reason: string) => Promise<void>;
  
  // Contas bancárias
  createBankAccount: (data: Omit<BankAccount, 'id' | 'createdAt' | 'updatedAt'>) => Promise<BankAccount>;
  updateBankAccount: (data: Partial<BankAccount> & { id: string }) => Promise<BankAccount>;
  deleteBankAccount: (id: string) => Promise<void>;
  getBankAccount: (id: string) => BankAccount | undefined;
  
  // Fluxo de caixa
  getCashFlowReport: (startDate: Date, endDate: Date) => CashFlowReport;
  addCashFlowEntry: (entry: Omit<CashFlowEntry, 'id' | 'createdAt'>) => Promise<CashFlowEntry>;
  
  // Filtros e busca
  setFilters: (filters: PaymentFilters) => void;
  clearFilters: () => void;
  
  // Estatísticas
  getStats: () => PaymentStats;
  getWorkflow: (id: string) => PaymentWorkflow | undefined;
  
  // Utilitários
  refreshPayments: () => Promise<void>;
  canUserApprovePayment: (paymentId: string) => boolean;
  canUserProcessPayment: (paymentId: string) => boolean;
  generatePaymentNumber: () => string;
  getOverduePayments: () => Payment[];
  getScheduledPayments: () => Payment[];
  getTodaysPayments: () => Payment[];
  
  // Simulação bancária
  simulateBankProcessing: (paymentId: string) => Promise<{ success: boolean; reference: string; fee: number }>;
}

const PaymentsContext = createContext<PaymentsContextType | undefined>(undefined);

export function PaymentsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  const [payments, setPayments] = useState<Payment[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [cashFlow, setCashFlow] = useState<CashFlowEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<PaymentFilters>({});

  // Carregar dados via API
  const loadPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await paymentsService.getPayments(1, 1000);
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
  };

  const loadBankAccounts = async () => {
    try {
      // TODO: Implementar quando o método estiver disponível na API
      // const response = await paymentsService.getBankAccounts();
      // if (response.success && response.data) {
      //   setBankAccounts(response.data);
      // }
      setBankAccounts([]); // Por enquanto vazio até API estar pronta
    } catch (error) {
      console.error('Erro ao carregar contas bancárias:', error);
    }
  };

  useEffect(() => {
    loadPayments();
    loadBankAccounts();
  }, []);

  // Aplicar filtros
  const filteredPayments = payments.filter(payment => {
    if (filters.status?.length && !filters.status.includes(payment.status)) return false;
    if (filters.method?.length && !filters.method.includes(payment.paymentMethod)) return false;
    if (filters.type?.length && !filters.type.includes(payment.type)) return false;
    if (filters.priority?.length && !filters.priority.includes(payment.priority)) return false;
    if (filters.dateFrom && payment.createdAt < filters.dateFrom) return false;
    if (filters.dateTo && payment.createdAt > filters.dateTo) return false;
    if (filters.amountFrom && payment.amount < filters.amountFrom) return false;
    if (filters.amountTo && payment.amount > filters.amountTo) return false;
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (
        !payment.paymentNumber.toLowerCase().includes(searchLower) &&
        !payment.description?.toLowerCase().includes(searchLower) &&
        !payment.externalReference?.toLowerCase().includes(searchLower) &&
        !payment.supplierName?.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }
    
    return true;
  });

  const createPayment = async (data: CreatePaymentData): Promise<Payment> => {
    try {
      const response = await paymentsService.createPayment(data);
      if (response.success && response.data) {
        setPayments(prev => [...prev, response.data]);
        return response.data;
      } else {
        throw new Error(response.message || 'Erro ao criar pagamento');
      }
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      setError(getErrorMessage(error));
      throw error;
    }
  };

  const updatePayment = async (data: UpdatePaymentData): Promise<Payment> => {
    try {
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
  };

  const deletePayment = async (id: string): Promise<void> => {
    try {
      const response = await paymentsService.deletePayment(id);
      if (response.success) {
        setPayments(prev => prev.filter(payment => payment.id !== id));
      } else {
        throw new Error(response.message || 'Erro ao excluir pagamento');
      }
    } catch (error) {
      console.error('Erro ao excluir pagamento:', error);
      setError(getErrorMessage(error));
      throw error;
    }
  };

  const getPayment = (id: string): Payment | undefined => {
    return payments.find(payment => payment.id === id);
  };

  const schedulePayment = async (id: string, scheduledDate: Date): Promise<void> => {
    try {
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
  };

  const processPayment = async (data: ProcessPaymentData): Promise<void> => {
    try {
      const response = await paymentsService.processPayment(
        data.paymentId, 
        data.externalReference || `TXN-${Date.now()}`,
        data.processedDate
      );
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
  };

  const cancelPayment = async (id: string, reason: string): Promise<void> => {
    try {
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
  };

  const revertPayment = async (id: string, reason: string): Promise<void> => {
    try {
      // Por enquanto vamos usar o cancelPayment como alternativa
      const response = await paymentsService.cancelPayment(id, reason);
      if (response.success && response.data) {
        setPayments(prev => prev.map(payment => payment.id === id ? response.data : payment));
      } else {
        throw new Error(response.message || 'Erro ao reverter pagamento');
      }
    } catch (error) {
      console.error('Erro ao reverter pagamento:', error);
      setError(getErrorMessage(error));
      throw error;
    }
  };

  const approvePayment = async (id: string, notes?: string): Promise<void> => {
    try {
      const response = await paymentsService.approvePayment(id, notes);
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
  };

  const rejectPayment = async (id: string, reason: string): Promise<void> => {
    try {
      const response = await paymentsService.rejectPayment(id, reason);
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
  };

  // Métodos de contas bancárias (TODO: implementar quando API estiver pronta)
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

  const getBankAccount = (id: string): BankAccount | undefined => {
    return bankAccounts.find(account => account.id === id);
  };

  // Fluxo de caixa
  const getCashFlowReport = (startDate: Date, endDate: Date): CashFlowReport => {
    const entries = cashFlow.filter(entry => 
      entry.date >= startDate && entry.date <= endDate
    );

    const totalIncoming = entries
      .filter(entry => entry.type === 'ENTRADA')
      .reduce((sum, entry) => sum + entry.amount, 0);

    const totalOutgoing = entries
      .filter(entry => entry.type === 'SAIDA')
      .reduce((sum, entry) => sum + entry.amount, 0);

    return {
      period: {
        startDate,
        endDate
      },
      openingBalance: 0, // TODO: calcular saldo inicial real
      closingBalance: totalIncoming - totalOutgoing,
      totalInflow: totalIncoming,
      totalOutflow: totalOutgoing,
      netCashFlow: totalIncoming - totalOutgoing,
      entries: entries.sort((a, b) => b.date.getTime() - a.date.getTime()),
      summary: {
        byCategory: {},
        byMonth: {},
        byBankAccount: {}
      }
    };
  };

  const addCashFlowEntry = async (entry: Omit<CashFlowEntry, 'id' | 'createdAt'>): Promise<CashFlowEntry> => {
    // TODO: Implementar com API real
    const newEntry: CashFlowEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setCashFlow(prev => [...prev, newEntry]);
    return newEntry;
  };

  const setFilters = (newFilters: PaymentFilters) => {
    setFiltersState(newFilters);
  };

  const clearFilters = () => {
    setFiltersState({});
  };

  const getStats = (): PaymentStats => {
    const totalPayments = payments.length;
    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
    
    const byStatus = payments.reduce((acc, payment) => {
      acc[payment.status] = (acc[payment.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const processedPayments = payments.filter(p => p.status === 'PROCESSADO').length;
    const pendingPayments = payments.filter(p => p.status === 'PENDENTE').length;
    const scheduledPayments = payments.filter(p => p.status === 'AGENDADO').length;
    const failedPayments = payments.filter(p => p.status === 'FALHADO').length;

    const processedAmount = payments.filter(p => p.status === 'PROCESSADO').reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = payments.filter(p => p.status === 'PENDENTE').reduce((sum, p) => sum + p.amount, 0);

    return {
      totalPayments,
      pendingPayments,
      processedPayments,
      failedPayments,
      totalAmount,
      pendingAmount,
      processedAmount,
      averageAmount: totalPayments > 0 ? totalAmount / totalPayments : 0,
      overduePayments: payments.filter(p => 
        p.scheduledDate && p.scheduledDate < new Date() && p.status === 'AGENDADO'
      ).length,
      scheduledPayments
    };
  };

  const getWorkflow = (id: string): PaymentWorkflow | undefined => {
    const payment = payments.find(p => p.id === id);
    if (!payment) return undefined;

    const steps = [
      { 
        stepNumber: 1, 
        name: 'Criado', 
        description: 'Pagamento registrado', 
        requiredRole: 'USER',
        completedAt: payment.createdAt,
        completedBy: payment.createdBy,
        isActive: false, 
        isCompleted: true 
      },
      { 
        stepNumber: 2, 
        name: 'Aprovado', 
        description: 'Pagamento aprovado', 
        requiredRole: 'PRESIDENTE',
        completedAt: payment.approvalDate,
        completedBy: payment.approvedBy,
        isActive: !payment.approvalDate && !payment.processedDate, 
        isCompleted: !!payment.approvalDate 
      },
      { 
        stepNumber: 3, 
        name: 'Agendado', 
        description: 'Data de pagamento definida', 
        requiredRole: 'FINANCEIRO',
        completedAt: payment.scheduledDate,
        isActive: !!payment.approvalDate && !payment.processedDate && !payment.scheduledDate, 
        isCompleted: !!payment.scheduledDate 
      },
      { 
        stepNumber: 4, 
        name: 'Processado', 
        description: 'Pagamento executado', 
        requiredRole: 'FINANCEIRO',
        completedAt: payment.processedDate,
        isActive: !!payment.scheduledDate && !payment.processedDate, 
        isCompleted: !!payment.processedDate 
      }
    ];

    return {
      paymentId: id,
      currentStep: steps.filter(step => step.isCompleted).length + 1,
      totalSteps: steps.length,
      steps
    };
  };

  const refreshPayments = async (): Promise<void> => {
    await loadPayments();
  };

  const canUserApprovePayment = (paymentId: string): boolean => {
    console.log('Checking approval permission for payment:', paymentId);
    return user?.role === 'PRESIDENTE' || user?.role === 'FINANCEIRO';
  };

  const canUserProcessPayment = (paymentId: string): boolean => {
    console.log('Checking processing permission for payment:', paymentId);
    return user?.role === 'FINANCEIRO';
  };

  const generatePaymentNumber = (): string => {
    const year = new Date().getFullYear();
    const nextNumber = payments.length + 1;
    return `PAY-${year}-${nextNumber.toString().padStart(4, '0')}`;
  };

  const getOverduePayments = (): Payment[] => {
    return payments.filter(payment => 
      payment.scheduledDate && 
      payment.scheduledDate < new Date() && 
      payment.status === 'AGENDADO'
    );
  };

  const getScheduledPayments = (): Payment[] => {
    return payments.filter(payment => payment.status === 'AGENDADO');
  };

  const getTodaysPayments = (): Payment[] => {
    const today = new Date();
    return payments.filter(payment => 
      payment.scheduledDate &&
      payment.scheduledDate.toDateString() === today.toDateString()
    );
  };

  const simulateBankProcessing = async (_paymentId: string): Promise<{ success: boolean; reference: string; fee: number }> => {
    // Simulação de processamento bancário
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      success: Math.random() > 0.1, // 90% de sucesso
      reference: `REF-${Date.now()}`,
      fee: Math.random() * 1000 // Taxa aleatória
    };
  };

  const value: PaymentsContextType = {
    payments,
    bankAccounts,
    cashFlow,
    loading,
    error,
    filters,
    filteredPayments,
    createPayment,
    updatePayment,
    deletePayment,
    getPayment,
    schedulePayment,
    processPayment,
    cancelPayment,
    revertPayment,
    approvePayment,
    rejectPayment,
    createBankAccount,
    updateBankAccount,
    deleteBankAccount,
    getBankAccount,
    getCashFlowReport,
    addCashFlowEntry,
    setFilters,
    clearFilters,
    getStats,
    getWorkflow,
    refreshPayments,
    canUserApprovePayment,
    canUserProcessPayment,
    generatePaymentNumber,
    getOverduePayments,
    getScheduledPayments,
    getTodaysPayments,
    simulateBankProcessing
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
