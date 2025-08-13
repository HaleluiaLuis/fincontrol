import { apiService, ApiResponse, PaginatedResponse } from './api';
import { Supplier, CreateSupplierData, UpdateSupplierData } from '@/types/supplier';

export interface SupplierFilters {
  status?: ('ATIVO' | 'INATIVO')[];
  types?: string[];
  categories?: string[];
  states?: string[];
  cities?: string[];
  search?: string;
  minTransactionValue?: number;
  maxTransactionValue?: number;
  hasActiveContracts?: boolean;
  registrationDateFrom?: Date;
  registrationDateTo?: Date;
}

// Utilitário para converter filtros para parâmetros de query string
function supplierFiltersToParams(filters: SupplierFilters): Record<string, string> {
  const params: Record<string, string> = {};
  
  if (filters.status?.length) {
    params.status = filters.status.join(',');
  }
  if (filters.types?.length) {
    params.types = filters.types.join(',');
  }
  if (filters.categories?.length) {
    params.categories = filters.categories.join(',');
  }
  if (filters.states?.length) {
    params.states = filters.states.join(',');
  }
  if (filters.cities?.length) {
    params.cities = filters.cities.join(',');
  }
  if (filters.search) {
    params.search = filters.search;
  }
  if (filters.minTransactionValue !== undefined) {
    params.minTransactionValue = filters.minTransactionValue.toString();
  }
  if (filters.maxTransactionValue !== undefined) {
    params.maxTransactionValue = filters.maxTransactionValue.toString();
  }
  if (filters.hasActiveContracts !== undefined) {
    params.hasActiveContracts = filters.hasActiveContracts.toString();
  }
  if (filters.registrationDateFrom) {
    params.registrationDateFrom = filters.registrationDateFrom.toISOString().split('T')[0];
  }
  if (filters.registrationDateTo) {
    params.registrationDateTo = filters.registrationDateTo.toISOString().split('T')[0];
  }
  
  return params;
}

export class SuppliersService {
  private readonly baseEndpoint = '/suppliers';

  // Listar fornecedores com paginação e filtros
  async getSuppliers(
    page: number = 1,
    limit: number = 10,
    filters?: SupplierFilters
  ): Promise<ApiResponse<PaginatedResponse<Supplier>>> {
    const params = {
      page: page.toString(),
      limit: limit.toString(),
      ...(filters ? supplierFiltersToParams(filters) : {}),
    };
    
    return apiService.get<PaginatedResponse<Supplier>>(this.baseEndpoint, params);
  }

  // Obter fornecedor por ID
  async getSupplierById(id: string): Promise<ApiResponse<Supplier>> {
    return apiService.get<Supplier>(`${this.baseEndpoint}/${id}`);
  }

  // Criar novo fornecedor
  async createSupplier(data: CreateSupplierData): Promise<ApiResponse<Supplier>> {
    return apiService.post<Supplier>(this.baseEndpoint, data);
  }

  // Atualizar fornecedor
  async updateSupplier(id: string, data: UpdateSupplierData): Promise<ApiResponse<Supplier>> {
    return apiService.put<Supplier>(`${this.baseEndpoint}/${id}`, data);
  }

  // Deletar fornecedor (soft delete)
  async deleteSupplier(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.delete<{ success: boolean }>(`${this.baseEndpoint}/${id}`);
  }

  // Ativar fornecedor
  async activateSupplier(id: string): Promise<ApiResponse<Supplier>> {
    return apiService.patch<Supplier>(`${this.baseEndpoint}/${id}/activate`, {});
  }

  // Desativar fornecedor
  async deactivateSupplier(
    id: string,
    reason?: string
  ): Promise<ApiResponse<Supplier>> {
    return apiService.patch<Supplier>(`${this.baseEndpoint}/${id}/deactivate`, {
      reason,
    });
  }

  // Validar CNPJ
  async validateCNPJ(cnpj: string): Promise<ApiResponse<{
    valid: boolean;
    companyName?: string;
    fantasyName?: string;
    address?: {
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
      zipCode: string;
    };
    phone?: string;
    email?: string;
    activities?: string[];
    status?: string;
    errors?: string[];
  }>> {
    return apiService.post<{
      valid: boolean;
      companyName?: string;
      fantasyName?: string;
      address?: {
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
      };
      phone?: string;
      email?: string;
      activities?: string[];
      status?: string;
      errors?: string[];
    }>(`${this.baseEndpoint}/validate-cnpj`, { cnpj });
  }

  // Validar CPF
  async validateCPF(cpf: string): Promise<ApiResponse<{
    valid: boolean;
    name?: string;
    errors?: string[];
  }>> {
    return apiService.post<{
      valid: boolean;
      name?: string;
      errors?: string[];
    }>(`${this.baseEndpoint}/validate-cpf`, { cpf });
  }

  // Upload de documento
  async uploadDocument(
    supplierId: string,
    file: File,
    documentType: string,
    description?: string
  ): Promise<ApiResponse<{ documentId: string; url: string }>> {
    return apiService.upload<{ documentId: string; url: string }>(
      `${this.baseEndpoint}/${supplierId}/documents`,
      file,
      { documentType, ...(description ? { description } : {}) }
    );
  }

  // Remover documento
  async removeDocument(
    supplierId: string,
    documentId: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.delete<{ success: boolean }>(
      `${this.baseEndpoint}/${supplierId}/documents/${documentId}`
    );
  }

