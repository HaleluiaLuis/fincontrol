import { apiService, ApiResponse, PaginatedResponse } from './api';
import { Transaction, TransactionType, TransactionFormData } from '@/types';

// Tipos específicos para o serviço
export type CreateTransactionData = TransactionFormData;
export type UpdateTransactionData = Partial<TransactionFormData>;

export interface TransactionFilters {
  type?: TransactionType[];
  categories?: string[];
  paymentMethods?: string[];
  status?: string[];
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  suppliers?: string[];
  tags?: string[];
}

// Utilitário para converter filtros para parâmetros de query string
function transactionFiltersToParams(filters: TransactionFilters): Record<string, string> {
  const params: Record<string, string> = {};
  
  if (filters.type?.length) {
    params.type = filters.type.join(',');
  }
  if (filters.categories?.length) {
    params.categories = filters.categories.join(',');
  }
  if (filters.paymentMethods?.length) {
    params.paymentMethods = filters.paymentMethods.join(',');
  }
  if (filters.status?.length) {
    params.status = filters.status.join(',');
  }
  if (filters.suppliers?.length) {
    params.suppliers = filters.suppliers.join(',');
  }
  if (filters.tags?.length) {
    params.tags = filters.tags.join(',');
  }
  if (filters.startDate) {
    params.startDate = filters.startDate.toISOString().split('T')[0];
  }
  if (filters.endDate) {
    params.endDate = filters.endDate.toISOString().split('T')[0];
  }
  if (filters.minAmount !== undefined) {
    params.minAmount = filters.minAmount.toString();
  }
  if (filters.maxAmount !== undefined) {
    params.maxAmount = filters.maxAmount.toString();
  }
  if (filters.search) {
    params.search = filters.search;
  }
  
  return params;
}

export class TransactionsService {
  private readonly baseEndpoint = '/transactions';

  // Listar transações com paginação e filtros
  async getTransactions(
    page: number = 1,
    limit: number = 10,
    filters?: TransactionFilters
  ): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
    const params = {
      page: page.toString(),
      limit: limit.toString(),
      ...(filters ? transactionFiltersToParams(filters) : {}),
    };
    
    return apiService.get<PaginatedResponse<Transaction>>(this.baseEndpoint, params);
  }

  // Obter transação por ID
  async getTransactionById(id: string): Promise<ApiResponse<Transaction>> {
    return apiService.get<Transaction>(`${this.baseEndpoint}/${id}`);
  }

  // Criar nova transação
  async createTransaction(data: CreateTransactionData): Promise<ApiResponse<Transaction>> {
    return apiService.post<Transaction>(this.baseEndpoint, data);
  }

  // Atualizar transação
  async updateTransaction(id: string, data: UpdateTransactionData): Promise<ApiResponse<Transaction>> {
    return apiService.put<Transaction>(`${this.baseEndpoint}/${id}`, data);
  }

  // Deletar transação
  async deleteTransaction(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.delete<{ success: boolean }>(`${this.baseEndpoint}/${id}`);
  }

  // Exportar transações
  async exportTransactions(
    format: 'CSV' | 'EXCEL' | 'PDF' | 'OFX',
    filters?: TransactionFilters
  ): Promise<Blob> {
    const params = {
      format,
      ...(filters ? transactionFiltersToParams(filters) : {}),
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
      throw new Error('Erro ao exportar transações');
    }

    return response.blob();
  }

  // Obter estatísticas de transações
  async getTransactionStats(
    filters?: TransactionFilters
  ): Promise<ApiResponse<{
    total: number;
    totalAmount: number;
    income: {
      count: number;
      amount: number;
    };
    expense: {
      count: number;
      amount: number;
    };
    balance: number;
    averageAmount: number;
    transactionsByMonth: Array<{
      month: string;
      income: number;
      expense: number;
      count: number;
    }>;
  }>> {
    const params = filters ? transactionFiltersToParams(filters) : {};
    return apiService.get<{
      total: number;
      totalAmount: number;
      income: {
        count: number;
        amount: number;
      };
      expense: {
        count: number;
        amount: number;
      };
      balance: number;
      averageAmount: number;
      transactionsByMonth: Array<{
        month: string;
        income: number;
        expense: number;
        count: number;
      }>;
    }>(`${this.baseEndpoint}/stats`, params);
  }
}

// Instância global do serviço de transações
export const transactionsService = new TransactionsService();
