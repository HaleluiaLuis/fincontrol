'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  PaymentRequest,
  PaymentRequestItem,
  CreatePaymentRequestData,
  UpdatePaymentRequestData,
  PaymentRequestFilters,
  PaymentRequestStats,
  PaymentRequestStatus,
  PaymentRequestApproval,
  PaymentRequestWorkflow
} from '@/types/paymentRequest';
import { useAuth } from './AuthContext';
import { transactionsService } from '@/services/transactions.service';
import { getErrorMessage } from '@/lib/utils';

interface PaymentRequestsContextType {
  // Estado
  paymentRequests: PaymentRequest[];
  loading: boolean;
  error: string | null;
  
  // Filtros
  filters: PaymentRequestFilters;
  filteredRequests: PaymentRequest[];
  
  // Ações CRUD
  createPaymentRequest: (data: CreatePaymentRequestData) => Promise<PaymentRequest>;
  updatePaymentRequest: (data: UpdatePaymentRequestData) => Promise<PaymentRequest>;
  deletePaymentRequest: (id: string) => Promise<void>;
  getPaymentRequest: (id: string) => PaymentRequest | undefined;
  
  // Ações de fluxo
  approveRequest: (id: string, comments?: string) => Promise<void>;
  rejectRequest: (id: string, comments: string) => Promise<void>;
  validateRequest: (id: string, comments?: string) => Promise<void>;
  requestAnalysis: (id: string, comments: string) => Promise<void>;
  
  // Filtros e busca
  setFilters: (filters: PaymentRequestFilters) => void;
  clearFilters: () => void;
  
  // Estatísticas
  getStats: () => PaymentRequestStats;
  getWorkflow: (id: string) => PaymentRequestWorkflow | undefined;
  
  // Utilitários
  refreshRequests: () => Promise<void>;
  canUserApprove: (requestId: string) => boolean;
  getUserRequests: () => PaymentRequest[];
  canUserCreate: () => boolean;
  canUserValidate: () => boolean;
  
  // Relatórios
  exportRequests: () => Promise<void>;
}

const PaymentRequestsContext = createContext<PaymentRequestsContextType | undefined>(undefined);