  // Obter histórico de transações do fornecedor
  async getSupplierTransactions(
    supplierId: string,
    page: number = 1,
    limit: number = 10,
    startDate?: Date,
    endDate?: Date
  ): Promise<ApiResponse<PaginatedResponse<{
    id: string;
    type: 'FATURA' | 'PAGAMENTO';
    amount: number;
    date: Date;
    description: string;
    status: string;
    referenceId: string;
  }>>> {
    const params = {
      page: page.toString(),
      limit: limit.toString(),
      ...(startDate ? { startDate: startDate.toISOString().split('T')[0] } : {}),
      ...(endDate ? { endDate: endDate.toISOString().split('T')[0] } : {}),
    };
    
    return apiService.get<PaginatedResponse<{
      id: string;
      type: 'FATURA' | 'PAGAMENTO';
      amount: number;
      date: Date;
      description: string;
      status: string;
      referenceId: string;
    }>>(`${this.baseEndpoint}/${supplierId}/transactions`, params);
  }

  // Obter estatísticas do fornecedor
  async getSupplierStats(
    supplierId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<ApiResponse<{
    totalTransactions: number;
    totalAmount: number;
    averageAmount: number;
    lastTransactionDate: Date;
    totalInvoices: number;
    paidInvoices: number;
    pendingInvoices: number;
    overdueInvoices: number;
    averagePaymentTime: number; // em dias
    transactionsByMonth: Array<{
      month: string;
      count: number;
      amount: number;
    }>;
  }>> {
    const params = {
      ...(startDate ? { startDate: startDate.toISOString().split('T')[0] } : {}),
      ...(endDate ? { endDate: endDate.toISOString().split('T')[0] } : {}),
    };
    
    return apiService.get<{
      totalTransactions: number;
      totalAmount: number;
      averageAmount: number;
      lastTransactionDate: Date;
      totalInvoices: number;
      paidInvoices: number;
      pendingInvoices: number;
      overdueInvoices: number;
      averagePaymentTime: number;
      transactionsByMonth: Array<{
        month: string;
        count: number;
        amount: number;
      }>;
    }>(`${this.baseEndpoint}/${supplierId}/stats`, params);
  }

  // Obter avaliação do fornecedor
  async getSupplierRating(
    supplierId: string
  ): Promise<ApiResponse<{
    overallRating: number;
    totalReviews: number;
    categories: {
      quality: number;
      delivery: number;
      communication: number;
      pricing: number;
    };
    reviews: Array<{
      id: string;
      userId: string;
      userName: string;
      rating: number;
      comment: string;
      date: Date;
      categories: {
        quality: number;
        delivery: number;
        communication: number;
        pricing: number;
      };
    }>;
  }>> {
    return apiService.get<{
      overallRating: number;
      totalReviews: number;
      categories: {
        quality: number;
        delivery: number;
        communication: number;
        pricing: number;
      };
      reviews: Array<{
        id: string;
        userId: string;
        userName: string;
        rating: number;
        comment: string;
        date: Date;
        categories: {
          quality: number;
          delivery: number;
          communication: number;
          pricing: number;
        };
      }>;
    }>(`${this.baseEndpoint}/${supplierId}/rating`);
  }

  // Adicionar avaliação do fornecedor
  async addSupplierReview(
    supplierId: string,
    review: {
      rating: number;
      comment: string;
      categories: {
        quality: number;
        delivery: number;
        communication: number;
        pricing: number;
      };
    }
  ): Promise<ApiResponse<{ reviewId: string }>> {
    return apiService.post<{ reviewId: string }>(
      `${this.baseEndpoint}/${supplierId}/reviews`,
      review
    );
  }

  // Obter fornecedores similares
  async getSimilarSuppliers(
    supplierId: string,
    limit: number = 5
  ): Promise<ApiResponse<Supplier[]>> {
    return apiService.get<Supplier[]>(`${this.baseEndpoint}/${supplierId}/similar`, {
      limit: limit.toString(),
    });
  }

  // Buscar fornecedores por localização
  async searchSuppliersByLocation(
    latitude: number,
    longitude: number,
    radius: number = 50, // km
    limit: number = 10
  ): Promise<ApiResponse<Array<Supplier & { distance: number }>>> {
    return apiService.get<Array<Supplier & { distance: number }>>(
      `${this.baseEndpoint}/search-by-location`,
      {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radius: radius.toString(),
        limit: limit.toString(),
      }
    );
  }

  // Exportar dados do fornecedor
  async exportSupplierData(
    supplierId: string,
    format: 'pdf' | 'excel' = 'pdf'
  ): Promise<Blob> {
    const response = await fetch(`${apiService['baseUrl']}${this.baseEndpoint}/${supplierId}/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...apiService['headers'],
      },
      body: JSON.stringify({ format }),
    });

    if (!response.ok) {
      throw new Error('Erro ao exportar dados do fornecedor');
    }

    return response.blob();
  }

  // Estatísticas gerais de fornecedores
  async getSuppliersStats(
    filters?: SupplierFilters
  ): Promise<ApiResponse<{
    total: number;
    active: number;
    inactive: number;
    totalTransactionValue: number;
    averageRating: number;
    topCategories: Array<{
      category: string;
      count: number;
      percentage: number;
    }>;
    geographicDistribution: Array<{
      state: string;
      count: number;
      percentage: number;
    }>;
  }>> {
    const params = filters ? supplierFiltersToParams(filters) : {};
    return apiService.get<{
      total: number;
      active: number;
      inactive: number;
      totalTransactionValue: number;
      averageRating: number;
      topCategories: Array<{
        category: string;
        count: number;
        percentage: number;
      }>;
      geographicDistribution: Array<{
        state: string;
        count: number;
        percentage: number;
      }>;
    }>(`${this.baseEndpoint}/stats`, params);
  }
}

// Instância global do serviço de fornecedores
export const suppliersService = new SuppliersService();
