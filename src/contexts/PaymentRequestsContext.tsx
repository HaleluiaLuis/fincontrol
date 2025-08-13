'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { 
  PaymentRequest,
  CreatePaymentRequestData,
  UpdatePaymentRequestData,
  PaymentRequestFilters,
  PaymentRequestStats,
  PaymentRequestStatus,
  PaymentRequestPriority,
  PaymentRequestApproval,
  PaymentRequestWorkflow
} from '@/types/paymentRequest';
import { useAuth } from './AuthContext';
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
}

const PaymentRequestsContext = createContext<PaymentRequestsContextType | undefined>(undefined);

interface PaymentRequestsProviderProps {
  children: React.ReactNode;
}

const DEFAULT_FILTERS: PaymentRequestFilters = {
  search: '',
  status: undefined,
  priority: undefined,
  supplierId: '',
  createdBy: '',
  dateFrom: undefined,
  dateTo: undefined,
  amountMin: undefined,
  amountMax: undefined,
  hasValidContract: undefined,
};

export function PaymentRequestsProvider({ children }: PaymentRequestsProviderProps) {
  const { user } = useAuth();
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PaymentRequestFilters>(DEFAULT_FILTERS);

  // Carregar solicitações de pagamento
  const loadPaymentRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Mock data para desenvolvimento - substituir pela API real quando disponível
      const data: PaymentRequest[] = [];
      setPaymentRequests(data);
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error);
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  // Criar nova solicitação
  const createPaymentRequest = useCallback(async (data: CreatePaymentRequestData): Promise<PaymentRequest> => {
    try {
      setError(null);
      // Mock implementation - substituir pela API real quando disponível
      const newRequest: PaymentRequest = {
        id: `req-${Date.now()}`,
        title: data.title,
        description: data.description,
        supplierId: data.supplierId,
        supplierName: 'Fornecedor Mock',
        items: data.items.map((item, index) => ({
          id: `item-${index}`,
          ...item
        })),
        subtotal: data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0),
        tax: 0,
        totalAmount: data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0),
        status: 'RASCUNHO' as PaymentRequestStatus,
        priority: data.priority,
        documents: [],
        approvals: [],
        requestDate: new Date(),
        dueDate: data.dueDate,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: user?.id || 'system',
        lastModifiedBy: user?.id || 'system',
        publicComments: data.publicComments,
        hasValidContract: true
      };
      setPaymentRequests(prev => [newRequest, ...prev]);
      return newRequest;
    } catch (error) {
      const errorMsg = getErrorMessage(error);
      setError(errorMsg);
      throw error;
    }
  }, [user]);

  // Atualizar solicitação
  const updatePaymentRequest = useCallback(async (data: UpdatePaymentRequestData): Promise<PaymentRequest> => {
    try {
      setError(null);
      // Mock implementation - substituir pela API real quando disponível
      const updatedRequest = paymentRequests.find(r => r.id === data.id);
      if (!updatedRequest) throw new Error('Solicitação não encontrada');
      
      const updated: PaymentRequest = {
        ...updatedRequest,
        title: data.title || updatedRequest.title,
        description: data.description || updatedRequest.description,
        supplierId: data.supplierId || updatedRequest.supplierId,
        priority: data.priority || updatedRequest.priority,
        status: data.status || updatedRequest.status,
        approvals: data.approvals || updatedRequest.approvals,
        currentApprover: data.currentApprover || updatedRequest.currentApprover,
        internalNotes: data.internalNotes || updatedRequest.internalNotes,
        updatedAt: new Date(),
        lastModifiedBy: user?.id || 'system'
      };
      
      setPaymentRequests(prev => 
        prev.map(request => 
          request.id === data.id ? updated : request
        )
      );
      return updated;
    } catch (error) {
      const errorMsg = getErrorMessage(error);
      setError(errorMsg);
      throw error;
    }
  }, [paymentRequests, user]);

  // Excluir solicitação
  const deletePaymentRequest = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      // Mock implementation - substituir pela API real quando disponível
      setPaymentRequests(prev => prev.filter(request => request.id !== id));
    } catch (error) {
      const errorMsg = getErrorMessage(error);
      setError(errorMsg);
      throw error;
    }
  }, []);

  // Buscar solicitação por ID
  const getPaymentRequest = useCallback((id: string): PaymentRequest | undefined => {
    return paymentRequests.find(request => request.id === id);
  }, [paymentRequests]);

  // Aprovar solicitação
  const approveRequest = useCallback(async (id: string, comments?: string): Promise<void> => {
    const request = getPaymentRequest(id);
    if (!request || !user) return;

    const approval: PaymentRequestApproval = {
      id: `approval-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'APROVAR',
      comments,
      date: new Date(),
    };

    await updatePaymentRequest({
      id,
      status: 'AUTORIZADO',
      approvals: [...(request.approvals || []), approval]
    });
  }, [getPaymentRequest, updatePaymentRequest, user]);

  // Rejeitar solicitação
  const rejectRequest = useCallback(async (id: string, comments: string): Promise<void> => {
    const request = getPaymentRequest(id);
    if (!request || !user) return;

    const approval: PaymentRequestApproval = {
      id: `approval-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'REJEITAR',
      comments,
      date: new Date(),
    };

    await updatePaymentRequest({
      id,
      status: 'REJEITADO',
      approvals: [...(request.approvals || []), approval]
    });
  }, [getPaymentRequest, updatePaymentRequest, user]);

  // Validar solicitação
  const validateRequest = useCallback(async (id: string, comments?: string): Promise<void> => {
    const request = getPaymentRequest(id);
    if (!request || !user) return;

    const approval: PaymentRequestApproval = {
      id: `approval-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'VALIDAR',
      comments,
      date: new Date(),
    };

    await updatePaymentRequest({
      id,
      status: 'VALIDADO',
      approvals: [...(request.approvals || []), approval]
    });
  }, [getPaymentRequest, updatePaymentRequest, user]);

  // Solicitar análise
  const requestAnalysis = useCallback(async (id: string, comments: string): Promise<void> => {
    const request = getPaymentRequest(id);
    if (!request || !user) return;

    const approval: PaymentRequestApproval = {
      id: `approval-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'SOLICITAR_ANALISE',
      comments,
      date: new Date(),
    };

    await updatePaymentRequest({
      id,
      status: 'EM_ANALISE',
      approvals: [...(request.approvals || []), approval]
    });
  }, [getPaymentRequest, updatePaymentRequest, user]);

  // Atualizar filtros
  const updateFilters = useCallback((newFilters: PaymentRequestFilters) => {
    setFilters(newFilters);
  }, []);

  // Limpar filtros
  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // Filtrar solicitações
  const filteredRequests = React.useMemo(() => {
    let filtered = paymentRequests;

    // Filtro por busca
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(request => 
        request.title.toLowerCase().includes(searchTerm) ||
        request.description.toLowerCase().includes(searchTerm) ||
        request.supplierName.toLowerCase().includes(searchTerm)
      );
    }

    // Filtro por status
    if (filters.status) {
      filtered = filtered.filter(request => request.status === filters.status);
    }

    // Filtro por prioridade
    if (filters.priority) {
      filtered = filtered.filter(request => request.priority === filters.priority);
    }

    // Filtro por fornecedor
    if (filters.supplierId) {
      filtered = filtered.filter(request => request.supplierId === filters.supplierId);
    }

    // Filtro por criador
    if (filters.createdBy) {
      filtered = filtered.filter(request => request.createdBy === filters.createdBy);
    }

    // Filtro por data
    if (filters.dateFrom) {
      filtered = filtered.filter(request => new Date(request.requestDate) >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      filtered = filtered.filter(request => new Date(request.requestDate) <= filters.dateTo!);
    }

    // Filtro por valor
    if (filters.amountMin !== undefined) {
      filtered = filtered.filter(request => request.totalAmount >= filters.amountMin!);
    }
    if (filters.amountMax !== undefined) {
      filtered = filtered.filter(request => request.totalAmount <= filters.amountMax!);
    }

    // Filtro por contrato válido
    if (filters.hasValidContract !== undefined) {
      filtered = filtered.filter(request => request.hasValidContract === filters.hasValidContract);
    }

    return filtered;
  }, [paymentRequests, filters]);

  // Calcular estatísticas
  const getStats = useCallback((): PaymentRequestStats => {
    const total = paymentRequests.length;
    
    // Estatísticas por status
    const byStatus = paymentRequests.reduce((acc, request) => {
      acc[request.status] = (acc[request.status] || 0) + 1;
      return acc;
    }, {} as Record<PaymentRequestStatus, number>);

    // Estatísticas por prioridade
    const byPriority = paymentRequests.reduce((acc, request) => {
      acc[request.priority] = (acc[request.priority] || 0) + 1;
      return acc;
    }, {} as Record<PaymentRequestPriority, number>);

    // Valores
    const totalAmount = paymentRequests.reduce((sum, request) => sum + request.totalAmount, 0);
    const pendingAmount = paymentRequests
      .filter(r => ['PENDENTE_VALIDACAO', 'EM_ANALISE', 'VALIDADO', 'AUTORIZADO'].includes(r.status))
      .reduce((sum, request) => sum + request.totalAmount, 0);
    const paidAmount = paymentRequests
      .filter(r => r.status === 'PAGO')
      .reduce((sum, request) => sum + request.totalAmount, 0);

    // Tempo médio de processamento (dias)
    const processedRequests = paymentRequests.filter(r => ['PAGO', 'REJEITADO', 'CANCELADO'].includes(r.status));
    const averageProcessingTime = processedRequests.length > 0
      ? processedRequests.reduce((sum, request) => {
          const days = Math.floor((new Date(request.updatedAt).getTime() - new Date(request.createdAt).getTime()) / (1000 * 60 * 60 * 24));
          return sum + days;
        }, 0) / processedRequests.length
      : 0;

    // Taxa de aprovação
    const decidedRequests = paymentRequests.filter(r => ['PAGO', 'REJEITADO'].includes(r.status));
    const approvedRequests = paymentRequests.filter(r => ['PAGO', 'AUTORIZADO'].includes(r.status));
    const approvalRate = decidedRequests.length > 0 ? (approvedRequests.length / decidedRequests.length) * 100 : 0;

    // Solicitações em atraso
    const now = new Date();
    const overdueSolicitations = paymentRequests.filter(r => 
      r.dueDate && new Date(r.dueDate) < now && !['PAGO', 'REJEITADO', 'CANCELADO'].includes(r.status)
    ).length;

    return {
      total,
      byStatus: byStatus as Record<PaymentRequestStatus, number>,
      byPriority,
      totalAmount,
      pendingAmount,
      paidAmount,
      averageProcessingTime,
      approvalRate,
      overdueSolicitations,
    };
  }, [paymentRequests]);

  // Obter workflow da solicitação
  const getWorkflow = useCallback((id: string): PaymentRequestWorkflow | undefined => {
    const request = getPaymentRequest(id);
    if (!request) return undefined;

    const statusSteps: Record<PaymentRequestStatus, number> = {
      'RASCUNHO': 0,
      'PENDENTE_VALIDACAO': 1,
      'EM_ANALISE': 2,
      'VALIDADO': 3,
      'AUTORIZADO': 4,
      'FATURA_REGISTRADA': 5,
      'PENDENTE_PAGAMENTO': 6,
      'PAGO': 7,
      'REJEITADO': -1,
      'CANCELADO': -1,
    };

    const currentStep = statusSteps[request.status] >= 0 ? statusSteps[request.status] : 0;
    const totalSteps = 8;

    const steps = [
      {
        id: 'draft',
        title: 'Rascunho',
        description: 'Solicitação criada',
        status: currentStep >= 0 ? 'COMPLETED' : 'PENDING',
      },
      {
        id: 'validation',
        title: 'Validação',
        description: 'Análise de documentação',
        status: currentStep >= 1 ? (currentStep === 1 ? 'IN_PROGRESS' : 'COMPLETED') : 'PENDING',
      },
      {
        id: 'analysis',
        title: 'Análise',
        description: 'Avaliação técnica',
        status: currentStep >= 2 ? (currentStep === 2 ? 'IN_PROGRESS' : 'COMPLETED') : 'PENDING',
      },
      {
        id: 'validated',
        title: 'Validado',
        description: 'Documentação aprovada',
        status: currentStep >= 3 ? (currentStep === 3 ? 'IN_PROGRESS' : 'COMPLETED') : 'PENDING',
      },
      {
        id: 'authorized',
        title: 'Autorizado',
        description: 'Aprovado pela presidência',
        status: currentStep >= 4 ? (currentStep === 4 ? 'IN_PROGRESS' : 'COMPLETED') : 'PENDING',
      },
      {
        id: 'invoice',
        title: 'Fatura',
        description: 'Fatura registrada',
        status: currentStep >= 5 ? (currentStep === 5 ? 'IN_PROGRESS' : 'COMPLETED') : 'PENDING',
      },
      {
        id: 'pending_payment',
        title: 'Pagamento',
        description: 'Aguardando pagamento',
        status: currentStep >= 6 ? (currentStep === 6 ? 'IN_PROGRESS' : 'COMPLETED') : 'PENDING',
      },
      {
        id: 'paid',
        title: 'Pago',
        description: 'Processo concluído',
        status: currentStep >= 7 ? 'COMPLETED' : 'PENDING',
      },
    ] as const;

    return {
      currentStep: Math.max(0, currentStep),
      totalSteps,
      steps: steps.map(step => ({
        ...step,
        status: step.status as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED'
      })),
    };
  }, [getPaymentRequest]);

  // Atualizar dados
  const refreshRequests = useCallback(async () => {
    await loadPaymentRequests();
  }, [loadPaymentRequests]);

  // Carregar dados iniciais
  useEffect(() => {
    loadPaymentRequests();
  }, [loadPaymentRequests]);

  const contextValue: PaymentRequestsContextType = {
    // Estado
    paymentRequests,
    loading,
    error,
    
    // Filtros
    filters,
    filteredRequests,
    
    // Ações CRUD
    createPaymentRequest,
    updatePaymentRequest,
    deletePaymentRequest,
    getPaymentRequest,
    
    // Ações de fluxo
    approveRequest,
    rejectRequest,
    validateRequest,
    requestAnalysis,
    
    // Filtros e busca
    setFilters: updateFilters,
    clearFilters,
    
    // Estatísticas
    getStats,
    getWorkflow,
    
    // Utilitários
    refreshRequests,
  };

  return (
    <PaymentRequestsContext.Provider value={contextValue}>
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