export function PaymentRequestsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<PaymentRequestFilters>({});

  // Carregar dados via API (usando transactions service como base)
  const loadPaymentRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Por enquanto simular carregamento até ter endpoint específico
      // const response = await transactionsService.getTransactions(1, 1000);
      // if (response.success && response.data) {
      //   // Converter transactions em payment requests ou usar endpoint específico
      //   setPaymentRequests(response.data.data);
      // }
      
      // Temporariamente vazio até API estar pronta
      setPaymentRequests([]);
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error);
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPaymentRequests();
  }, []);

  // Aplicar filtros
  const filteredRequests = paymentRequests.filter(request => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (
        !request.requestNumber.toLowerCase().includes(searchLower) &&
        !request.description?.toLowerCase().includes(searchLower) &&
        !request.supplierName?.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }
    
    if (filters.status && request.status !== filters.status) {
      return false;
    }
    
    if (filters.priority && request.priority !== filters.priority) {
      return false;
    }
    
    if (filters.supplierId && request.supplierId !== filters.supplierId) {
      return false;
    }
    
    if (filters.createdBy && request.createdBy !== filters.createdBy) {
      return false;
    }
    
    if (filters.dateFrom && request.createdAt < filters.dateFrom) {
      return false;
    }
    
    if (filters.dateTo && request.createdAt > filters.dateTo) {
      return false;
    }
    
    if (filters.amountFrom && request.totalAmount < filters.amountFrom) {
      return false;
    }
    
    if (filters.amountTo && request.totalAmount > filters.amountTo) {
      return false;
    }
    
    return true;
  });

  const createPaymentRequest = async (data: CreatePaymentRequestData): Promise<PaymentRequest> => {
    try {
      // TODO: Implementar com endpoint específico quando estiver pronto
      // const response = await paymentRequestsService.create(data);
      // if (response.success && response.data) {
      //   setPaymentRequests(prev => [...prev, response.data]);
      //   return response.data;
      // }
      
      // Simulação temporária
      const newRequest: PaymentRequest = {
        id: Date.now().toString(),
        requestNumber: `PR-${new Date().getFullYear()}-${String(paymentRequests.length + 1).padStart(4, '0')}`,
        status: 'RASCUNHO',
        priority: data.priority || 'NORMAL',
        type: data.type || 'FATURA',
        
        supplierId: data.supplierId,
        supplierName: data.supplierName || 'Fornecedor',
        
        description: data.description,
        justification: data.justification,
        
        items: data.items.map((item, index) => ({
          ...item,
          id: (index + 1).toString()
        })),
        
        totalAmount: data.items.reduce((sum, item) => sum + item.totalAmount, 0),
        currency: 'AOA',
        
        requestedBy: user?.email || 'unknown',
        requestedDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: user?.email || 'unknown',
        lastModifiedBy: user?.email || 'unknown',
        
        approvals: [],
        workflow: {
          currentStep: 1,
          totalSteps: 4,
          steps: [
            {
              stepNumber: 1,
              name: 'Criado',
              description: 'Solicitação criada',
              requiredRole: 'USER',
              isCompleted: true,
              completedAt: new Date(),
              completedBy: user?.email || 'unknown',
              isActive: false
            },
            {
              stepNumber: 2,
              name: 'Validação',
              description: 'Aguardando validação',
              requiredRole: 'GABINETE_APOIO',
              isCompleted: false,
              isActive: true
            },
            {
              stepNumber: 3,
              name: 'Aprovação',
              description: 'Aguardando aprovação',
              requiredRole: 'PRESIDENTE',
              isCompleted: false,
              isActive: false
            },
            {
              stepNumber: 4,
              name: 'Finalizado',
              description: 'Processo finalizado',
              requiredRole: 'SYSTEM',
              isCompleted: false,
              isActive: false
            }
          ]
        }
      };
      
      setPaymentRequests(prev => [...prev, newRequest]);
      return newRequest;
    } catch (error) {
      console.error('Erro ao criar solicitação:', error);
      setError(getErrorMessage(error));
      throw error;
    }
  };

  const updatePaymentRequest = async (data: UpdatePaymentRequestData): Promise<PaymentRequest> => {
    try {
      // TODO: Implementar com API real
      const existing = paymentRequests.find(req => req.id === data.id);
      if (!existing) {
        throw new Error('Solicitação não encontrada');
      }

      const updated: PaymentRequest = {
        ...existing,
        ...data,
        updatedAt: new Date(),
        lastModifiedBy: user?.email || 'unknown'
      };

      setPaymentRequests(prev => prev.map(req => req.id === data.id ? updated : req));
      return updated;
    } catch (error) {
      console.error('Erro ao atualizar solicitação:', error);
      setError(getErrorMessage(error));
      throw error;
    }
  };

  const deletePaymentRequest = async (id: string): Promise<void> => {
    try {
      // TODO: Implementar com API real
      setPaymentRequests(prev => prev.filter(req => req.id !== id));
    } catch (error) {
      console.error('Erro ao excluir solicitação:', error);
      setError(getErrorMessage(error));
      throw error;
    }
  };

  const getPaymentRequest = (id: string): PaymentRequest | undefined => {
    return paymentRequests.find(req => req.id === id);
  };

  const approveRequest = async (id: string, comments?: string): Promise<void> => {
    try {
      // TODO: Implementar com API real
      await updatePaymentRequest({
        id,
        status: 'APROVADA'
      });
    } catch (error) {
      console.error('Erro ao aprovar solicitação:', error);
      setError(getErrorMessage(error));
      throw error;
    }
  };

  const rejectRequest = async (id: string, comments: string): Promise<void> => {
    try {
      // TODO: Implementar com API real
      await updatePaymentRequest({
        id,
        status: 'REJEITADA'
      });
    } catch (error) {
      console.error('Erro ao rejeitar solicitação:', error);
      setError(getErrorMessage(error));
      throw error;
    }
  };

  const validateRequest = async (id: string, comments?: string): Promise<void> => {
    try {
      // TODO: Implementar com API real
      await updatePaymentRequest({
        id,
        status: 'VALIDADA'
      });
    } catch (error) {
      console.error('Erro ao validar solicitação:', error);
      setError(getErrorMessage(error));
      throw error;
    }
  };

  const requestAnalysis = async (id: string, comments: string): Promise<void> => {
    try {
      // TODO: Implementar com API real
      await updatePaymentRequest({
        id,
        status: 'EM_ANALISE'
      });
    } catch (error) {
      console.error('Erro ao solicitar análise:', error);
      setError(getErrorMessage(error));
      throw error;
    }
  };

  const setFilters = (newFilters: PaymentRequestFilters) => {
    setFiltersState(newFilters);
  };

  const clearFilters = () => {
    setFiltersState({});
  };

  const getStats = (): PaymentRequestStats => {
    const total = paymentRequests.length;
    const totalAmount = paymentRequests.reduce((sum, req) => sum + req.totalAmount, 0);
    
    const byStatus = paymentRequests.reduce((acc, request) => {
      acc[request.status] = (acc[request.status] || 0) + 1;
      return acc;
    }, {} as Record<PaymentRequestStatus, number>);

    const pending = paymentRequests.filter(r => r.status === 'PENDENTE').length;
    const approved = paymentRequests.filter(r => r.status === 'APROVADA').length;
    const rejected = paymentRequests.filter(r => r.status === 'REJEITADA').length;
    
    const thisMonth = paymentRequests.filter(r => 
      r.createdAt.getMonth() === new Date().getMonth() && 
      r.createdAt.getFullYear() === new Date().getFullYear()
    ).length;

    const averageAmount = total > 0 ? totalAmount / total : 0;
    const averageApprovalTime = 72; // TODO: calcular real

    return {
      total,
      totalAmount,
      byStatus,
      pending,
      approved,
      rejected,
      thisMonth,
      averageAmount,
      averageApprovalTime
    };
  };

  const getWorkflow = (id: string): PaymentRequestWorkflow | undefined => {
    const request = paymentRequests.find(r => r.id === id);
    return request?.workflow;
  };

  const refreshRequests = async (): Promise<void> => {
    await loadPaymentRequests();
  };

  const canUserApprove = (_requestId: string): boolean => {
    return user?.role === 'PRESIDENTE';
  };

  const getUserRequests = (): PaymentRequest[] => {
    return paymentRequests.filter(req => req.createdBy === user?.email);
  };

  const canUserCreate = (): boolean => {
    return !!user; // Qualquer usuário logado pode criar
  };

  const canUserValidate = (): boolean => {
    return user?.role === 'GABINETE_APOIO' || user?.role === 'GABINETE_CONTRATACAO';
  };

  const exportRequests = async (): Promise<void> => {
    // TODO: Implementar exportação
    console.log('Exportando solicitações...');
  };

  const value: PaymentRequestsContextType = {
    paymentRequests,
    loading,
    error,
    filters,
    filteredRequests,
    createPaymentRequest,
    updatePaymentRequest,
    deletePaymentRequest,
    getPaymentRequest,
    approveRequest,
    rejectRequest,
    validateRequest,
    requestAnalysis,
    setFilters,
    clearFilters,
    getStats,
    getWorkflow,
    refreshRequests,
    canUserApprove,
    getUserRequests,
    canUserCreate,
    canUserValidate,
    exportRequests
  };

  return (
    <PaymentRequestsContext.Provider value={value}>
      {children}
    </PaymentRequestsContext.Provider>
  );
}

export function usePaymentRequests() {
  const context = useContext(PaymentRequestsContext);
  if (context === undefined) {
    throw new Error('usePaymentRequests must be used within a PaymentRequestsProvider');
  }
  return context;
}
